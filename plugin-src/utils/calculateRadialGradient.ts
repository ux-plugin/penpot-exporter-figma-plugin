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
  // Invert to map the gradient circle (radius 0.5 at (0.5, 0.5)) to shape space.
  const center = applyMatrixToPoint(mxInv, [0.5, 0.5]);

  // Extract 2x2 linear part of the inverse (rotation + scaling, no translation).
  const a = mxInv[0][0], b = mxInv[0][1];
  const c = mxInv[1][0], d = mxInv[1][1];

  // SVD of 2x2 matrix via eigenvalues of A^T*A.
  // This correctly decomposes transforms that combine rotation with non-uniform
  // scaling, where simple axis-point sampling would give incorrect ellipse axes.
  const s11 = a * a + c * c;
  const s12 = a * b + c * d;
  const s22 = b * b + d * d;

  const trace = s11 + s22;
  const det = s11 * s22 - s12 * s12;
  const disc = Math.sqrt(Math.max(0, trace * trace / 4 - det));

  const sigma1 = Math.sqrt(Math.max(0, trace / 2 + disc)); // larger singular value
  const sigma2 = Math.sqrt(Math.max(0, trace / 2 - disc)); // smaller singular value

  // Semi-axis lengths (gradient circle has radius 0.5 in gradient space)
  const ry = sigma1 * 0.5; // larger semi-axis (along end direction)
  const rx = sigma2 * 0.5; // smaller semi-axis (perpendicular)

  if (ry < 1e-9) {
    return { ...DEFAULT_FALLBACK };
  }

  // Eigenvector for the larger eigenvalue of A^T*A (major axis in V-space)
  let vx: number, vy: number;
  if (Math.abs(s12) > 1e-12) {
    vx = trace / 2 + disc - s22;
    vy = s12;
  } else if (s22 >= s11) {
    vx = 0;
    vy = 1;
  } else {
    vx = 1;
    vy = 0;
  }

  // Map eigenvector through A to get the major axis direction in shape space (U column)
  const ux = a * vx + b * vy;
  const uy = c * vx + d * vy;
  const ulen = Math.sqrt(ux * ux + uy * uy);

  let dirX: number, dirY: number;
  if (ulen > 1e-12) {
    dirX = ux / ulen;
    dirY = uy / ulen;
  } else {
    dirX = 0;
    dirY = 1;
  }

  // Ensure consistent end direction (prefer downward / rightward)
  if (dirY < 0 || (Math.abs(dirY) < 1e-12 && dirX < 0)) {
    dirX = -dirX;
    dirY = -dirY;
  }

  const end = [
    center[0] + dirX * ry,
    center[1] + dirY * ry
  ];

  return {
    start: center,
    end,
    rx,
    ry
  };
};
