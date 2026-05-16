export type QrcodeBackground = string | null;

export const QRCODE_BACKGROUND_COLOR_FALLBACK = "#ffffff";
export const DEFAULT_QRCODE_BACKGROUND: QrcodeBackground = null;

export const getQrcodeBackgroundFill = (background: QrcodeBackground) =>
  background ?? undefined;

type QrcodeBackgroundCircleInput = {
  qrSize: number;
  ringWidth: number;
  viewBoxSize: number;
};

export const getQrcodeBackgroundCircle = ({
  qrSize,
  ringWidth,
  viewBoxSize,
}: QrcodeBackgroundCircleInput) => {
  const totalDiameter = qrSize + ringWidth * 2;
  const fitScale = totalDiameter > viewBoxSize ? viewBoxSize / totalDiameter : 1;
  return {
    cx: viewBoxSize / 2,
    cy: viewBoxSize / 2,
    radius: (qrSize / 2 + ringWidth) * fitScale,
  };
};
