import type { Selrect } from '@ui/lib/types/utils/selrect';

/**
 * Computes the selrect (axis-aligned bounding box in canvas space) for a Figma node.
 * Uses absoluteBoundingBox which is the AABB of the node including any rotation.
 * The WASM renderer uses selrect to position and size shapes; without it every shape
 * collapses to (0,0) with zero area.
 */
export const transformSelrect = (node: {
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number } | null;
}): { selrect: Selrect } | Record<string, never> => {
  const bbox = node.absoluteBoundingBox;
  if (!bbox) return {};
  const { x, y, width, height } = bbox;
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
