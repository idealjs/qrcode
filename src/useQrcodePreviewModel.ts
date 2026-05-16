import * as QRCode from "qrcode";
import { useCallback, useMemo } from "react";

import { QR_SIZE, useQrcodeStore } from "./useQrcodeStore";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type PreviewModel = {
  size: number;
  noise: Array<{ x: number; y: number; size: number }>;
  modules: Array<{ x: number; y: number; size: number }>;
  finders: Array<{
    cx: number;
    cy: number;
    outer: number;
    middle: number;
    inner: number;
  }>;
};

export const VIEWBOX_SIZE = 1024;
const CENTER = VIEWBOX_SIZE / 2;

const createSeededRandom = (seedInput: string) => {
  let seed = 0;
  for (let i = 0; i < seedInput.length; i += 1) {
    seed = (seed * 31 + seedInput.charCodeAt(i)) >>> 0;
  }
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
};

export const useQrcodePreviewModel = () => {
  const text = useQrcodeStore((s) => s.text);
  const ecc = useQrcodeStore((s) => s.ecc);
  const ringWidth = useQrcodeStore((s) => s.ringWidth);
  const edgeSeed = useQrcodeStore((s) => s.edgeSeed);

  const qr = useMemo(() => {
    try {
      return QRCode.create(text || " ", { errorCorrectionLevel: ecc });
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [text, ecc]);

  const moduleCount = useMemo(() => qr?.modules.size ?? 0, [qr]);
  const fitScale = useMemo(() => {
    const totalDiameter = QR_SIZE + ringWidth * 2;
    return totalDiameter > VIEWBOX_SIZE ? VIEWBOX_SIZE / totalDiameter : 1;
  }, [ringWidth]);
  const qrSize = useMemo(() => QR_SIZE * fitScale, [fitScale]);
  const ringThickness = useMemo(
    () => ringWidth * fitScale,
    [ringWidth, fitScale],
  );
  const qrHalf = useMemo(() => qrSize / 2, [qrSize]);
  const outerRadius = useMemo(
    () => qrHalf + ringThickness,
    [qrHalf, ringThickness],
  );
  const innerTopLeft = useMemo(() => CENTER - qrHalf, [qrHalf]);
  const moduleSize = useMemo(
    () => (moduleCount > 0 ? qrSize / moduleCount : 0),
    [qrSize, moduleCount],
  );
  const dotRadius = useMemo(() => moduleSize * 0.4, [moduleSize]);
  const finder = 0.9;
  const hashSeed = useMemo(
    () => `${edgeSeed}|${QR_SIZE}|${ringWidth}`,
    [edgeSeed, ringWidth],
  );
  const seededRandom = useMemo(() => createSeededRandom(hashSeed), [hashSeed]);

  const qrDarkDensity = useMemo(() => {
    if (!qr || moduleCount === 0) return 0;
    let darkModuleCount = 0;
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (qr.modules.get(row, col)) darkModuleCount += 1;
      }
    }
    return darkModuleCount / (moduleCount * moduleCount);
  }, [qr, moduleCount]);

  const isInFinder = useCallback(
    (row: number, col: number) => {
      const inTopLeft = row < 7 && col < 7;
      const inTopRight = row < 7 && col >= moduleCount - 7;
      const inBottomLeft = row >= moduleCount - 7 && col < 7;
      return inTopLeft || inTopRight || inBottomLeft;
    },
    [moduleCount],
  );

  const modules = useMemo<PreviewModel["modules"]>(() => {
    if (!qr || moduleCount === 0) return [];
    const result: PreviewModel["modules"] = [];
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (!qr.modules.get(row, col)) continue;
        if (isInFinder(row, col)) continue;
        const x = innerTopLeft + col * moduleSize;
        const y = innerTopLeft + row * moduleSize;
        result.push({
          x: x + moduleSize / 2,
          y: y + moduleSize / 2,
          size: dotRadius,
        });
      }
    }
    return result;
  }, [qr, moduleCount, isInFinder, innerTopLeft, moduleSize, dotRadius]);

  const drawFinder = useCallback(
    (rowStart: number, colStart: number) => {
      const cx = innerTopLeft + (colStart + 3.5) * moduleSize;
      const cy = innerTopLeft + (rowStart + 3.5) * moduleSize;
      const outer = 3.5 * moduleSize * finder;
      const middle = 2.5 * moduleSize * finder;
      const inner = 1.5 * moduleSize * finder;
      return { cx, cy, outer, middle, inner };
    },
    [innerTopLeft, moduleSize],
  );

  const finders = useMemo<PreviewModel["finders"]>(() => {
    if (moduleCount === 0) return [];
    return [
      drawFinder(0, 0),
      drawFinder(0, moduleCount - 7),
      drawFinder(moduleCount - 7, 0),
    ];
  }, [drawFinder, moduleCount]);

  const noise = useMemo<PreviewModel["noise"]>(() => {
    if (ringThickness <= 0) return [];
    const result: PreviewModel["noise"] = [];
    const noiseStep = moduleSize || 1;
    const noiseOuterLimit = outerRadius - dotRadius;
    const squareGap = dotRadius;
    const squareMin = innerTopLeft - squareGap;
    const squareMax = innerTopLeft + qrSize + squareGap;
    for (let y = noiseStep / 2; y < VIEWBOX_SIZE; y += noiseStep) {
      for (let x = noiseStep / 2; x < VIEWBOX_SIZE; x += noiseStep) {
        const dx = x - CENTER;
        const dy = y - CENTER;
        const dist = Math.hypot(dx, dy);
        if (dist > noiseOuterLimit) continue;
        const left = x - dotRadius;
        const top = y - dotRadius;
        const right = x + dotRadius;
        const bottom = y + dotRadius;
        if (
          right >= squareMin &&
          left <= squareMax &&
          bottom >= squareMin &&
          top <= squareMax
        ) {
          continue;
        }
        if (seededRandom() > qrDarkDensity) continue;
        result.push({
          x: x - moduleSize / 2,
          y: y - moduleSize / 2,
          size: dotRadius * 2,
        });
      }
    }
    return result;
  }, [
    ringThickness,
    moduleSize,
    innerTopLeft,
    qrSize,
    seededRandom,
    dotRadius,
    qrDarkDensity,
    outerRadius,
  ]);

  return useMemo(
    () => (qr ? { size: QR_SIZE, noise, modules, finders } : null),
    [qr, noise, modules, finders],
  );
};
