// Pixel Studio web runtime: live ordered dither, dissolve, corruption, and sprite playback on <canvas>.
// Colors come from pixel-presets.js, generated from the same presets.json the CLI uses.
import { PRESETS, DEFAULT_PRESET } from "./pixel-presets.js";

const reducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function hexRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function getPreset(name = DEFAULT_PRESET) {
  const preset = PRESETS[name];
  if (!preset) throw new Error(`unknown preset "${name}"`);
  return preset;
}

export function colorOf(preset, name) {
  return hexRgb(preset.palette[name] ?? name);
}

export function ramp(presetName, rampName) {
  const preset = getPreset(presetName);
  const names = preset.ramps[rampName ?? preset.default_ramp] ?? rampName.split(",");
  return names.map((n) => colorOf(preset, n));
}

export function bayer(n) {
  let m = [[0]];
  while (m.length < n) {
    const s = m.length;
    const next = Array.from({ length: 2 * s }, () => new Array(2 * s));
    for (let y = 0; y < s; y++)
      for (let x = 0; x < s; x++) {
        const v = 4 * m[y][x];
        next[y][x] = v;
        next[y][x + s] = v + 2;
        next[y + s][x] = v + 3;
        next[y + s][x + s] = v + 1;
      }
    m = next;
  }
  return m.map((row) => row.map((v) => (v + 0.5) / (n * n)));
}

function nearest(colors, r, g, b) {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < colors.length; i++) {
    const [pr, pg, pb] = colors[i];
    const rm = (r + pr) / 2;
    const d = (2 + rm / 256) * (r - pr) ** 2 + 4 * (g - pg) ** 2 + (2 + (255 - rm) / 256) * (b - pb) ** 2;
    if (d < bestD) {
      best = i;
      bestD = d;
    }
  }
  return best;
}

function gradient(x, y, w, h, direction) {
  switch (direction) {
    case "right": return x / Math.max(w - 1, 1);
    case "left": return 1 - x / Math.max(w - 1, 1);
    case "down": return y / Math.max(h - 1, 1);
    case "up": return 1 - y / Math.max(h - 1, 1);
    case "center":
      return 1 - Math.hypot(x - (w - 1) / 2, y - (h - 1) / 2) / Math.max(Math.hypot(w / 2, h / 2), 1);
    default: return 0;
  }
}

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A grid is { w, h, colors: [[r,g,b]...], idx: Int16Array } where -1 is transparent.
 * Every effect below takes a grid and never mutates it.
 */
export function ditherGrid(source, opts = {}) {
  const preset = getPreset(opts.preset);
  const colors = ramp(opts.preset, opts.ramp);
  const n = Number(String(opts.dither ?? preset.dither).replace("bayer", "")) || 4;
  const spread = opts.spread ?? preset.spread;
  const srcW = source.naturalWidth || source.videoWidth || source.width;
  const srcH = source.naturalHeight || source.videoHeight || source.height;
  const w = opts.width ?? preset.width;
  const h = opts.height ?? Math.max(1, Math.round((srcH * w) / srcW));
  const work = document.createElement("canvas");
  work.width = w;
  work.height = h;
  const ctx = work.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  let lo = 0;
  let hi = 255;
  if (opts.autocontrast ?? preset.autocontrast) {
    const hist = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4)
      hist[Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])]++;
    const cut = (w * h) / 100;
    for (let acc = 0; lo < 255 && (acc += hist[lo]) <= cut; lo++);
    for (let acc = 0; hi > 0 && (acc += hist[hi]) <= cut; hi--);
    if (hi <= lo) [lo, hi] = [0, 255];
  }
  const stretch = 255 / (hi - lo);

  const mat = bayer(n);
  const idx = new Int16Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (data[i * 4 + 3] < 128) {
        idx[i] = -1;
        continue;
      }
      const off = (mat[y % n][x % n] - 0.5) * spread * 255;
      const c = (k) => (data[i * 4 + k] - lo) * stretch + off;
      idx[i] = nearest(colors, c(0), c(1), c(2));
    }
  return { w, h, colors, idx };
}

export function drawGrid(canvas, grid, idx = grid.idx) {
  if (canvas.width !== grid.w || canvas.height !== grid.h) {
    canvas.width = grid.w;
    canvas.height = grid.h;
  }
  canvas.style.imageRendering = "pixelated";
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(grid.w, grid.h);
  for (let i = 0; i < idx.length; i++) {
    if (idx[i] < 0) continue;
    const [r, g, b] = grid.colors[idx[i]];
    img.data.set([r, g, b, 255], i * 4);
  }
  ctx.putImageData(img, 0, 0);
}

