// A theme is one <name>.css file in this folder defining the variables in night-field.css.
export const THEMES = Object.keys(import.meta.glob('./*.css')).map((p) => p.slice(2, -4));
export const DEFAULT_THEME = 'night-field';
