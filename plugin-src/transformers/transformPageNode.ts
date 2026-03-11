import { translateChildren } from '@plugin/translators';
import { translatePageFill } from '@plugin/translators/fills';

import type { PenpotPage } from '@ui/lib/types/penpotPage';

export const transformPageNode = async (node: PageNode): Promise<PenpotPage> => {
  const backgrounds = (node as { backgrounds?: readonly Paint[] }).backgrounds;
  const children = (node as { children?: readonly SceneNode[] }).children ?? [];
  return {
    name: node.name,
    background: backgrounds?.length ? translatePageFill(backgrounds[0]) : undefined,
    children: await translateChildren(children)
  };
};

/** Public alias for transformPageNode: converts a Figma PageNode to PenpotPage. */
export const translatePage = transformPageNode;
