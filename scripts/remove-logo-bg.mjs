import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { renameSync, copyFileSync, unlinkSync, existsSync } from "fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = join(root, "src/assets/logo.png");
const outPath = join(root, "src/assets/logo-transparent.png");

const EDGE_BLACK_MAX = 52;
/** Dark, low-chroma pixels outside the tire are removed (badge fill, shadows, halos). */
const DARK_LUM_MAX = 98;
const CHROMA_MIN = 28;

/** Tire disc in source image coordinates (1024×682). */
const TIRE = { cx: 278, cy: 338, rx: 108, ry: 102 };

function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function lum(r, g, b) {
  return Math.max(r, g, b);
}

function inTireZone(x, y) {
  const dx = (x - TIRE.cx) / TIRE.rx;
  const dy = (y - TIRE.cy) / TIRE.ry;
  return dx * dx + dy * dy <= 1;
}

function isEdgeBackground(r, g, b) {
  return lum(r, g, b) <= EDGE_BLACK_MAX;
}

function isDarkShadow(r, g, b) {
  const L = lum(r, g, b);
  if (L > 105) return false;
  // Dark red drop shadows, gray halos, near-black fills
  if (L < 100 && g < 55 && b < 55) return true;
  if (L <= DARK_LUM_MAX && chroma(r, g, b) < CHROMA_MIN) return true;
  return false;
}

function shouldRemoveDarkFill(r, g, b, x, y) {
  if (inTireZone(x, y)) return false;
  if (r > 140 && g > 140 && b > 140) return false;
  return isDarkShadow(r, g, b);
}

function floodFromEdges(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const push = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (!isEdgeBackground(data[i], data[i + 1], data[i + 2])) return;
    visited[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length) {
    const idx = queue.pop();
    const i = idx * 4;
    data[i + 3] = 0;

    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0) push(x - 1, y);
    if (x < width - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < height - 1) push(x, y + 1);
  }
}

function removeInnerBlack(data, width, height) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (shouldRemoveDarkFill(r, g, b, x, y)) {
        data[i + 3] = 0;
      }
    }
  }
}

/** Peel dark rings that touch transparency (badge outline shadows). */
function peelDarkEdges(data, width, height, passes = 6) {
  for (let pass = 0; pass < passes; pass++) {
    const alpha = new Uint8Array(width * height);
    for (let idx = 0; idx < width * height; idx++) {
      alpha[idx] = data[idx * 4 + 3];
    }

    let changed = false;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (alpha[idx] === 0) continue;

        let touchesTransparent = false;
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (alpha[ny * width + nx] === 0) {
            touchesTransparent = true;
            break;
          }
        }
        if (!touchesTransparent) continue;

        const i = idx * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (inTireZone(x, y)) continue;
        if (!isDarkShadow(r, g, b)) continue;

        data[i + 3] = 0;
        changed = true;
      }
    }
    if (!changed) break;
  }
}

const defaultSource =
  "C:\\Users\\Administrator\\.cursor\\projects\\c-tire-drive-pro\\assets\\c__Users_Administrator_AppData_Roaming_Cursor_User_workspaceStorage_6a6f2b654a9946d0c43cfbb153236203_images_WhatsApp_Image_2026-05-19_at_11.06.30-55247d83-7300-4c2a-8db8-2dfe45ae1dff.png";

const input = existsSync(defaultSource) ? defaultSource : logoPath;
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

floodFromEdges(data, info.width, info.height);
removeInnerBlack(data, info.width, info.height);
peelDarkEdges(data, info.width, info.height);

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outPath);

try {
  renameSync(outPath, logoPath);
} catch {
  copyFileSync(outPath, logoPath);
  unlinkSync(outPath);
}

let transparent = 0;
for (let i = 3; i < data.length; i += 4) {
  if (data[i] < 10) transparent++;
}
console.log(
  `Updated ${logoPath} (${info.width}x${info.height}) — ${((transparent / (data.length / 4)) * 100).toFixed(1)}% transparent.`,
);
