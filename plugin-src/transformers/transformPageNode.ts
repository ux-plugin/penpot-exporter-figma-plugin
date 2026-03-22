import { translateChildren } from '@plugin/translators';
import { translatePageFill } from '@plugin/translators/fills';

import type { PenpotPage } from '@ui/lib/types/penpotPage';

export const transformPageNode = async (node: PageNode): Promise<PenpotPage> => {
  // Page paint metadata (e.g. backgrounds) is not reliable until the page is loaded.
  try {
    await node.loadAsync();
  } catch (e) {
    console.warn('[transformPageNode] page.loadAsync() failed', e);
  }
  const backgrounds = (node as { backgrounds?: readonly Paint[] }).backgrounds;
  const children = (node as { children?: readonly SceneNode[] }).children ?? [];
  const penpotPage: PenpotPage = {
    name: node.name,
    background: backgrounds?.length ? translatePageFill(backgrounds[0]) : undefined,
    children: await translateChildren(children)
  };
  return penpotPage;
};

/** Public alias for transformPageNode: converts a Figma PageNode to PenpotPage. */
export const translatePage = transformPageNode;
