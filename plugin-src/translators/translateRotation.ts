import type { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';

const DET_EPSILON = 1e-10;

export const translateRotation = (
  transform: Transform,
  rotation: number
): Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> => {
  const a = transform[0][0];
  const b = transform[1][0];
  const c = transform[0][1];
  const d = transform[1][1];
  const e = 0;
  const f = 0;

  const result: Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> = {
    rotation,
    transform: { a, b, c, d, e, f }
  };

  const det = a * d - b * c;
  if (Math.abs(det) >= DET_EPSILON) {
    result.transformInverse = {
      a: d / det,
      b: -b / det,
      c: -c / det,
      d: a / det,
      e: (c * f - d * e) / det,
      f: (b * e - a * f) / det
    };
  }

  return result;
};

export const translateZeroRotation = (): Pick<
  ShapeBaseAttributes,
  'transform' | 'transformInverse' | 'rotation'
> => ({
  rotation: 0,
  transform: undefined,
  transformInverse: undefined
});
