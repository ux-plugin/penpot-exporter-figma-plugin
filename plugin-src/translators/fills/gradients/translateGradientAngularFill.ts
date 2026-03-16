import { calculateAngularGradient, rgbToHex } from '@plugin/utils';

import type { Fill } from '@ui/lib/types/utils/fill';

export const translateGradientAngularFill = (fill: GradientPaint): Fill => {
  const points = calculateAngularGradient(fill.gradientTransform);

  return {
    fillColorGradient: {
      type: 'angular',
      startX: points.center[0],
      startY: points.center[1],
      endX: points.angleZeroPoint[0],
      endY: points.angleZeroPoint[1],
      width: points.width > 0 ? points.width : 1,
      stops: fill.gradientStops.map(stop => ({
        color: rgbToHex(stop.color),
        offset: stop.position,
        opacity: stop.color.a * (fill.opacity ?? 1)
      }))
    },
    fillOpacity: !fill.visible ? 0 : fill.opacity
  };
};
