import type { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type {
  ShapeAttributes,
  ShapeBaseAttributes,
  ShapeGeomAttributes
} from '@ui/lib/types/shapes/shape';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export type ImageMetadata = {
  width: number;
  height: number;
  mtype?: string;
  id: Uuid;
};

type ImageAttributes = {
  type: 'image';
  metadata: ImageMetadata;
};

export type ImageShape = ShapeBaseAttributes &
  ShapeGeomAttributes &
  ShapeAttributes &
  ImageAttributes &
  LayoutChildAttributes;
