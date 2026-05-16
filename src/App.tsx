import { useCallback, useRef } from "react";
import { downloadQrcodePNG, downloadQrcodeSVG } from "./downloadQrcode";
import { QrcodeController } from "./QrcodeController";
import { QrcodePreview } from "./QrcodePreview";
import { useQrcodePreviewModel } from "./useQrcodePreviewModel";
import { useQrcodeStore } from "./useQrcodeStore";

export default function App() {
  const previewSvgRef = useRef<SVGSVGElement | null>(null);
  const previewModel = useQrcodePreviewModel();
  const randomizeEdge = useQrcodeStore((s) => s.randomizeEdge);

  const downloadSVG = useCallback(() => {
    if (!previewSvgRef.current) return;
    downloadQrcodeSVG(previewSvgRef.current);
  }, []);

  const downloadPNG = useCallback(async () => {
    if (!previewSvgRef.current) return;
    await downloadQrcodePNG(previewSvgRef.current);
  }, []);

  return (
    <div className="h-screen bg-slate-50 p-3 text-slate-900 lg:flex lg:flex-col lg:overflow-hidden lg:p-6">
      <header className="shrink-0 pb-4 lg:pb-6">
        <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm shadow-slate-900/5 backdrop-blur">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              QR 工具
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 lg:text-3xl">
              QR Code Generator — 圆形
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              生成并预览圆形风格二维码，支持随机边缘、导出 PNG 和 SVG。
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 lg:flex lg:overflow-hidden">
        <section className="lg:w-1/3 lg:pr-6">
          <QrcodeController />
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm shadow-slate-900/5">
            <div className="font-medium text-slate-900">预览使用 SVG 展示</div>
            <div className="mt-1 leading-6">可导出 SVG 或 PNG，方便直接用于页面或印刷物料。</div>
          </div>
        </section>

        <section className="flex-1 lg:flex lg:flex-col">
          <QrcodePreview
            ref={previewSvgRef}
            noise={previewModel?.noise ?? []}
            modules={previewModel?.modules ?? []}
            finders={previewModel?.finders ?? []}
          />

          <div className="flex flex-wrap justify-center gap-3 py-4 lg:py-5">
            <button
              type="button"
              onClick={randomizeEdge}
              className="cursor-pointer min-w-28 rounded-full border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              随机边缘
            </button>
            <button
              type="button"
              onClick={downloadPNG}
              className="cursor-pointer min-w-28 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              导出 PNG
            </button>
            <button
              type="button"
              onClick={downloadSVG}
              className="cursor-pointer min-w-28 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              导出 SVG
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
