import { applyMatrixToPoint } from '@plugin/utils/applyMatrixToPoint';
import { matrixInvert } from '@plugin/utils/matrixInvert';

export interface AngularGradientPoints {
  center: number[];
  angleZeroPoint: number[];
}

const DEFAULT_FALLBACK: AngularGradientPoints = {
  center: [0.5, 0.5],
  angleZeroPoint: [1, 0.5]
};

export const calculateAngularGradient = (t: Transform): AngularGradientPoints => {
  if (!t || t.length < 2) {
    return { ...DEFAULT_FALLBACK };
  }

  const transform = t.length === 2 ? [...t, [0, 0, 1]] : [...t];
  const mxInv = matrixInvert(transform);

  if (!mxInv) {
    return { ...DEFAULT_FALLBACK };
  }

  // Figma's gradientTransform maps shape space → gradient space.
  // Center is (0.5, 0.5) in gradient space; angle 0 (stop offset 0) is at 3 o'clock = (1, 0.5).
  const center = applyMatrixToPoint(mxInv, [0.5, 0.5]);
  const angleZeroPoint = applyMatrixToPoint(mxInv, [1, 0.5]);

  return {
    center,
    angleZeroPoint
  };
};
