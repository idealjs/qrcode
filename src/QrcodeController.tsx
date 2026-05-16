import { useId } from "react";
import {
  type ErrorCorrectionLevel,
  VIEWBOX_SIZE,
} from "./useQrcodePreviewModel";
import { QR_SIZE, useQrcodeStore } from "./useQrcodeStore";

export function QrcodeController() {
  const id = useId();
  const text = useQrcodeStore((s) => s.text);
  const fg = useQrcodeStore((s) => s.fg);
  const bg = useQrcodeStore((s) => s.bg);
  const bgColor = useQrcodeStore((s) => s.bgColor);
  const ecc = useQrcodeStore((s) => s.ecc);
  const ringWidth = useQrcodeStore((s) => s.ringWidth);
  const setText = useQrcodeStore((s) => s.setText);
  const setFg = useQrcodeStore((s) => s.setFg);
  const setBg = useQrcodeStore((s) => s.setBg);
  const clearBg = useQrcodeStore((s) => s.clearBg);
  const setEcc = useQrcodeStore((s) => s.setEcc);
  const setRingWidth = useQrcodeStore((s) => s.setRingWidth);
  const isTransparentBackground = bg === null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-text`} className="text-sm font-medium text-slate-700">
            内容（文本/URL/电话/邮件）
          </label>
          <input
            id={`${id}-text`}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-11 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-fg`} className="text-sm font-medium text-slate-700">
            前景色
          </label>
          <input
            id={`${id}-fg`}
            type="color"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="h-11 w-full appearance-none overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-2xl [&::-webkit-color-swatch]:border-0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-bg`} className="text-sm font-medium text-slate-700">
            背景色
          </label>
          <div className="flex gap-3">
            <input
              id={`${id}-bg`}
              type="color"
              value={bgColor}
              onChange={(e) => setBg(e.target.value)}
              className="h-11 min-w-0 flex-1 appearance-none overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-2xl [&::-webkit-color-swatch]:border-0"
            />
            <label className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300">
              <input
                type="checkbox"
                checked={isTransparentBackground}
                onChange={(e) => {
                  if (e.target.checked) {
                    clearBg();
                    return;
                  }
                  setBg(bgColor);
                }}
                className="size-4 accent-emerald-500"
              />
              透明
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-ecc`} className="text-sm font-medium text-slate-700">
            纠错等级
          </label>
          <select
            id={`${id}-ecc`}
            value={ecc}
            onChange={(e) => setEcc(e.target.value as ErrorCorrectionLevel)}
            className="h-11 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="L">低 (L)</option>
            <option value="M">中 (M)</option>
            <option value="Q">较高 (Q)</option>
            <option value="H">高 (H)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-ring-width`} className="text-sm font-medium text-slate-700">
            外圈圆形厚度（像素）
          </label>
          <input
            id={`${id}-ring-width`}
            type="number"
            min={0}
            max={Math.max(0, (VIEWBOX_SIZE - QR_SIZE) / 2)}
            value={ringWidth}
            onChange={(e) => setRingWidth(Number(e.target.value) || 0)}
            className="h-11 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </div>
    </div>
  );
}
