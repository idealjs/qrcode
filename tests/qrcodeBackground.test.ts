import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_QRCODE_BACKGROUND,
  getQrcodeBackgroundCircle,
  getQrcodeBackgroundFill,
  QRCODE_BACKGROUND_COLOR_FALLBACK,
} from "../src/qrcodeBackground.ts";

describe("qrcode background", () => {
  it("uses a transparent background by default", () => {
    assert.equal(DEFAULT_QRCODE_BACKGROUND, null);
    assert.equal(getQrcodeBackgroundFill(DEFAULT_QRCODE_BACKGROUND), undefined);
  });

  it("uses a fill color only after a color is configured", () => {
    assert.equal(getQrcodeBackgroundFill("#ffffff"), "#ffffff");
    assert.equal(QRCODE_BACKGROUND_COLOR_FALLBACK, "#ffffff");
  });

  it("matches the circular QR outline instead of the square viewbox", () => {
    assert.deepEqual(
      getQrcodeBackgroundCircle({
        qrSize: 512,
        ringWidth: 128,
        viewBoxSize: 1024,
      }),
      {
        cx: 512,
        cy: 512,
        radius: 384,
      },
    );
  });
});
