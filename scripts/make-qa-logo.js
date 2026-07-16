const sharp = require("sharp");
const path = require("path");

const backup = path.join("public", "qa-assistant-logo-original.png");
const out = path.join("public", "qa-assistant-logo.png");

(async () => {
  const meta = await sharp(backup).metadata();
  const w = meta.width;
  const h = meta.height;

  // Center square crop (full height) — robot is centered in the frame
  const side = Math.min(w, h);
  const left = Math.floor((w - side) / 2);
  const top = Math.floor((h - side) / 2);

  // Slight zoom so the figure sits at the circle edge
  const zoom = 1.08;
  const extractSize = Math.floor(side / zoom);
  const exLeft = left + Math.floor((side - extractSize) / 2);
  const exTop = top + Math.floor((side - extractSize) / 2);

  const SIZE = 2048;
  const { data, info } = await sharp(backup)
    .extract({
      left: exLeft,
      top: Math.max(0, exTop),
      width: extractSize,
      height: extractSize,
    })
    .resize(SIZE, SIZE, { kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const radius = width / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > radius) {
        data[i + 3] = 0;
      } else if (r > radius - 2) {
        data[i + 3] = Math.round(255 * ((radius - r) / 2));
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 6 })
    .toFile(out);

  console.log(
    "circular 4k logo",
    `${w}x${h}`,
    "->",
    `${SIZE}x${SIZE}`,
    "crop",
    extractSize
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