function withColor(grid, rgb) {
  const found = grid.colors.findIndex((c) => c.join() === rgb.join());
  if (found >= 0) return [grid, found];
  return [{ ...grid, colors: [...grid.colors, rgb] }, grid.colors.length];
}

/** Bayer-ordered removal. Resolves when done; with reduced motion it jumps to the end state. */
export function dissolve(canvas, grid, opts = {}) {
  const { duration = 1200, direction = "right", reverse = false, bg = null, preset } = opts;
  let g = grid;
  let bgIndex = -1;
  if (bg) [g, bgIndex] = withColor(grid, colorOf(getPreset(preset), bg));
  const mat = bayer(8);
  const keys = new Float32Array(g.w * g.h);
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      const b = mat[y % 8][x % 8];
      keys[y * g.w + x] = direction === "none" ? b : 1 - (b + gradient(x, y, g.w, g.h, direction)) / 2;
    }
  const frame = (t) => drawGrid(canvas, g, g.idx.map((v, i) => (keys[i] < t ? bgIndex : v)));
  if (reducedMotion()) {
    frame(reverse ? 0 : 1);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      frame(reverse ? 1 - p : p);
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

/** Signal-block corruption eating in from an edge. Returns stop(). Static single frame under reduced motion. */
export function corrupt(canvas, grid, opts = {}) {
  const preset = getPreset(opts.preset);
  const { fps = 12, intensity = 0.25, direction = "right", seed = 7 } = opts;
  const block = opts.block || preset.block || Math.max(2, Math.floor(grid.w / 24));
  let [g, accent] = withColor(grid, colorOf(preset, opts.accent ?? preset.accent));
  let hole = -1;
  if (opts.bg !== null) [g, hole] = withColor(g, colorOf(preset, opts.bg ?? preset.bg));
  const rand = mulberry32(seed);
  const bw = Math.ceil(g.w / block);
  const bh = Math.ceil(g.h / block);
  const pulls = [];
  for (let by = 0; by < bh; by++)
    for (let bx = 0; bx < bw; bx++) pulls.push(gradient(bx * block, by * block, g.w, g.h, direction));
  const base = pulls.map(() => rand());
  const threshold = 0.925 - intensity;

  const frame = () => {
    const idx = g.idx.slice();
    pulls.forEach((pull, b) => {
      const key = pull * 0.5 + (base[b] * 0.75 + rand() * 0.25) * 0.5;
      let c;
      if (key > threshold) c = accent;
      else if (key > threshold - 0.1 && rand() < 0.25) c = hole;
      else return;
      const bx = (b % bw) * block;
      const by = Math.floor(b / bw) * block;
      for (let y = by; y < Math.min(g.h, by + block); y++)
        for (let x = bx; x < Math.min(g.w, bx + block); x++) idx[y * g.w + x] = c;
    });
    drawGrid(canvas, g, idx);
  };
  frame();
  if (reducedMotion()) return () => {};
  const timer = setInterval(frame, 1000 / fps);
  return () => clearInterval(timer);
}

/** Parse the CLI's .sprite text format into grids (one per frame). */
export function parseSprite(text, presetName) {
  const preset = getPreset(presetName);
  const legend = { ".": null, " ": null };
  const frames = [];
  let section = null;
  let fps = null;
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith("//")) continue;
    if (!line) {
      if (section === "legend") section = null;
      continue;
    }
    const [head, rest] = [line.split(" ")[0], line.slice(line.indexOf(" ") + 1)];
    if (line === "legend") section = "legend";
    else if (head === "fps") fps = Number(rest);
    else if (head === "frame") {
      frames.push([]);
      section = "frame";
    } else if (section === "legend" && line.includes("=")) {
      const [ch, val] = line.split("=").map((s) => s.trim());
      legend[ch || " "] = val === "none" || val === "transparent" ? null : val;
    } else if (section === "frame") frames[frames.length - 1].push(line);
  }
  const names = [...new Set(Object.values(legend).filter(Boolean))];
  const colors = names.map((n) => colorOf(preset, n));
  const w = Math.max(...frames.flat().map((r) => r.length));
  const grids = frames.map((rows) => {
    const idx = new Int16Array(w * rows.length).fill(-1);
    rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        const v = legend[ch];
        if (v) idx[y * w + x] = names.indexOf(v);
      })
    );
    return { w, h: rows.length, colors, idx };
  });
  return { frames: grids, fps };
}

