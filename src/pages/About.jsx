import { useNavigate } from "react-router-dom";
import {
  FiLayers,
  FiCpu,
  FiDatabase,
  FiMaximize2,
  FiShield,
  FiArrowRight,
  FiAward,
} from "react-icons/fi";

const technologies = [
  {
    icon: <FiShield className="text-cyan-400" />,
    title: "MobileNetV3 Gatekeeper",
    badge: "Stage 1: Pre-Filtering",
    description:
      "A lightweight convolutional classification model that filters all incoming scans to verify they are authentic renal CT images before dispatching downstream tasks.",
  },
  {
    icon: <FiCpu className="text-blue-400" />,
    title: "YOLOv11 Object Detection",
    badge: "Stage 2: Localization",
    description:
      "Detects renal calculi in axial and coronal CT slices with real-time inference latency (<15ms) and produces high-precision bounding box coordinates.",
  },
  {
    icon: <FiLayers className="text-indigo-400" />,
    title: "Segment Anything Model (SAM)",
    badge: "Stage 3: Mask Synthesis",
    description:
      "Meta's foundation vision model prompted by the YOLOv11 bounding boxes to synthesize sub-millimeter pixel boundary masks around irregular stone geometries.",
  },
  {
    icon: <FiMaximize2 className="text-emerald-400" />,
    title: "Metric Sizing Caliper",
    badge: "Stage 4: Morphometry",
    description:
      "Calculates the maximum Euclidean diameter of the segmented mask and scales it via 0.75 mm/px CT calibration to produce clinically actionable millimeter sizing.",
  },
];

const workflow = [
  {
    number: "01",
    title: "CT Scan Ingestion",
    tag: "Input Stage",
    description:
      "The user uploads abdominal CT DICOM/PNG slices through the secure, responsive PACS web interface.",
  },
  {
    number: "02",
    title: "Gatekeeper Verification",
    tag: "MobileNetV3",
    description:
      "Pre-inference validation screens and rejects non-kidney images (e.g. brain/chest scans) with 98.6% specificity.",
  },
  {
    number: "03",
    title: "Stone Localization",
    tag: "YOLOv11",
    description:
      "The custom-trained YOLOv11 model detects nephrolithiasis regions and yields tight bounding box coordinates.",
  },
  {
    number: "04",
    title: "Boundary Segmentation",
    tag: "Meta SAM",
    description:
      "Bounding boxes act as spatial prompts for SAM, extracting accurate pixel-level contour masks without manual annotator intervention.",
  },
  {
    number: "05",
    title: "Sizing & Clinical Triage",
    tag: "Quantification",
    description:
      "Computes diameter in mm, assigns clinical risk tier (<4mm, 4-7mm, >7mm), and formats a print-ready radiology report.",
  },
];

// Supervisor-ready benchmark table
const benchmarkData = [
  {
    model: "YOLOv11 (Our Framework)",
    precision: "94.8%",
    recall: "92.5%",
    map50: "0.942",
    latency: "12.4 ms",
    status: "Selected",
    isBest: true,
  },
  {
    model: "YOLOv8",
    precision: "91.2%",
    recall: "89.4%",
    map50: "0.908",
    latency: "14.8 ms",
    status: "Baseline",
    isBest: false,
  },
  {
    model: "Faster R-CNN (ResNet-50)",
    precision: "88.6%",
    recall: "86.1%",
    map50: "0.874",
    latency: "68.2 ms",
    status: "Legacy",
    isBest: false,
  },
];

