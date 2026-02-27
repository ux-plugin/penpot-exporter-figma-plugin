import type { TransformOptions } from '@plugin/transformOptions';
import {
  transformBooleanNode,
  transformComponentNode,
  transformComponentSetNode,
  transformEllipseNode,
  transformFrameNode,
  transformGroupNode,
  transformInstanceNode,
  transformLineNode,
  transformPathNode,
  transformRectangleNode,
  transformTextNode,
  transformVectorNode
} from '@plugin/transformers';
import { reportProgress } from '@plugin/utils';

import type { PenpotNode } from '@ui/types';

export type { TransformOptions } from '@plugin/transformOptions';

/** Figma SceneNode.type values that transformSceneNode can translate. Single source of truth for "supported" node types. */
export const SUPPORTED_SCENE_NODE_TYPES: ReadonlySet<string> = new Set([
  'RECTANGLE',
  'ELLIPSE',
  'COMPONENT_SET',
  'SECTION',
  'FRAME',
  'GROUP',
  'TEXT',
  'VECTOR',
  'LINE',
  'STAR',
  'POLYGON',
  'BOOLEAN_OPERATION',
  'COMPONENT',
  'INSTANCE'
]);

export const transformSceneNode = async (
  node: SceneNode,
  options?: TransformOptions
): Promise<PenpotNode | undefined> => {
  let penpotNode: PenpotNode | undefined;

  reportProgress({
    type: 'PROGRESS_CURRENT_ITEM',
    data: node.name
  });

  switch (node.type) {
    case 'RECTANGLE':
      penpotNode = transformRectangleNode(node);
      break;
    case 'ELLIPSE':
      penpotNode = transformEllipseNode(node);
      break;
    case 'COMPONENT_SET':
      penpotNode = await transformComponentSetNode(node, options);
      break;
    case 'SECTION':
    case 'FRAME':
      penpotNode = await transformFrameNode(node, options);
      break;
    case 'GROUP':
      penpotNode = await transformGroupNode(node, options);
      break;
    case 'TEXT':
      penpotNode = transformTextNode(node);
      break;
    case 'VECTOR':
      penpotNode = transformVectorNode(node);
      break;
    case 'LINE':
      penpotNode = transformLineNode(node);
      break;
    case 'STAR':
    case 'POLYGON':
      penpotNode = transformPathNode(node);
      break;
    case 'BOOLEAN_OPERATION':
      penpotNode = await transformBooleanNode(node, options);
      break;
    case 'COMPONENT':
      penpotNode = await transformComponentNode(node, options);
      break;
    case 'INSTANCE':
      penpotNode = await transformInstanceNode(node, options);
      break;
  }

  if (penpotNode === undefined) {
    console.warn(`Unsupported node type: ${node.type}`);
  }

  return penpotNode;
};
