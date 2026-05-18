const VIDEO_EXT = /\.(mp4|webm|ogg)(\?.*)?$/i;

export function isVideoUrl(url: string): boolean {
  return VIDEO_EXT.test(url);
}

export function parseStatValue(value: string): { prefix: string; number: number; suffix: string } {
  const match = value.trim().match(/^([^\d]*?)([\d,.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: value };
  const num = parseFloat(match[2].replace(/,/g, ""));
  return { prefix: match[1], number: Number.isFinite(num) ? num : 0, suffix: match[3] };
}
