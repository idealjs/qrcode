import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

describe("page layout source", () => {
  it("does not pin the page container to the viewport height", async () => {
    const appSource = await readFile("src/App.tsx", "utf-8");

    assert.equal(appSource.includes("h-screen"), false);
  });

  it("limits QR preview size instead of relying on the page height", async () => {
    const previewSource = await readFile("src/QrcodePreview.tsx", "utf-8");

    assert.equal(previewSource.includes("max-w-[42rem]"), true);
    assert.equal(previewSource.includes("lg:size-["), true);
  });
});