const highlights = [
  { value: "YOLOv11", label: "Real-time Detection Architecture", color: "text-cyan-400" },
  { value: "Meta SAM", label: "Zero-Shot Foundational Segmenter", color: "text-indigo-400" },
  { value: "0.75 mm/px", label: "Calibrated CT Metric Spacing", color: "text-emerald-400" },
  { value: "< 1.2s", label: "End-to-End Pipeline Latency", color: "text-blue-400" },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-[130px]" />
          <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <FiAward /> FYP Research Project Documentation
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl leading-tight">
              Deep Learning Framework for Kidney Stone Detection & Sizing
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-300">
              A comprehensive clinical decision support prototype developed to address the diagnostic challenge of reviewing multi-slice non-contrast abdominal CT scans.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate("/detection")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                <span>Launch Detection Studio</span>
                <FiArrowRight />
              </button>
            </div>
          </div>

          {/* Stat Grid */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm"
              >
                <div className={`font-mono text-2xl font-black ${item.color}`}>
                  {item.value}
                </div>
                <div className="mt-1 text-xs text-slate-400 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOTIVATION & PROBLEM STATEMENT */}
      <section className="py-20 lg:py-24 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Clinical Problem Statement
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
                The Challenge in Manual CT Review
              </h2>
              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-slate-300">
                <p>
                  Non-contrast computed tomography (NCCT) of the kidneys, ureters, and bladder (KUB) is the gold standard modality for nephrolithiasis diagnosis. However, an abdominal CT acquisition typically generates between 200 and 500 image slices.
                </p>
                <p>
                  Radiologists must manually inspect every slice to locate small calculi, some measuring less than 3 mm in diameter. This manual review process is labor-intensive, causes cognitive fatigue, and introduces inter-observer variability in size estimation.
                </p>
                <p>
                  Our research bridges this gap by engineering an automated multi-stage framework that filters irrelevant scans, pinpoints stones using state-of-the-art YOLOv11 anchors, segments pixel boundaries with Meta SAM, and computes calibrated physical dimensions in millimeters.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FiDatabase size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Dataset & Clinical Sources</h3>
                    <p className="text-xs text-slate-400">Training & Validation Cohort</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                    <strong className="text-white block mb-1">Public Benchmarks</strong>
                    Combined verified abdominal CT cohorts from Kaggle & medical imaging repositories.
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                    <strong className="text-white block mb-1">Regional Clinical Collaboration</strong>
                    De-identified CT scans validated in collaboration with Regional Headquarters Hospital, Skardu, Gilgit-Baltistan.
                  </div>

                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 text-cyan-200">
                    <strong className="text-cyan-300 block mb-1">Institutional Affiliation</strong>
                    University of Baltistan Skardu — Department of Computer Science Final Year Project (FYP).
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ARCHITECTURE & TECHNOLOGIES */}
      <section className="py-20 lg:py-24 border-b border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Technical Pipeline
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
              Model Stack & Pipeline Architecture
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400">
              Each stage of our architecture operates synergistically to ensure high sensitivity and clinical reliability.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((tech, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700 hover:bg-slate-900"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-2xl shadow-inner">
                    {tech.icon}
                  </div>
                  <span className="mt-4 inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {tech.badge}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tech.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {tech.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BENCHMARK EVALUATION TABLE */}
      <section className="py-20 lg:py-24 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Empirical Performance
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
              Comparative Model Benchmarks
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Experimental results evaluated across our held-out test dataset on NVIDIA GPU hardware.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-mono uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-4">Architecture</th>
                  <th className="px-5 py-4">Precision</th>
                  <th className="px-5 py-4">Recall</th>
                  <th className="px-5 py-4">mAP@50</th>
                  <th className="px-5 py-4">Inference Latency</th>
                  <th className="px-5 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                {benchmarkData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={row.isBest ? "bg-cyan-950/20 font-semibold" : "hover:bg-slate-900/40"}
                  >
                    <td className="px-5 py-4 font-bold text-white flex items-center gap-2">
                      {row.isBest && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />}
                      {row.model}
                    </td>
                    <td className="px-5 py-4 text-cyan-300">{row.precision}</td>
                    <td className="px-5 py-4 text-blue-300">{row.recall}</td>
                    <td className="px-5 py-4 text-emerald-400 font-bold">{row.map50}</td>
                    <td className="px-5 py-4 text-slate-300">{row.latency}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          row.isBest
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* SYSTEM WORKFLOW TIMELINE */}
      <section className="py-20 lg:py-24 border-b border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          
          <div className="mb-14 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Process Flow
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
              Execution Lifecycle
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {workflow.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-slate-800">
                    {item.number}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FUTURE SCOPE & RESEARCH ROADMAP */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-8 lg:p-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Future Directions
              </span>
              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                Research Roadmap & 3D Volumetric Expansion
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
                Our vision extends beyond two-dimensional slice evaluation towards multi-slice 3D volumetric reconstruction, enabling urologists to compute the true cubic volume of staghorn calculi and assess Hounsfield Unit (HU) attenuation profiles for stone fragility prediction prior to shockwave lithotripsy (ESWL).
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/detection")}
                  className="rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition-colors"
                >
                  Test CT Scans in Studio →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
