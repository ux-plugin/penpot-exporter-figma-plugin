import { applyMatrixToPoint } from '@plugin/utils/applyMatrixToPoint';
import { matrixInvert } from '@plugin/utils/matrixInvert';

export interface RadialGradientPoints {
  start: number[];
  end: number[];
  rx: number;
  ry: number;
}

const DEFAULT_FALLBACK: RadialGradientPoints = {
  start: [0.5, 0.5],
  end: [0.5, 1],
  rx: 0.5,
  ry: 0.5
};

function distance(a: number[], b: number[]): number {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

export const calculateRadialGradient = (t: Transform): RadialGradientPoints => {
  if (!t || t.length < 2) {
    return { ...DEFAULT_FALLBACK };
  }

  const transform = t.length === 2 ? [...t, [0, 0, 1]] : [...t];
  const mxInv = matrixInvert(transform);

  if (!mxInv) {
    return { ...DEFAULT_FALLBACK };
  }

  // Figma's gradientTransform maps shape space → gradient space.
  // We invert it to get gradient-space points (center, axis points) in shape space.
  const center = applyMatrixToPoint(mxInv, [0.5, 0.5]);
  const pointX = applyMatrixToPoint(mxInv, [1, 0.5]);
  const pointY = applyMatrixToPoint(mxInv, [0.5, 1]);

  const rx = distance(center, pointX);
  const ry = distance(center, pointY);

  if (rx === 0 && ry === 0) {
    return { ...DEFAULT_FALLBACK };
  }

  // Use pointY as end so width = rx/ry (matching frontend convention).
  const end = ry > 0 ? pointY : pointX;

  return {
    start: center,
    end,
    rx,
    ry
  };
};
