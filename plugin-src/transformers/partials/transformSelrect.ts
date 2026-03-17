import type { Selrect } from '@ui/lib/types/utils/selrect';

/**
 * Computes the selrect for a Figma node in canvas space.
 *
 * Penpot's selrect stores the LOCAL (pre-transform) dimensions of the shape, anchored at the
 * shape's center in canvas space. For rotated or sheared shapes, `absoluteBoundingBox` gives
 * the AABB which has different width/height than the pre-transform local dimensions. Using AABB
 * dimensions as local dimensions would corrupt resize scale-factor computation and cause the
 * angular gradient to visually rotate when resizing (because gradient angle = atan2(dy*h, dx*w)
 * depends on the aspect ratio).
 *
 * Key invariant (holds for all affine transforms): AABB center = shape center.
 * We use the AABB center as the anchor and `node.width/height` as the local dimensions.
 */
export const transformSelrect = (node: {
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number } | null;
  width?: number;
  height?: number;
}): { selrect: Selrect } | Record<string, never> => {
  const bbox = node.absoluteBoundingBox;
  if (!bbox) return {};

  // Use local (pre-transform) dimensions from the node when available.
  // Fall back to AABB dimensions for non-transformed shapes (they are equal in that case).
  const width = node.width ?? bbox.width;
  const height = node.height ?? bbox.height;

  // AABB center equals shape center for any affine transform (rotation, shear, scale).
  // Anchor selrect at this center so hit-testing and resize handle positions stay correct.
  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;
  const x = cx - width / 2;
  const y = cy - height / 2;

  return {
    selrect: {
      x,
      y,
      x1: x,
      y1: y,
      x2: x + width,
      y2: y + height,
      width,
      height
    }
  };
};
