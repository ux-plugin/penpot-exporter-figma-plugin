export type Gradient = {
  type: 'linear' | 'radial' | 'angular' | 'diamond';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  /** Angular only: normalized X of the perpendicular axis endpoint (pointAt90). */
  widthX?: number;
  /** Angular only: normalized Y of the perpendicular axis endpoint (pointAt90). */
  widthY?: number;
  stops: GradientStop[];
};

type GradientStop = {
  color: string;
  opacity?: number;
  offset: number;
};
