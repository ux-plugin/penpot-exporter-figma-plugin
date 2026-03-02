import type { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';

/** Parsed SVG element: tag, attrs, and content (children or text leaf). Matches frontend svg-raw content. */
export type SvgRawContent =
  | string
  | {
      tag: string;
      attrs?: Record<string, unknown>;
      content?: SvgRawContent[];
    };

export type SvgRawViewbox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SvgRawAttributes = {
  type: 'svg-raw';
  content?: SvgRawContent;
  svgViewbox?: SvgRawViewbox;
  svgDefs?: Record<string, string>;
};

export type SvgRawShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  SvgRawAttributes &
  LayoutChildAttributes;
