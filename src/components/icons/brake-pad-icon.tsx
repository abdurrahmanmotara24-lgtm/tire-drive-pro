import { createLucideIcon } from "lucide-react";

/**
 * Disc brake icon — tuned for 20px service cards: clear silhouette, minimal detail.
 */
export const BrakePad = createLucideIcon("BrakePad", [
  ["circle", { cx: "12", cy: "12", r: "7", key: "rotor" }],
  ["circle", { cx: "12", cy: "12", r: "3.15", key: "hub" }],
  [
    "path",
    {
      d: "M12 10.08 13.04 10.68v1.84l-1.04.6-1.04-.6v-1.84L12 10.08z",
      key: "nut",
    },
  ],
  ["circle", { cx: "12", cy: "9.1", r: "0.42", key: "lug-t" }],
  ["circle", { cx: "12", cy: "14.9", r: "0.42", key: "lug-b" }],
  ["circle", { cx: "9.1", cy: "12", r: "0.42", key: "lug-l" }],
  ["circle", { cx: "14.9", cy: "12", r: "0.42", key: "lug-r" }],
  [
    "path",
    {
      d: "M15.45 6.48A7 7 0 0 1 16.9 8.7L18.95 9.25 20.5 7.55 19.85 5.1 15.7 5.82A7 7 0 0 1 15.45 6.48z",
      key: "caliper",
    },
  ],
]);
