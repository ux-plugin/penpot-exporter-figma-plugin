import type { Uuid } from './uuid';

export type Blur = {
  id?: Uuid;
  type: 'layer-blur' | 'background-blur';
  value: number;
  hidden: boolean;
};
