const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const backup = path.join("public", "qa-assistant-logo-original.png");
const out = path.join("public", "qa-assistant-logo.png");

(async () => {
  if (!fs.existsSync(backup)) {
    throw new Error("Missing backup original logo");
  }

  const { data, info } = await sharp(backup)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const N = width * height;
  const alpha = new Uint8Array(N);
  alpha.fill(255);

  const idx = (x, y) => y * width + x;
  const color = (i) => {
    const o = i * channels;
    return [data[o], data[o + 1], data[o + 2]];
  };

  const colorDist = (a, b) => {
    const dr = a[0] - b[0];
    const dg = a[1] - b[1];
    const db = a[2] - b[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // Flood-fill from borders using local color continuity (removes gradient bg)
  const visited = new Uint8Array(N);
  const queue = new Int32Array(N);
  let qh = 0;
  let qt = 0;

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = idx(x, y);
    if (visited[i]) return;
    visited[i] = 1;
    queue[qt++] = i;
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  const THRESH = 38;

  while (qh < qt) {
    const i = queue[qh++];
    alpha[i] = 0;
    const c = color(i);
    const x = i % width;
    const y = (i / width) | 0;
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const ni = idx(nx, ny);
      if (visited[ni]) continue;
      const nc = color(ni);
      // Keep saturated yellow/orange robot pixels
      const maxc = Math.max(nc[0], nc[1], nc[2]);
      const minc = Math.min(nc[0], nc[1], nc[2]);
      const sat = maxc - minc;
      const isYellowRobot =
        sat > 45 && nc[0] > 120 && nc[1] > 70 && nc[0] - nc[2] > 35;
      if (isYellowRobot) continue;
      if (colorDist(c, nc) <= THRESH) {
        visited[ni] = 1;
        queue[qt++] = ni;
      }
    }
  }

  // Soften edges: any remaining low-sat near-transparent fringe
  for (let i = 0; i < N; i++) {
    if (alpha[i] === 0) continue;
    const [r, g, b] = color(i);
    const maxc = Math.max(r, g, b);
    const minc = Math.min(r, g, b);
    const sat = maxc - minc;
    const isYellow = sat > 40 && r > 110 && g > 60 && r - b > 30;
    const isDarkMetal = maxc < 90 && sat < 35;
    const isBlackEye = maxc < 55;
    if (!isYellow && !isDarkMetal && !isBlackEye && sat < 30) {
      alpha[i] = 0;
    }
  }

  // Apply alpha
  for (let i = 0; i < N; i++) {
    data[i * channels + 3] = alpha[i];
  }

  // Bounding box
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[idx(x, y)] > 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 20;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const side = Math.max(bw, bh) + 16;

  const square = Buffer.alloc(side * side * 4, 0);
  const ox = Math.floor((side - bw) / 2);
  const oy = Math.floor((side - bh) / 2);
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const si = ((minY + y) * width + (minX + x)) * channels;
      const di = ((oy + y) * side + (ox + x)) * 4;
      square[di] = data[si];
      square[di + 1] = data[si + 1];
      square[di + 2] = data[si + 2];
      square[di + 3] = data[si + 3];
    }
  }

  // Circular alpha mask
  const cx = (side - 1) / 2;
  const cy = (side - 1) / 2;
  const radius = side / 2 - 1;
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      const i = (y * side + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > radius) square[i + 3] = 0;
      else if (r > radius - 1.5) {
        square[i + 3] = Math.round(square[i + 3] * ((radius - r) / 1.5));
      }
    }
  }

  await sharp(square, { raw: { width: side, height: side, channels: 4 } })
    .resize(2048, 2048, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 6 })
    .toFile(out);

  const m = await sharp(out).metadata();
  console.log("cutout ok", `${bw}x${bh}`, "->", `${m.width}x${m.height}`, "hasAlpha", m.hasAlpha);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
