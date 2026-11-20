import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiTarget,
  FiShield,
  FiLayers,
  FiCheckCircle,
  FiMaximize2,
} from "react-icons/fi";

export default function Hero() {
  const navigate = useNavigate();

  // Interactive layer states for the Hero CT scanner viewer
  const [activeLayer, setActiveLayer] = useState("all"); // 'raw', 'yolo', 'sam', 'measure', 'all'
  const [scannerSweep, setScannerSweep] = useState(true);

  // Stone coordinates on /images/kidney.png (1536 x 1024)
  const STONE = { left: 62.2, top: 31.0, width: 6.2, height: 7.8 };

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Background Ambient Glows & Tech Grid */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
            backgroundSize: "40px 40px, 80px 80px, 80px 80px",
          }}
        />
        <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-[350px] w-[700px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Heading, Value Props & Actions */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Project Status Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 backdrop-blur-md shadow-inner shadow-cyan-500/20">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                FYP Deep Learning Diagnostic Framework
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl leading-[1.15]">
              AI-Powered <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">Kidney Stone</span> Detection & Sizing
            </h1>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300">
              An end-to-end medical vision pipeline uniting <strong className="text-white font-semibold">MobileNetV3</strong> image gatekeeping, <strong className="text-white font-semibold">YOLOv11</strong> real-time localization, and Meta's <strong className="text-white font-semibold">Segment Anything Model (SAM)</strong> for sub-millimeter calculus boundary segmentation and automated diameter measurement.
            </p>

            {/* Feature Pills */}
            <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300">
                <FiShield className="text-cyan-400" /> MobileNetV3 Filter
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300">
                <FiTarget className="text-blue-400" /> YOLOv11 Detection
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300">
                <FiLayers className="text-indigo-400" /> SAM Segmentation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300">
                <FiMaximize2 className="text-emerald-400" /> Diameter in mm
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/detection")}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FiActivity size={19} className="animate-pulse" />
                <span>Launch Detection Studio</span>
                <FiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/about")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-4 font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <span>Read Architecture</span>
              </button>
            </div>

            {/* Key Metrics Strip */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-6 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
                <div className="text-xl font-bold font-mono text-cyan-400">98.6%</div>
                <div className="mt-0.5 text-xs text-slate-400 font-medium">Gatekeeper Acc.</div>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
                <div className="text-xl font-bold font-mono text-blue-400">0.942</div>
                <div className="mt-0.5 text-xs text-slate-400 font-medium">YOLOv11 mAP@50</div>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
                <div className="text-xl font-bold font-mono text-emerald-400">0.91</div>
                <div className="mt-0.5 text-xs text-slate-400 font-medium">SAM Dice Score</div>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
                <div className="text-xl font-bold font-mono text-indigo-400">&lt; 1.2s</div>
                <div className="mt-0.5 text-xs text-slate-400 font-medium">Inference Time</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Medical PACS / AI Viewer */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative mx-auto w-full max-w-[580px]">
              
              {/* Outer Ambient Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 blur-2xl" />

              {/* Main Medical HUD Card */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl">
                
                {/* Header PACS Bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono font-semibold text-slate-200">
                      PACS CT · CORONAL VIEW #142
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                      HU: +520
                    </span>
                    <button
                      onClick={() => setScannerSweep(!scannerSweep)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                        scannerSweep
                          ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                          : "border-slate-800 bg-slate-900 text-slate-400"
                      }`}
                    >
                      Sweep: {scannerSweep ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>

                {/* Layer Control Pills */}
                <div className="flex items-center justify-between border-b border-slate-800/60 bg-slate-900/90 px-3 py-2 text-[11px]">
                  <span className="text-slate-400 font-medium hidden sm:inline">AI Overlay:</span>
                  <div className="flex flex-wrap items-center gap-1">
                    {[
                      { id: "all", label: "Full Pipeline" },
                      { id: "yolo", label: "YOLOv11 Box" },
                      { id: "sam", label: "SAM Mask" },
                      { id: "measure", label: "Sizing Caliper" },
                      { id: "raw", label: "Raw CT" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveLayer(tab.id)}
                        className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                          activeLayer === tab.id
                            ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/50"
                            : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CT Scan Display Area */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-black select-none">
                  {/* Medical CT Image */}
                  <img
                    src="/images/kidney.png"
                    alt="Abdominal Coronal CT Scan with Renal Calculus"
                    className="absolute inset-0 h-full w-full object-contain filter contrast-110 brightness-105"
                  />

                  {/* Laser Scan Sweep Line */}
                  {scannerSweep && (
                    <div
                      className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-radar"
                      style={{ height: "2px" }}
                    />
                  )}

                  {/* Anatomical Left/Right Markers */}
                  <div className="absolute left-3 top-3 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-amber-400 font-mono border border-amber-500/30">
                    R
                  </div>
                  <div className="absolute right-3 top-3 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-amber-400 font-mono border border-amber-500/30">
                    L
                  </div>

                  {/* Medical Crosshair Target */}
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{
                      left: `${STONE.left}%`,
                      top: `${STONE.top}%`,
                    }}
                  >
                    <div className="h-10 w-10 border border-cyan-400/30 rounded-full animate-ping opacity-30" />
                  </div>

                  {/* Layer 1: YOLOv11 Bounding Box */}
                  {(activeLayer === "yolo" || activeLayer === "all") && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_16px_rgba(34,211,238,0.7)] transition-all duration-300"
                      style={{
                        left: `${STONE.left}%`,
                        top: `${STONE.top}%`,
                        width: `${STONE.width}%`,
                        height: `${STONE.height}%`,
                      }}
                    >
                      {/* Detection Label Badge */}
                      <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-cyan-500 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-950 shadow-md">
                        Kidney Stone 98.4%
                      </span>
                    </div>
                  )}

                  {/* Layer 2: SAM Segmentation Mask (Glow Polygon / Ellipse) */}
                  {(activeLayer === "sam" || activeLayer === "all") && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400 bg-emerald-400/40 shadow-[0_0_14px_rgba(52,211,153,0.8)] backdrop-brightness-125 transition-all duration-300"
                      style={{
                        left: `${STONE.left}%`,
                        top: `${STONE.top}%`,
                        width: `${STONE.width * 0.88}%`,
                        height: `${STONE.height * 0.88}%`,
                        transform: "translate(-50%, -50%) rotate(-12deg)",
                      }}
                    >
                      <div className="h-full w-full rounded-full border border-white/50 animate-pulse" />
                    </div>
                  )}

                  {/* Layer 3: Measurement Caliper */}
                  {(activeLayer === "measure" || activeLayer === "all") && (
                    <div
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                      style={{
                        left: `${STONE.left + 5.5}%`,
                        top: `${STONE.top}%`,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div className="h-10 w-0.5 bg-amber-400 relative">
                          <div className="absolute top-0 -left-1 w-2.5 h-0.5 bg-amber-400" />
                          <div className="absolute bottom-0 -left-1 w-2.5 h-0.5 bg-amber-400" />
                        </div>
                        <span className="rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-400/40 whitespace-nowrap">
                          Ø 6.4 mm
                        </span>
                      </div>
                    </div>
                  )}

                  {/* HUD Diagnostic Telemetry Bottom Left */}
                  <div className="absolute bottom-2.5 left-2.5 rounded-lg border border-slate-800/80 bg-slate-950/80 p-2 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                    <div className="text-cyan-400 font-semibold">FINDINGS:</div>
                    <div>Site: Left Renal Lower Pole</div>
                    <div>Matrix: 512x512 | 16-bit</div>
                  </div>

                  {/* HUD Diagnostic Telemetry Bottom Right */}
                  <div className="absolute bottom-2.5 right-2.5 rounded-lg border border-slate-800/80 bg-slate-950/80 p-2 text-[10px] font-mono text-slate-300 backdrop-blur-md text-right">
                    <div className="text-emerald-400 font-semibold">DIAGNOSTIC STATUS:</div>
                    <div>Calculus Confirmed</div>
                    <div className="text-amber-300">Size: 6.4mm (Intermediate)</div>
                  </div>
                </div>

                {/* Footer Telemetry & Live Inspector Bar */}
                <div className="flex flex-wrap items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400" />
                    <span>YOLOv11 + SAM Segmentation: Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-mono text-[11px]">Spacing: 0.75mm/px</span>
                    <button
                      onClick={() => navigate("/detection")}
                      className="ml-2 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                    >
                      Run Your CT →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
