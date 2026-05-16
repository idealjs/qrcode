import { forwardRef } from "react";
import {
  getQrcodeBackgroundCircle,
  getQrcodeBackgroundFill,
} from "./qrcodeBackground";
import { type PreviewModel, VIEWBOX_SIZE } from "./useQrcodePreviewModel";
import { QR_SIZE, useQrcodeStore } from "./useQrcodeStore";

type IQrcodePreviewProps = {
  noise: PreviewModel["noise"];
  modules: PreviewModel["modules"];
  finders: PreviewModel["finders"];
};

export const QrcodePreview = forwardRef<SVGSVGElement, IQrcodePreviewProps>(
  function QrcodePreview(props, ref) {
    const { noise, modules, finders } = props;
    const fg = useQrcodeStore((s) => s.fg);
    const bg = useQrcodeStore((s) => s.bg);
    const ringWidth = useQrcodeStore((s) => s.ringWidth);
    const backgroundFill = getQrcodeBackgroundFill(bg);
    const backgroundCircle = getQrcodeBackgroundCircle({
      qrSize: QR_SIZE,
      ringWidth,
      viewBoxSize: VIEWBOX_SIZE,
    });
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="mx-auto aspect-square w-full max-w-[42rem] lg:size-[min(60vw,calc(100vh-13rem),42rem)] lg:max-w-none lg:shrink-0"
      >
        <title>QR code preview</title>
        {backgroundFill ? (
          <circle
            cx={backgroundCircle.cx}
            cy={backgroundCircle.cy}
            r={backgroundCircle.radius}
            fill={backgroundFill}
          />
        ) : null}
        <g fill={fg}>
          {noise.map((item) => (
            <circle
              key={`noise-${item.x.toFixed(2)}-${item.y.toFixed(2)}`}
              cx={item.x + item.size / 2}
              cy={item.y + item.size / 2}
              r={item.size / 2}
            />
          ))}
          {modules.map((item) => (
            <circle
              key={`module-${item.x.toFixed(2)}-${item.y.toFixed(2)}`}
              cx={item.x}
              cy={item.y}
              r={item.size}
            />
          ))}
        </g>
        <g fill={fg}>
          {finders.map((item) => (
            <g key={`finder-${item.cx.toFixed(2)}-${item.cy.toFixed(2)}`}>
              <circle
                cx={item.cx}
                cy={item.cy}
                r={item.outer}
                fill="none"
                stroke={fg}
                strokeWidth={20}
              />
              <circle
                cx={item.cx}
                cy={item.cy}
                r={(item.middle + item.inner) / 2}
                fill={fg}
              />
            </g>
          ))}
        </g>
      </svg>
    );
  },
);
