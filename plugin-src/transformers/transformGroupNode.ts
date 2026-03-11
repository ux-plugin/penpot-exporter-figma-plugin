import type { TransformOptions } from '@plugin/transformOptions';
import {
  transformBlend,
  transformChildren,
  transformDimension,
  transformEffects,
  transformIds,
  transformOverrides,
  transformRotationAndPosition,
  transformSceneNode,
  transformSelrect,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';

export const transformGroupNode = async (
  node: GroupNode,
  options?: TransformOptions
): Promise<GroupShape> => {
  return {
    ...transformIds(node),
    ...transformGroupNodeLike(node),
    ...transformEffects(node),
    ...transformBlend(node),
    ...transformVariableConsumptionMap(node),
    ...(await transformChildren(node, options)),
    ...transformOverrides(node),
    ...transformSelrect(node)
  };
};

export const transformGroupNodeLike = (node: SceneNode): Omit<GroupShape, 'id' | 'shapeRef'> => {
  return {
    type: 'group',
    name: node.name,
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node)
  };
};
