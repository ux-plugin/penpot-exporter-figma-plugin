import { identifiers, reverseIdentifiers } from '@plugin/libraries';
import { generateDeterministicUuid } from '@plugin/utils';

import type { ShapeAttributes, ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';
import type { Uuid } from '@ui/lib/types/utils/uuid';

const parseFigmaId = (figmaId: string): Uuid => {
  const id = identifiers.get(figmaId);

  if (id) {
    return id;
  }

  const newId = generateDeterministicUuid(figmaId);

  identifiers.set(figmaId, newId);

  return newId;
};

const getRelatedNodeId = (nodeId: string): string | undefined => {
  const ids = nodeId.split(';');

  if (ids.length > 1) {
    return ids.slice(1).join(';');
  }
};

const normalizeNodeId = (nodeId: string): string => {
  return nodeId.replace('I', '');
};

const transformShapeRef = (node: SceneNode): Uuid | undefined => {
  const relatedNodeId = getRelatedNodeId(node.id);
  if (!relatedNodeId) {
    return;
  }

  return parseFigmaId(relatedNodeId);
};

export const transformId = (node: SceneNode): Uuid => {
  const uuid = parseFigmaId(normalizeNodeId(node.id));
  reverseIdentifiers.set(uuid, node.id);
  return uuid;
};

export const reverseLookupFigmaId = (penpotUuid: Uuid): string | undefined => {
  return reverseIdentifiers.get(penpotUuid);
};

export const transformIds = (node: SceneNode): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  return {
    id: transformId(node),
    shapeRef: transformShapeRef(node)
  };
};

export const transformComponentIds = (
  node: ComponentNode
): Pick<ShapeBaseAttributes, 'id'> & Pick<ShapeAttributes, 'componentId'> => {
  const id = generateDeterministicUuid(`id-${node.key}`);
  const componentId = generateDeterministicUuid(node.key);
  const normalized = normalizeNodeId(node.id);
  identifiers.set(normalized, id);
  reverseIdentifiers.set(id, node.id);
  return {
    id,
    componentId
  };
};

/** Same Penpot id as the exported document uses for this node (COMPONENT uses key-based id, not Figma node id). */
export function penpotIdForSelectionSync(node: SceneNode): Uuid {
  if (node.type === 'COMPONENT') {
    return transformComponentIds(node as ComponentNode).id;
  }
  return transformId(node);
}

export const transformInstanceIds = (
  node: InstanceNode,
  mainComponent: ComponentNode
): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> & Pick<ShapeAttributes, 'componentId'> => {
  return {
    id: transformId(node),
    shapeRef: transformShapeRef(node) ?? generateDeterministicUuid(`id-${mainComponent.key}`),
    componentId: generateDeterministicUuid(mainComponent.key)
  };
};

export const transformMaskIds = (node: SceneNode): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  const normalizedId = normalizeNodeId(node.id);
  const relatedNodeId = getRelatedNodeId(node.id);

  return {
    id: parseFigmaId(`M${normalizedId}`),
    shapeRef: relatedNodeId ? parseFigmaId(`M${relatedNodeId}`) : undefined
  };
};

export const transformVectorIds = (
  node: SceneNode,
  index: number
): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  const normalizedId = normalizeNodeId(node.id);
  const relatedNodeId = getRelatedNodeId(node.id);

  return {
    id: parseFigmaId(`V${index}${normalizedId}`),
    shapeRef: relatedNodeId ? parseFigmaId(`V${index}${relatedNodeId}`) : undefined
  };
};