/** Loop a list of grids (from parseSprite). Returns stop(). */
export function playFrames(canvas, frames, fps = 6) {
  let i = 0;
  drawGrid(canvas, frames[0]);
  if (frames.length < 2 || reducedMotion()) return () => {};
  const timer = setInterval(() => drawGrid(canvas, frames[(i = (i + 1) % frames.length)]), 1000 / fps);
  return () => clearInterval(timer);
}

/** Play a CLI-exported sprite sheet (the -sheet.png + .json pair). Returns stop(). */
export function playSheet(canvas, sheetUrl, meta) {
  const img = new Image();
  let timer = null;
  let stopped = false;
  img.onload = () => {
    if (stopped) return;
    canvas.width = meta.frameWidth;
    canvas.height = meta.frameHeight;
    canvas.style.imageRendering = "pixelated";
    const ctx = canvas.getContext("2d");
    let i = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, i * meta.frameWidth, 0, meta.frameWidth, meta.frameHeight, 0, 0, meta.frameWidth, meta.frameHeight);
      i = (i + 1) % meta.frames;
    };
    draw();
    if (!reducedMotion()) timer = setInterval(draw, 1000 / meta.fps);
  };
  img.src = sheetUrl;
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}

/**
 * Live poster dither from `pixel.py poster --field`. Plays the exported build, then idles with a few
 * cells blinking in textured areas. A lens of photo follows the pointer; a press sends a ring of
 * flipped cells out from the point. With reduced motion it draws the finished field and keeps only
 * the lens. Returns stop().
 *
 * The canvas is drawn at device resolution with a whole number of device pixels per cell, so the
 * browser never rescales the grid (a fractional scale doubles a pixel column every so often, and on
 * a 1px-gap grid those beat into visible bands). Size the canvas with CSS; the field covers it like
 * object-fit: cover, anchored by `align`.
 *
 * opts: photo (loaded <img> of field.photo), build (true), pinWindow (show the exported --window at
 * rest), lens ([w, h] in cells, or null), flicker (cells lit at once), idleFps, ripple (true),
 * align ("center" | "left" | "right").
 */
