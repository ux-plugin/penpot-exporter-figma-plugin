import { describe, expect, it } from 'vitest';

import { calculateAngularGradient } from '@plugin/utils/calculateAngularGradient';

describe('calculateAngularGradient', () => {
  it('returns center (0.5, 0.5) and angleZeroPoint (1, 0.5) for identity transform', () => {
    const identity: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateAngularGradient(identity);
    expect(result.center).toHaveLength(2);
    expect(result.center[0]).toBeCloseTo(0.5, 5);
    expect(result.center[1]).toBeCloseTo(0.5, 5);
    expect(result.angleZeroPoint).toHaveLength(2);
    expect(result.angleZeroPoint[0]).toBeCloseTo(1, 5);
    expect(result.angleZeroPoint[1]).toBeCloseTo(0.5, 5);
  });

  it('returns default fallback for non-invertible matrix', () => {
    const singular: Transform = [
      [0, 0, 0],
      [0, 0, 0]
    ];
    const result = calculateAngularGradient(singular);
    expect(result.center).toEqual([0.5, 0.5]);
    expect(result.angleZeroPoint).toEqual([1, 0.5]);
  });

  it('computes center and angleZeroPoint for 90° CCW rotated transform', () => {
    // 90° CCW rotation: inverse maps (0.5,0.5) → (0.5,-0.5), (1,0.5) → (0.5,-1)
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const result = calculateAngularGradient(rotation90);
    expect(result.center).toHaveLength(2);
    expect(result.center[0]).toBeCloseTo(0.5, 5);
    expect(result.center[1]).toBeCloseTo(-0.5, 5);
    expect(result.angleZeroPoint).toHaveLength(2);
    expect(result.angleZeroPoint[0]).toBeCloseTo(0.5, 5);
    expect(result.angleZeroPoint[1]).toBeCloseTo(-1, 5);
  });
});
