import { applyMatrixToPoint } from '@plugin/utils/applyMatrixToPoint';
import { matrixInvert } from '@plugin/utils/matrixInvert';

export interface AngularGradientPoints {
  center: number[];
  angleZeroPoint: number[];
  width: number;
}

const MIN_RADIUS_FOR_ASPECT = 1e-6;

const DEFAULT_FALLBACK: AngularGradientPoints = {
  center: [0.5, 0.5],
  angleZeroPoint: [1, 0.5],
  width: 1
};

function distance(a: number[], b: number[]): number {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

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
  // Center is (0.5, 0.5) in gradient space; angle 0 (stop offset 0) is at 3 o'clock = (1, 0.5); angle 90° = (0.5, 1).
  const center = applyMatrixToPoint(mxInv, [0.5, 0.5]);
  const angleZeroPoint = applyMatrixToPoint(mxInv, [1, 0.5]);
  const pointAt90 = applyMatrixToPoint(mxInv, [0.5, 1]);

  const radius0 = distance(center, angleZeroPoint);
  const radius90 = distance(center, pointAt90);
  const width =
    radius90 > MIN_RADIUS_FOR_ASPECT ? radius0 / radius90 : 1;

  return {
    center,
    angleZeroPoint,
    width
  };
};
