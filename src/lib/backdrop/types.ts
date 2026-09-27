import type p5 from 'p5';

// A field is a p5 instance-mode sketch: set p.setup / p.draw as usual.
// Colours come from the active theme so one sketch works on any skin.
export type FieldContext = {
  palette: { bg: string; ink: string; accent: string };
  reducedMotion: boolean;
};

export type Field = (p: p5, ctx: FieldContext) => void;
