// Selection types — shared between web (real selection) and desktop
// (always null bbox, "selection" is just a clipboard string treated as
// text). The implementation that reads from window.getSelection lives
// in the web-inpage ambient; the Composer only sees the type.

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
