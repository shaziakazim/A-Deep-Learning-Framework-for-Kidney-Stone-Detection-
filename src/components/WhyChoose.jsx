import {
  FiCpu,
  FiTarget,
  FiActivity,
  FiShield,
  FiLayers,
  FiMaximize2,
  FiCheckCircle,
} from "react-icons/fi";

export default function WhyChoose() {
  const pipelineSteps = [
    {
      step: "01",
      tag: "GATEKEEPER STAGE",
      title: "MobileNetV3 CT Filter",
      description:
        "Validates incoming images prior to expensive model inference. Effectively rejects non-CT inputs, brain/chest scans, or corrupted files with 98.6% specificity.",
      icon: <FiShield className="text-cyan-400" size={26} />,
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      borderColor: "border-cyan-500/30",
      accent: "text-cyan-400",
      stats: "98.6% Rejection Acc.",
    },
    {
      step: "02",
      tag: "LOCALIZATION STAGE",
      title: "YOLOv11 Deep Detection",
      description:
        "Employs Ultralytics' cutting-edge YOLOv11 neural network to detect renal calculi, outputting high-confidence bounding box coordinates in real time (<15ms).",
      icon: <FiTarget className="text-blue-400" size={26} />,
      gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
      borderColor: "border-blue-500/30",
      accent: "text-blue-400",
      stats: "0.942 mAP@50",
    },
    {
      step: "03",
      tag: "SEGMENTATION STAGE",
      title: "Meta SAM Prompting",
      description:
        "Zero-shot prompting transfers YOLOv11 bounding boxes into Meta's Segment Anything Model (SAM) to isolate the precise pixel-level boundaries of the stone.",
      icon: <FiLayers className="text-indigo-400" size={26} />,
      gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
      borderColor: "border-indigo-500/30",
      accent: "text-indigo-400",
      stats: "0.910 Dice Coeff.",
    },
    {
      step: "04",
      tag: "QUANTIFICATION STAGE",
      title: "Sub-Millimeter Sizing",
      description:
        "Computes the longest diameter using Euclidean coordinate pairs on the binary mask, converted with CT pixel-spacing calibration to assist clinical intervention decisions.",
      icon: <FiMaximize2 className="text-emerald-400" size={26} />,
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/30",
      accent: "text-emerald-400",
      stats: "0.75 mm Calibrated",
    },
  ];

  const clinicalAdvantages = [
    {
      title: "Automated Clinical Triage",
      desc: "Instant categorization into Conservative (<4mm), Medical Expulsive Therapy (4-7mm), or Urological Intervention (>7mm) tiers.",
    },
    {
      title: "Instant Diagnostic Reporting",
      desc: "One-click generation of comprehensive, print-ready PDF radiology reports with clinical findings and annotated CT slices.",
    },
    {
      title: "Dual-Engine Verification",
      desc: "Eliminates false alarms by coupling deep object detection with prompt-driven foundational segmentation.",
    },
    {
      title: "Academic Reproducibility",
      desc: "Built with standardized evaluation metrics (Dice, IoU, mAP, Hausdorff distance) adhering to rigorous medical AI benchmarks.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-slate-100 border-t border-slate-900">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
            <FiCpu /> Core AI Architecture
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A Multi-Stage Deep Learning Pipeline
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-400">
            Engineered specifically to solve the limitations of standalone object detectors by integrating gatekeeping, localized detection, foundational segmentation, and metric quantification.
          </p>
        </div>

        {/* 4 Pipeline Stage Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pipelineSteps.map((step) => (
            <div
              key={step.step}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${step.borderColor} bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-cyan-950/50`}
            >
              {/* Subtle card glow overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${step.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="relative z-10">
                {/* Step number & Icon header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-slate-700 transition-colors group-hover:text-slate-500">
                    {step.step}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
                    {step.icon}
                  </div>
                </div>

                {/* Stage Tag */}
                <span className={`mt-5 inline-block text-[10px] font-bold uppercase tracking-wider ${step.accent}`}>
                  {step.tag}
                </span>

                {/* Title */}
                <h3 className="mt-1 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>

              {/* Card Footer Metric Badge */}
              <div className="relative z-10 mt-6 border-t border-slate-800/80 pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-mono font-medium text-slate-300">
                  <FiActivity className={step.accent} size={13} />
                  {step.stats}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Highlights Banner */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-8 shadow-2xl lg:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Clinical Workflow Integration
              </span>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                Bridging Deep Learning & Clinical Radiology
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-400">
                Manual review of abdominal non-contrast CT (NCCT) scans requires scrolling through hundreds of slices. NephroScan automates detection and measurement in seconds.
              </p>
              
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-cyan-600 text-xs font-bold text-white">
                    98%
                  </div>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-600 text-xs font-bold text-white">
                    0.94
                  </div>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-indigo-600 text-xs font-bold text-white">
                    SAM
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-300">
                  Validated against standard benchmark CT slices
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {clinicalAdvantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <FiCheckCircle className="text-cyan-400 shrink-0" size={17} />
                    <span>{adv.title}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
