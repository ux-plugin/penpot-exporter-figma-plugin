import { components } from '@plugin/libraries';
import type { TransformOptions } from '@plugin/transformOptions';
import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformComponentIds,
  transformComponentNameAndPath,
  transformConstraints,
  transformCornerRadius,
  transformDimension,
  transformEffects,
  transformFills,
  transformGrids,
  transformId,
  transformLayoutAttributes,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformSelrect,
  transformStrokes,
  transformVariableConsumptionMap,
  transformVariantNameAndProperties
} from '@plugin/transformers/partials';
import { registerComponentProperties } from '@plugin/translators/components';

import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';

export let isSharedLibrary: boolean = false;

export const resetSharedLibrary = (): void => {
  isSharedLibrary = false;
};

export const transformComponentNode = async (
  node: ComponentNode,
  options?: TransformOptions
): Promise<ComponentShape> => {
  const isVariant = node.parent?.type === 'COMPONENT_SET';
  const variantId = isVariant ? transformId(node.parent) : undefined;

  node.setPluginData('figmaFile', figma.root.name);

  const status = await node.getPublishStatusAsync();

  if (status === 'CURRENT' || status === 'CHANGED') {
    isSharedLibrary = true;
  }

  const component: ComponentShape = {
    type: 'component',
    showContent: !node.clipsContent,
    componentRoot: true,
    mainInstance: true,
    variantId,
    ...transformComponentIds(node),
    ...transformComponentNameAndPath(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformStrokes(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node, true),
    ...transformCornerRadius(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformConstraints(node),
    ...transformAutoLayout(node),
    ...transformVariableConsumptionMap(node),
    ...transformGrids(node),
    ...(await transformChildren(node, options)),
    ...(isVariant ? transformVariantNameAndProperties(node, variantId!) : {}),
    ...transformSelrect(node)
  };

  const nameSplit = component.name.split(' / ');

  components.set(component.componentId!, {
    name: nameSplit[nameSplit.length - 1],
    componentId: component.componentId!,
    frameId: component.id,
    variantId
  });

  if (!isVariant) {
    registerComponentProperties(node);
  }

  return component;
};