export function ditherField(canvas, field, opts = {}) {
  const {
    photo = null, build = true, pinWindow = false, lens = [26, 14],
    flicker = 24, idleFps = 10, ripple = true, seed = 11, align = "center",
  } = opts;
  const { cols, rows, cell, gap, ox, oy } = field;
  const n = cols * rows;
  const still = reducedMotion();
  canvas.style.touchAction = "pan-y";
  // c and g are the cell and gap in device pixels; x0, y0 place the grid in the canvas.
  let c = cell, g = gap, x0 = 0, y0 = 0;
  const layout = () => {
    const dpr = globalThis.devicePixelRatio || 1;
    const bw = Math.round(canvas.clientWidth * dpr) || cols * cell;
    const bh = Math.round(canvas.clientHeight * dpr) || rows * cell;
    canvas.width = bw;
    canvas.height = bh;
    c = Math.max(1, Math.ceil(bh / rows - 0.01), Math.ceil(bw / cols - 0.01));
    g = c > 1 ? Math.max(1, Math.round((gap * c) / cell)) : 0;
    const spare = bw - cols * c;
    x0 = align === "left" ? 0 : align === "right" ? spare : Math.round(spare / 2);
    y0 = Math.round((bh - rows * c) / 2);
  };
  layout();
  const ctx = canvas.getContext("2d");
  const rng = mulberry32(seed);

  const bits = Uint8Array.from(field.start, (c) => +c);
  let frame = 0;
  const applyFlips = (upto) => {
    for (; frame < Math.min(upto, field.flips.length); frame++) for (const i of field.flips[frame]) bits[i] ^= 1;
  };
  if (!build || still) applyFlips(Infinity);

  // Blinks only where ink and paper meet; one inside solid ink or open paper reads as a glitch.
  let pool = null;
  const buildPool = () => {
    pool = [];
    for (let i = 0; i < n; i++) {
      const x = i % cols;
      const near = [x > 0 ? i - 1 : -1, x < cols - 1 ? i + 1 : -1, i - cols, i + cols];
      if (near.some((j) => j >= 0 && j < n && bits[j] !== bits[i])) pool.push(i);
    }
  };
  const blinks = new Map();
  const lifetimes = [1, 1, 1, 2, 2, 3, 4, 5];
  const spawnRate = flicker / (lifetimes.reduce((a, b) => a + b) / lifetimes.length);
  const tickBlinks = () => {
    for (const [i, left] of blinks) {
      if (left > 1) blinks.set(i, left - 1);
      else blinks.delete(i);
    }
    const count = Math.floor(-Math.log(1 - rng()) * spawnRate);
    for (let k = 0; k < count && pool.length; k++) {
      const i = pool[Math.floor(rng() * pool.length)];
      if (!blinks.has(i)) blinks.set(i, lifetimes[Math.floor(rng() * lifetimes.length)]);
    }
  };

  const lensState = { x: cols / 2, y: rows / 2, size: 0, target: 0 };
  let wave = null;

  const lensRect = () => {
    if (!lens || !photo || lensState.size <= 0) return null;
    const w = Math.max(1, Math.round(lens[0] * lensState.size));
    const h = Math.max(1, Math.round(lens[1] * lensState.size));
    const cx = Math.min(Math.max(Math.round(lensState.x - w / 2), 0), cols - w);
    const cy = Math.min(Math.max(Math.round(lensState.y - h / 2), 0), rows - h);
    return [cx, cy, w, h];
  };

  const draw = (now) => {
    const bw = canvas.width;
    const bh = canvas.height;
    ctx.fillStyle = field.paper;
    ctx.fillRect(0, 0, bw, bh);
    ctx.fillStyle = field.ink;
    const r = wave ? (now - wave.t0) * 0.09 : -1;
    for (let i = 0; i < n; i++) {
      const x = i % cols;
      const px = x0 + x * c;
      if (px + c <= 0 || px >= bw) continue;
      const y = (i / cols) | 0;
      let v = bits[i] ^ (blinks.has(i) ? 1 : 0);
      if (wave && Math.abs(Math.hypot(x - wave.x, y - wave.y) - r) < 1.2) v ^= 1;
      if (v) ctx.fillRect(px, y0 + y * c, c - g, c - g);
    }
    if (!photo || !photo.complete) return;
    const win = field.window;
    const rect = lensRect() ?? (pinWindow && win
      ? [(win[0] - ox) / cell, (win[1] - oy) / cell, (win[2] - win[0]) / cell, (win[3] - win[1]) / cell]
      : null);
    if (!rect) return;
    const [cx, cy, w, h] = rect;
    ctx.drawImage(photo, ox + cx * cell, oy + cy * cell, w * cell - gap, h * cell - gap,
      x0 + cx * c, y0 + cy * c, w * c - g, h * c - g);
  };

  const toCells = (e) => {
    const b = canvas.getBoundingClientRect();
    return [((e.clientX - b.left) * (canvas.width / b.width) - x0) / c, ((e.clientY - b.top) * (canvas.height / b.height) - y0) / c];
  };
  let dirty = true;
  const onMove = (e) => {
    [lensState.x, lensState.y] = toCells(e);
    lensState.target = 1;
    dirty = true;
  };
  const onLeave = () => { lensState.target = 0; };
  const onDown = (e) => {
    onMove(e);
    if (ripple && !still) {
      const [x, y] = toCells(e);
      wave = { x, y, t0: performance.now() };
    }
  };
  const onUp = (e) => { if (e.pointerType !== "mouse") onLeave(); };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onLeave);
  photo?.addEventListener?.("load", () => { dirty = true; });

  const ro = typeof ResizeObserver === "function"
    ? new ResizeObserver(() => { layout(); dirty = true; schedule(); })
    : null;
  ro?.observe(canvas);

  let visible = true;
  const io = typeof IntersectionObserver === "function"
    ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); })
    : null;
  io?.observe(canvas);

  const t0 = performance.now();
  let lastIdle = 0;
  let raf = 0;
  const loop = (now) => {
    raf = 0;
    if (frame < field.flips.length) {
      applyFlips(Math.floor(((now - t0) / 1000) * field.fps));
      dirty = true;
    } else if (!still && flicker > 0) {
      if (!pool) buildPool();
      if (now - lastIdle >= 1000 / idleFps) { tickBlinks(); lastIdle = now; dirty = true; }
    }
    if (lensState.size !== lensState.target) {
      const step = still ? 1 : 0.12;
      lensState.size = lensState.target > lensState.size
        ? Math.min(lensState.target, lensState.size + step) : Math.max(lensState.target, lensState.size - step);
      dirty = true;
    }
    if (wave) {
      if ((now - wave.t0) * 0.09 > 48) wave = null;
      dirty = true;
    }
    if (dirty) { draw(now); dirty = false; }
    schedule();
  };
  const schedule = () => { if (!raf && visible && !stopped) raf = requestAnimationFrame(loop); };
  let stopped = false;
  draw(t0);
  schedule();

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    io?.disconnect();
    ro?.disconnect();
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onLeave);
  };
}
