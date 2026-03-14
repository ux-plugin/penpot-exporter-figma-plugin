import { describe, expect, it } from 'vitest';

import { calculateRadialGradient } from '@plugin/utils/calculateRadialGradient';

describe('calculateRadialGradient', () => {
  it('calcula gradiente radial con matriz identidad', () => {
    const identity: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateRadialGradient(identity);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    expect(typeof result.rx).toBe('number');
    expect(typeof result.ry).toBe('number');
    // Identity: center at (0.5, 0.5), rx = ry = 0.5
    expect(result.start[0]).toBeCloseTo(0.5, 5);
    expect(result.start[1]).toBeCloseTo(0.5, 5);
    expect(result.end[0]).toBeCloseTo(0.5, 5);
    expect(result.end[1]).toBeCloseTo(1, 5);
    expect(result.rx).toBeCloseTo(0.5, 5);
    expect(result.ry).toBeCloseTo(0.5, 5);
  });

  it('calcula gradiente radial con transformación 2x3', () => {
    const transform: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateRadialGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    expect(result.start[0]).toBeCloseTo(0.5, 5);
    expect(result.start[1]).toBeCloseTo(0.5, 5);
    expect(result.end[0]).toBeCloseTo(0.5, 5);
    expect(result.end[1]).toBeCloseTo(1, 5);
    expect(result.rx).toBeCloseTo(0.5, 5);
    expect(result.ry).toBeCloseTo(0.5, 5);
  });

  it('calcula gradiente radial con transformación 3x3', () => {
    const transform = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ] as unknown as Transform;
    const result = calculateRadialGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    expect(result.start[0]).toBeCloseTo(0.5, 5);
    expect(result.start[1]).toBeCloseTo(0.5, 5);
    expect(result.rx).toBeCloseTo(0.5, 5);
    expect(result.ry).toBeCloseTo(0.5, 5);
  });

  it('retorna valores por defecto para matriz no invertible', () => {
    const singular: Transform = [
      [0, 0, 0],
      [0, 0, 0]
    ];
    const result = calculateRadialGradient(singular);
    expect(result.start).toEqual([0.5, 0.5]);
    expect(result.end).toEqual([0.5, 1]);
    expect(result.rx).toBe(0.5);
    expect(result.ry).toBe(0.5);
  });

  it('calcula gradiente radial con escala uniforme (Figma-style)', () => {
    // Figma scale=0.8 + translate: gradient fills 80% of shape, centered
    const transform: Transform = [
      [0.8, 0, 0.1],
      [0, 0.8, 0.1]
    ];
    const result = calculateRadialGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // Inverse of [[0.8,0,0.1],[0,0.8,0.1]] maps (0.5,0.5) to (0.5,0.5)
    expect(result.start[0]).toBeCloseTo(0.5, 5);
    expect(result.start[1]).toBeCloseTo(0.5, 5);
    // rx = ry = 0.5/0.8 = 0.625
    expect(result.rx).toBeCloseTo(0.625, 4);
    expect(result.ry).toBeCloseTo(0.625, 4);
  });

  it('calcula gradiente radial con escala no uniforme', () => {
    // Non-uniform: different rx and ry after inversion
    const transform: Transform = [
      [2, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateRadialGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // Inverse of [[2,0,0],[0,1,0],[0,0,1]] = [[0.5,0,0],[0,1,0],[0,0,1]]
    // center = (0.25, 0.5), pointX = (0.5, 0.5), pointY = (0.25, 1)
    expect(result.start[0]).toBeCloseTo(0.25, 5);
    expect(result.start[1]).toBeCloseTo(0.5, 5);
    expect(result.rx).toBeCloseTo(0.25, 5);
    expect(result.ry).toBeCloseTo(0.5, 5);
  });

  it('calcula gradiente radial con traslación', () => {
    const translation: Transform = [
      [1, 0, 10],
      [0, 1, 20]
    ];
    const result = calculateRadialGradient(translation);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    expect(typeof result.rx).toBe('number');
    expect(typeof result.ry).toBe('number');
    // Pure translation: center should shift by -translation
    expect(result.start[0]).toBeCloseTo(-9.5, 4);
    expect(result.start[1]).toBeCloseTo(-19.5, 4);
    expect(result.rx).toBeCloseTo(0.5, 5);
    expect(result.ry).toBeCloseTo(0.5, 5);
  });
});
