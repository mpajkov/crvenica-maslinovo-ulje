/* Creates assets/img/paper-grain.png, the tiny "paper grain" texture used behind every section.
 *
 * Why a bitmap: the first version drew the grain with an SVG feTurbulence filter. It looks the same, but the browser
 * has to compute the noise on the CPU before the first paint, which delayed the first paint by about 0.3 seconds on a
 * simulated mid-range phone. A 96 x 96 px PNG (under 5 KB, cached after the first visit) costs nothing.
 *
 * The numbers below were measured on a render of the old filter, so the new texture has the same colour, average
 * strength and spread. That also keeps the text contrast measured on top of it (WCAG 4.5:1) unchanged.
 *
 * Usage (only needed if you want to change the grain, the site itself needs no build step):
 *   npm install sharp
 *   node tools/make-grain.mjs
 */
import sharp from "sharp";

const SIZE = 96;                      // tile size in px
const COLOUR = [97, 104, 84];         // the olive grey of the old filter (its colour matrix 0.12 / 0.14 / 0.09, converted to sRGB)
const STRENGTH = 0.3;                 // how strongly the noise shows (the old SVG filter used 0.3 and an offset of -0.1)
const OFFSET = -0.1;
const SPREAD = 0.11;                  // how much the noise varies from pixel to pixel (measured on a render of the old filter)

let seed = 12345;                     // fixed seed: the same file every time
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gaussian = () => { let sum = 0; for (let i = 0; i < 6; i++) sum += random(); return (sum - 3) / Math.sqrt(0.5); };

const raw = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0; i < SIZE * SIZE; i++) {
  const noise = Math.min(1, Math.max(0, 0.5 + gaussian() * SPREAD));
  const alpha = Math.max(0, STRENGTH * noise + OFFSET);
  raw.set([...COLOUR, Math.round(alpha * 255)], i * 4);
}

await sharp(raw, { raw: { width: SIZE, height: SIZE, channels: 4 } })
  .png({ palette: true, colours: 16, effort: 10 })
  .toFile(new URL("../assets/img/paper-grain.png", import.meta.url).pathname);
console.log("assets/img/paper-grain.png written");
