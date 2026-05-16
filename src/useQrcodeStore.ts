import { create } from "zustand";
import {
  DEFAULT_QRCODE_BACKGROUND,
  QRCODE_BACKGROUND_COLOR_FALLBACK,
  type QrcodeBackground,
} from "./qrcodeBackground";
import type { ErrorCorrectionLevel } from "./useQrcodePreviewModel";
import { VIEWBOX_SIZE } from "./useQrcodePreviewModel";

export const QR_SIZE = 512;

type QrcodeState = {
  text: string;
  fg: string;
  bg: QrcodeBackground;
  bgColor: string;
  ecc: ErrorCorrectionLevel;
  ringWidth: number;
  edgeSeed: string;
  setText: (text: string) => void;
  setFg: (fg: string) => void;
  setBg: (bg: string) => void;
  clearBg: () => void;
  setEcc: (ecc: ErrorCorrectionLevel) => void;
  setRingWidth: (ringWidth: number) => void;
  randomizeEdge: () => void;
};

export const useQrcodeStore = create<QrcodeState>((set) => ({
  text: "https://example.com",
  fg: "#28b3d6",
  bg: DEFAULT_QRCODE_BACKGROUND,
  bgColor: QRCODE_BACKGROUND_COLOR_FALLBACK,
  ecc: "M",
  ringWidth: QR_SIZE / 2,
  edgeSeed: crypto.randomUUID(),
  setText: (text) => set({ text }),
  setFg: (fg) => set({ fg }),
  setBg: (bg) => set({ bg, bgColor: bg }),
  clearBg: () => set({ bg: DEFAULT_QRCODE_BACKGROUND }),
  setEcc: (ecc) => set({ ecc }),
  setRingWidth: (ringWidth) =>
    set((state) => ({
      ringWidth: Number.isFinite(ringWidth)
        ? Math.max(0, Math.min(ringWidth, (VIEWBOX_SIZE - QR_SIZE) / 2))
        : state.ringWidth,
    })),
  randomizeEdge: () => set({ edgeSeed: crypto.randomUUID() }),
}));
