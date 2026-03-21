import { translateChildren } from '@plugin/translators';
import { translatePageFill } from '@plugin/translators/fills';

import type { PenpotPage } from '@ui/lib/types/penpotPage';

export const transformPageNode = async (node: PageNode): Promise<PenpotPage> => {
  const backgrounds = (node as { backgrounds?: readonly Paint[] }).backgrounds;
  const children = (node as { children?: readonly SceneNode[] }).children ?? [];
  const penpotPage: PenpotPage = {
    name: node.name,
    background: backgrounds?.length ? translatePageFill(backgrounds[0]) : undefined,
    children: await translateChildren(children)
  };
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/c70ec86b-9ad9-405f-b916-1c6ac9ad8098', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '05c835'
    },
    body: JSON.stringify({
      sessionId: '05c835',
      runId: 'pre-fix',
      hypothesisId: 'H3',
      location: 'transformPageNode.ts:transformPageNode',
      message: 'Figma page → Penpot page background',
      data: {
        backgroundsLen: backgrounds?.length ?? 0,
        firstBgType: backgrounds?.[0]?.type,
        penpotBackground: penpotPage.background ?? null,
        topLevelChildCount: penpotPage.children?.length ?? 0
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  return penpotPage;
};

/** Public alias for transformPageNode: converts a Figma PageNode to PenpotPage. */
export const translatePage = transformPageNode;
