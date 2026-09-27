import type p5 from 'p5';
import type { Field } from '../types';

const GAP = 32;

const dotWave: Field = (p, { palette }) => {
  let ink: p5.Color;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
    ink = p.color(palette.ink);
  };

  p.draw = () => {
    p.background(palette.bg);
    const t = p.millis() / 4000;
    for (let y = GAP / 2; y < p.height; y += GAP) {
      for (let x = GAP / 2; x < p.width; x += GAP) {
        const c = x / GAP;
        const r = y / GAP;
        const n = (Math.sin(c * 0.23 + r * 0.11 + t) + Math.cos(r * 0.29 - c * 0.09 - t * 0.7) + 2) / 4;
        ink.setAlpha(255 * (0.08 + n * 0.42));
        p.fill(ink);
        p.circle(x, y, 1 + n * n * 4.2);
      }
    }
  };
};

export default dotWave;
