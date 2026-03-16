import { describe, expect, it } from 'vitest';

import { calculateAngularGradient } from '@plugin/utils/calculateAngularGradient';

describe('calculateAngularGradient', () => {
  it('returns center (0.5, 0.5), angleZeroPoint (1, 0.5), and width 1 for identity transform', () => {
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
    expect(result.width).toBeCloseTo(1, 5);
  });

  it('returns default fallback for non-invertible matrix', () => {
    const singular: Transform = [
      [0, 0, 0],
      [0, 0, 0]
    ];
    const result = calculateAngularGradient(singular);
    expect(result.center).toEqual([0.5, 0.5]);
    expect(result.angleZeroPoint).toEqual([1, 0.5]);
    expect(result.width).toBe(1);
  });

  it('computes center and angleZeroPoint for 90° CCW rotated transform (symmetric circle, width 1)', () => {
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
    expect(result.width).toBeCloseTo(1, 5);
  });

  it('returns width as radius0/radius90 for non-uniform scale (ellipse)', () => {
    // Scale 2 in x, 1 in y (shape→gradient): inverse scales gradient→shape by (0.5, 1).
    // Center (0.5,0.5)→(0.25,0.5), (1,0.5)→(0.5,0.5), (0.5,1)→(0.25,1). radius0=0.25, radius90=0.5, width=0.5.
    const scaleX2: Transform = [
      [2, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateAngularGradient(scaleX2);
    expect(result.width).toBeCloseTo(0.5, 5);
    expect(result.width).not.toBe(1);
  });
});
