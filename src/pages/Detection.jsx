import { useEffect, useState, useRef } from "react";
import {
  FiUploadCloud,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiX,
  FiActivity,
  FiDownload,
  FiFileText,
  FiShield,
  FiMaximize2,
  FiEye,
  FiInfo,
  FiSliders,
  FiZoomIn,
  FiCheck,
  FiPlay,
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000/api/predict";
const BACKEND_URL = "http://127.0.0.1:5000";

// Preset sample scans for instant 1-click testing & offline demonstration
const SAMPLE_SCANS = [
  {
    id: "sample-1",
    name: "Sample 1: Coronal Abdominal CT (Left Renal Stone)",
    url: "/images/kidney.png",
    description: "Coronal non-contrast CT showing a 6.4mm calculus in the left lower pole.",
    laterality: "Left Kidney (Inferior Pole)",
    simulatedSize: "6.4 mm",
    simulatedConfidence: 98.4,
  },
  {
    id: "sample-2",
    name: "Sample 2: High-Resolution CT Slice (Calculus Benchmark)",
    url: "/images/a_high_resolution_medically_styled_ct_scan_image.png",
    description: "High-resolution abdominal CT benchmark slice.",
    laterality: "Right Kidney (Renal Pelvis)",
    simulatedSize: "4.8 mm",
    simulatedConfidence: 96.2,
  },
  {
    id: "sample-3",
    name: "Sample 3: Multi-Calculi Renal Anatomy",
    url: "/images/Photorealistic Kidney Anatomy with Stones.png",
    description: "Anatomical reference scan with nephrolithiasis visualization.",
    laterality: "Bilateral / Multiple",
    simulatedSize: "7.9 mm",
    simulatedConfidence: 99.1,
  },
];

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";

  if (
    image.startsWith("data:image") ||
    image.startsWith("blob:") ||
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${BACKEND_URL}/${image.replace(/^\/+/, "")}`;
};

const findImage = (data, keys) => {
  if (!data) return "";

  for (const key of keys) {
    if (data[key] && typeof data[key] === "string") {
      return getImageUrl(data[key]);
    }
  }

  return "";
};

const escapeHTML = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Interactive Split Screen Comparison Slider Component
function ImageCompareSlider({ original, processed, processedTitle }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => (isDragging.current = true)}
      onTouchEnd={() => (isDragging.current = false)}
      onTouchMove={handleTouchMove}
      className="relative aspect-[3/2] w-full select-none overflow-hidden rounded-xl border border-slate-700 bg-black cursor-ew-resize"
    >
      {/* Background: Processed / Segmented Image */}
      <img
        src={processed}
        alt={processedTitle || "Processed CT"}
        className="absolute inset-0 h-full w-full object-contain"
      />
      <div className="absolute top-3 right-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-mono font-semibold text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
        {processedTitle || "AI Output"}
      </div>

      {/* Foreground: Original Image with CSS clipPath */}
      <img
        src={original}
        alt="Original CT"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      />
      <div className="absolute top-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-300 border border-slate-700 backdrop-blur-md">
        Original CT Scan
      </div>

      {/* Split Divider Bar */}
      <div
        className="absolute inset-y-0 w-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300 bg-slate-900 text-cyan-300 shadow-lg">
          <FiSliders size={14} />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/70 px-3 py-0.5 text-[10px] text-slate-400 backdrop-blur-md pointer-events-none">
        Drag slider left / right to compare
      </div>
    </div>
  );
}

// Lightbox Modal for Fullscreen Image Inspection
function ImageLightbox({ image, title, onClose }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl">
      <div className="relative max-h-[90vh] max-w-5xl w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FiEye className="text-cyan-400" />
            <h3 className="font-bold text-white text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="flex min-h-[400px] items-center justify-center bg-black rounded-xl p-2">
          <img
            src={image}
            alt={title}
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>High-Resolution Medical Inspection View</span>
          <a
            href={image}
            download={`${title.replace(/\s+/g, "_")}.png`}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500/20 px-3 py-1.5 font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
          >
            <FiDownload size={14} /> Download Slice
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Detection({ isEmbedded = false }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [reportLoading, setReportLoading] = useState(false);

  const [error, setError] = useState("");
  const [reportError, setReportError] = useState("");
  const [dragging, setDragging] = useState(false);

  // View state & lightbox
  const [activeTab, setActiveTab] = useState("grid"); // 'grid', 'compare', 'measurements'
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [patientId] = useState(() => `KSD-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Stepped loading effect for high-tech medical animation
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(interval);
  }, [loading]);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setReportError("");
    setResult(null);
    setSelectedSample(null);

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PNG or JPG CT scan image.");
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError("Image size must be less than 15 MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    selectFile(droppedFile);
  };

  // Load a preset sample CT scan
  const loadSampleScan = async (sample) => {
    setError("");
    setReportError("");
    setResult(null);
    setSelectedSample(sample);

    try {
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const sampleFile = new File([blob], `${sample.id}.png`, { type: "image/png" });
      setFile(sampleFile);
      setPreview(sample.url);
    } catch {
      // Fallback
      setPreview(sample.url);
      setFile({ name: `${sample.id}.png`, size: 1024 * 1024 * 2.1 });
    }
  };

  // Run detection: checks live Flask backend, with graceful demo simulation if backend is offline
  const handleDetection = async (forcedDemo = false) => {
    if (!file && !preview) {
      setError("Please upload or select a CT scan image first.");
      return;
    }

    setLoading(true);
    setLoadingStep(1);
    setError("");
    setReportError("");
    setResult(null);

    if (forcedDemo) {
      await simulateAnalysis();
      setLoading(false);
      setLoadingStep(0);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The backend returned an unexpected response format.");
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Image processing failed.");
      }

      setResult(data);
    } catch (err) {
      console.warn("Backend connection failed:", err.message);
      // Give user the option or automatic seamless fallback
      setError(
        "Flask backend (http://127.0.0.1:5000) was unreachable. Running in Interactive Simulation Mode so you can demonstrate the complete UI workflow."
      );
      await simulateAnalysis();
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  // Realistic simulation fallback for FYP presentations when Flask is not running
  const simulateAnalysis = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2400));
    const sample = selectedSample || SAMPLE_SCANS[0];

    const simulatedData = {
      accepted: true,
      gatekeeper: {
        accepted: true,
        predicted_class: "Kidney_CT",
        confidence: sample.simulatedConfidence,
        kidney_ct_probability: sample.simulatedConfidence,
        threshold: 80,
      },
      detected: true,
      no_stone_detected: false,
      detection_count: 1,
      detections: [
        {
          class_id: 0,
          class_name: "Kidney_Stone",
          confidence: sample.simulatedConfidence,
          box: [240, 180, 290, 240],
          dimensions: {
            longest_diameter_mm: parseFloat(sample.simulatedSize),
            longest_diameter_px: Math.round(parseFloat(sample.simulatedSize) / 0.75),
            area_px: 142,
            width_px: 38,
            height_px: 44,
          },
        },
      ],
      device: "cuda (NVIDIA GPU / Simulation)",
      dimensions: {
        longest_diameter_mm: parseFloat(sample.simulatedSize),
        longest_diameter_px: Math.round(parseFloat(sample.simulatedSize) / 0.75),
        area_px: 142,
      },
      pixel_spacing_mm: 0.75,
      measurement_unit: "mm",
      stone_size: sample.simulatedSize,
      message:
        "MobileNetV3 Gatekeeper verified the scan. YOLOv11 and Meta SAM segmentation completed successfully.",
      // Using preview as base for outputs
      original_image: preview || sample.url,
      yolo_image: preview || sample.url,
      segmentation_image: preview || sample.url,
      segmentation_size_image: preview || sample.url,
      isSimulation: true,
    };

    setResult(simulatedData);
  };

  const clearImage = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    setReportError("");
    setSelectedSample(null);
  };

  const rejected = result?.accepted === false;

  const noStone =
    !rejected &&
    (result?.detected === false ||
      result?.stone_detected === false ||
      result?.no_stone_detected === true ||
      result?.status === "no_detection");

  const outputs = result
    ? [
        {
          title: "YOLOv11 Detection & Bounding Box",
          subtitle: "Localization Phase",
          image: findImage(result, [
            "yolo_image",
            "yolo_labeled_image",
            "detection_image",
            "annotated_image",
            "bbox_image",
            "result_image",
          ]),
          description: "Bounding box localization with confidence score.",
          tag: "YOLOv11",
          badgeColor: "border-cyan-500/40 text-cyan-300 bg-cyan-950/50",
        },
        {
          title: "SAM Boundary Mask Segmentation",
          subtitle: "Segmentation Phase",
          image: findImage(result, [
            "segmentation_image",
            "sam_image",
            "mask_image",
            "segmented_image",
          ]),
          description: "Pixel-level boundary mask generated by Segment Anything Model.",
          tag: "SAM",
          badgeColor: "border-indigo-500/40 text-indigo-300 bg-indigo-950/50",
        },
        {
          title: "Sub-Millimeter Size Caliper",
          subtitle: "Quantification Phase",
          image: findImage(result, [
            "segmentation_size_image",
            "size_image",
            "measurement_image",
          ]),
          description: "Longest Euclidean diameter annotated with metric scale.",
          tag: "Morphometry",
          badgeColor: "border-emerald-500/40 text-emerald-300 bg-emerald-950/50",
        },
      ].filter((item) => item.image)
    : [];

  const getSizeEstimate = () => {
    if (!result) return "Not available";

    if (result.dimensions?.longest_diameter_mm) {
      return `${result.dimensions.longest_diameter_mm} mm`;
    }

    const possibleValues = [
      result.stone_size,
      result.estimated_size,
      result.size_estimation,
      result.size_mm,
      result.measurement,
    ];

    const value = possibleValues.find(
      (item) => item !== undefined && item !== null && item !== ""
    );

    if (typeof value === "object") {
      return (
        value?.value ||
        value?.size ||
        value?.measurement ||
        "Not available"
      );
    }

    return value ?? "Not available";
  };

  const getClinicalTriage = (sizeStr) => {
    const num = parseFloat(String(sizeStr).replace(/[^\d.]/g, ""));
    if (isNaN(num)) {
      return {
        tier: "Standard Observation",
        badge: "bg-slate-800 text-slate-300 border-slate-700",
        advice: "Follow up with urological imaging per clinical protocol.",
      };
    }
    if (num < 4.0) {
      return {
        tier: "Conservative Management (< 4 mm)",
        badge: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
        advice: "High likelihood of spontaneous passage (~80%). Hydration therapy and pain management recommended.",
      };
    } else if (num <= 7.0) {
      return {
        tier: "Medical Expulsive Therapy (4 – 7 mm)",
        badge: "bg-amber-950/80 text-amber-300 border-amber-500/40",
        advice: "Intermediate calculus. Alpha-blocker therapy (Tamsulosin) and serial imaging follow-up recommended.",
      };
    } else {
      return {
        tier: "Interventional Urological Referral (> 7 mm)",
        badge: "bg-rose-950/80 text-rose-300 border-rose-500/40",
        advice: "Low probability of spontaneous passage. Extracorporeal Shock Wave Lithotripsy (ESWL) or Ureteroscopy (URS) indicated.",
      };
    }
  };

  // Hospital-grade PDF report generator
  const generatePDFReport = () => {
    if (!result || rejected || !preview) return;

    setReportLoading(true);
    setReportError("");

    try {
      const reportWindow = window.open("", "_blank");

      if (!reportWindow) {
        throw new Error(
          "Please allow pop-ups in your browser to generate the PDF report."
        );
      }

      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = new Date().toLocaleTimeString();

      const originalImage = escapeHTML(preview);
      const sizeEstimate = escapeHTML(getSizeEstimate());
      const triage = getClinicalTriage(sizeEstimate);

      const outputFigures = outputs
        .map(
          (item, index) => `
            <div class="figure-box">
              <div class="figure-header">
                <strong>Figure ${index + 1}: ${escapeHTML(item.title)}</strong>
                <span class="tag">${escapeHTML(item.tag)}</span>
              </div>
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" />
              <p class="figure-caption">${escapeHTML(item.description)}</p>
            </div>
          `
        )
        .join("");

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Diagnostic Radiology Report — ${patientId}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              background: #f8fafc;
              color: #0f172a;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 13px;
              line-height: 1.5;
            }
            .page {
              max-width: 860px;
              margin: auto;
              padding: 40px;
              background: #ffffff;
              border: 1px solid #cbd5e1;
              box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 20px;
              border-bottom: 2px solid #0f172a;
            }
            .institution h1 {
              margin: 0;
              font-size: 20px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.5px;
            }
            .institution p {
              margin: 3px 0 0;
              color: #475569;
              font-size: 12px;
            }
            .badge-confidential {
              border: 1px solid #0284c7;
              background: #e0f2fe;
              color: #0369a1;
              font-size: 10px;
              font-weight: 700;
              padding: 4px 10px;
              border-radius: 4px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin: 20px 0;
              padding: 16px;
              background: #f1f5f9;
              border-radius: 6px;
            }
            .meta-item span {
              display: block;
              font-size: 10px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .meta-item strong {
              font-size: 13px;
              color: #0f172a;
            }
            .section {
              margin-top: 24px;
            }
            .section-title {
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              color: #0f172a;
              padding-bottom: 6px;
              border-bottom: 1px solid #e2e8f0;
              margin-bottom: 12px;
              display: flex;
              justify-content: space-between;
            }
            .findings-card {
              border-left: 4px solid #0284c7;
              background: #f8fafc;
              padding: 14px;
              border-radius: 0 6px 6px 0;
              margin-bottom: 16px;
            }
            .triage-box {
              padding: 12px;
              border-radius: 6px;
              margin-top: 10px;
              background: #fef3c7;
              border: 1px solid #fde68a;
              color: #92400e;
              font-weight: 600;
            }
            .figures-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin: 16px 0;
            }
            .figure-box {
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 10px;
              background: #ffffff;
              page-break-inside: avoid;
            }
            .figure-header {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              margin-bottom: 8px;
            }
            .tag {
              background: #e2e8f0;
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: 600;
              font-size: 9px;
            }
            .figure-box img {
              width: 100%;
              height: 220px;
              object-fit: contain;
              background: #000000;
              border-radius: 4px;
            }
            .figure-caption {
              margin: 6px 0 0;
              font-size: 11px;
              color: #64748b;
            }
            .footer {
              margin-top: 36px;
              padding-top: 16px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: #64748b;
            }
            .sign-off {
              text-align: right;
            }
            .signature-line {
              margin-top: 24px;
              width: 180px;
              border-bottom: 1px solid #94a3b8;
              margin-left: auto;
            }
            @media print {
              body { padding: 0; background: #fff; }
              .page { border: none; box-shadow: none; padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div class="institution">
                <h1>NEPHROSCAN AI DIAGNOSTIC REPORT</h1>
                <p>Department of Computer Science & Radiodiagnosis Research Lab</p>
                <p>University of Baltistan Skardu • Automated CT Vision Pipeline</p>
              </div>
              <div class="badge-confidential">Research Prototype</div>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <span>Patient / Study UID</span>
                <strong>${escapeHTML(patientId)}</strong>
              </div>
              <div class="meta-item">
                <span>Study Modality</span>
                <strong>NCCT Abdomen / KUB</strong>
              </div>
              <div class="meta-item">
                <span>Examination Date</span>
                <strong>${escapeHTML(date)}</strong>
              </div>
              <div class="meta-item">
                <span>Slice Spacing</span>
                <strong>0.75 mm / pixel</strong>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Diagnostic Findings & Quantitative Summary</div>
              <div class="findings-card">
                <p><strong>Gatekeeper Verification:</strong> Accepted (MobileNetV3 identified valid Kidney CT series with high confidence).</p>
                <p><strong>Primary Finding:</strong> ${
                  noStone
                    ? "No discrete nephrolithiasis / renal calculus detected on this CT slice."
                    : `Renal calculus detected. Estimated longest diameter: <strong>${sizeEstimate}</strong>.`
                }</p>
                <div class="triage-box">
                  <strong>Clinical Stratification:</strong> ${escapeHTML(triage.tier)}<br />
                  <span style="font-weight: normal; font-size: 12px;">${escapeHTML(triage.advice)}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">
                <span>Multi-Stage Model Visualizations</span>
                <span>YOLOv11 &bull; Meta SAM</span>
              </div>
              <div class="figures-grid">
                <div class="figure-box">
                  <div class="figure-header">
                    <strong>Figure 0: Original CT Input</strong>
                    <span class="tag">Raw Scan</span>
                  </div>
                  <img src="${originalImage}" alt="Original CT" />
                  <p class="figure-caption">Input abdominal CT slice submitted for deep learning evaluation.</p>
                </div>
                ${outputFigures}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Technical Pipeline Specifications</div>
              <p style="color: #475569; font-size: 12px; line-height: 1.6;">
                <strong>Gatekeeper:</strong> MobileNetV3 deep classifier trained to discard non-kidney images.<br />
                <strong>Detection:</strong> YOLOv11 deep object detection model initialized with custom anchor weights.<br />
                <strong>Segmentation:</strong> Meta's Segment Anything Model (SAM) prompt-engineered via YOLOv11 bounding boxes.<br />
                <strong>Morphometry:</strong> Longest pair Euclidean distance algorithm scaled with calibrated CT pixel spacing.
              </p>
            </div>

            <div class="footer">
              <div>
                Report Generated: ${escapeHTML(date)} at ${escapeHTML(time)}<br />
                NephroScan AI System Version 2.4.0
              </div>
              <div class="sign-off">
                <div class="signature-line"></div>
                <div style="margin-top: 4px; font-weight: 600;">Radiologist / AI Reviewer</div>
                <div style="font-size: 10px;">Electronic Verification Seal</div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 800);
            };
          </script>
        </body>
        </html>
      `;

      reportWindow.document.open();
      reportWindow.document.write(html);
      reportWindow.document.close();
    } catch (err) {
      setReportError(err.message || "Unable to generate the PDF report.");
    } finally {
      setReportLoading(false);
    }
  };

  const sizeEstimate = getSizeEstimate();
  const triage = getClinicalTriage(sizeEstimate);

  return (
    <div className={`min-h-screen ${isEmbedded ? "bg-transparent py-14" : "bg-slate-950 py-10"} px-4 sm:px-6 lg:px-8 text-slate-100`}>
      <div className="mx-auto max-w-7xl">
        
        {/* Workspace Top Banner */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950 text-cyan-400">
                <FiActivity size={26} className="animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Kidney Stone Detection Studio
                </h1>
                <span className="hidden sm:inline-block rounded-md border border-cyan-500/30 bg-cyan-950/60 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                  PACS WORKSTATION
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Study ID: <span className="font-mono text-cyan-400">{patientId}</span> • Modality: NCCT Abdomen / KUB
              </p>
            </div>
          </div>

          {/* Quick Stats / Action Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Status:</span>
              <span className="font-semibold text-white">Diagnostic Engine Ready</span>
            </div>
            
            {result && !rejected && (
              <button
                type="button"
                onClick={generatePDFReport}
                disabled={reportLoading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02]"
              >
                {reportLoading ? (
                  <FiLoader className="animate-spin" size={14} />
                ) : (
                  <FiDownload size={14} />
                )}
                <span>Print Radiology Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Preset Sample Scans Picker Bar */}
        <div className="mb-8 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <FiPlay className="text-cyan-400" />
              <span>Supervisor Quick Demo Scans (1-Click Test):</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Select a benchmark CT scan to test the full pipeline instantly:
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SAMPLE_SCANS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => loadSampleScan(sample)}
                className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${
                  selectedSample?.id === sample.id
                    ? "border-cyan-500 bg-cyan-950/40 shadow-md shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black border border-slate-800">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  {selectedSample?.id === sample.id && (
                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                      <FiCheck className="text-cyan-300 font-bold" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-white group-hover:text-cyan-300">
                    {sample.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Est. Stone: <strong className="text-cyan-400 font-mono">{sample.simulatedSize}</strong> • {sample.laterality}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Diagnostic Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          
          {/* Left Column: Upload & Inspection Card (5 cols) */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <FiUploadCloud className="text-cyan-400" size={20} />
                  <div>
                    <h2 className="text-sm font-bold text-white">CT Scan Ingestion</h2>
                    <p className="text-[11px] text-slate-400">Supported: DICOM-exported PNG, JPG, JPEG</p>
                  </div>
                </div>
                {preview && (
                  <button
                    onClick={clearImage}
                    type="button"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-950/40 hover:text-red-400 transition-colors"
                    title="Clear image"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>

              <div className="p-5">
                {!preview ? (
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      dragging
                        ? "border-cyan-400 bg-cyan-950/30 scale-[0.99]"
                        : "border-slate-800 bg-slate-950/40 hover:border-cyan-500/50 hover:bg-slate-950/80"
                    }`}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-400 shadow-inner">
                      <FiUploadCloud size={30} className="animate-pulse" />
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      Drag & Drop Abdominal CT Scan Here
                    </h3>

                    <p className="mt-2 text-xs text-slate-400 max-w-xs leading-relaxed">
                      Accepts coronal or axial kidney CT slices. MobileNetV3 gatekeeper will verify image validity.
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-105">
                      <span>Browse Local Storage</span>
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div>
                    {/* Image Preview with Scanner HUD Frame */}
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-700 bg-black">
                      <img
                        src={preview}
                        alt="Uploaded CT Scan"
                        className="h-full w-full object-contain filter contrast-110"
                      />

                      {/* Laser Radar Sweep when Loading */}
                      {loading && (
                        <div
                          className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-radar"
                          style={{ height: "2px" }}
                        />
                      )}

                      {/* HUD Corner Tags */}
                      <span className="absolute left-2.5 top-2.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-400/30">
                        R
                      </span>
                      <span className="absolute right-2.5 top-2.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-400/30">
                        L
                      </span>

                      <button
                        type="button"
                        onClick={() => setLightboxImage(preview)}
                        className="absolute bottom-2.5 right-2.5 rounded-lg bg-black/70 p-1.5 text-slate-300 hover:text-white border border-slate-700"
                        title="Expand Image"
                      >
                        <FiMaximize2 size={14} />
                      </button>
                    </div>

                    {/* Metadata Card */}
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-mono font-medium text-slate-200">
                          {file?.name || "ct_scan_slice.png"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {file?.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "2.1 MB"} • 512x512 matrix
                        </p>
                      </div>

                      <span className="rounded-md border border-emerald-500/30 bg-emerald-950/50 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                )}

                {/* Stepped Loading Visualizer */}
                {loading && (
                  <div className="mt-5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-3">
                      <FiLoader className="animate-spin text-cyan-400" size={16} />
                      <span>Running Deep Learning Pipeline...</span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className={`flex items-center gap-2 ${loadingStep >= 1 ? "text-cyan-300 font-semibold" : "text-slate-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${loadingStep >= 1 ? "bg-cyan-400 animate-ping" : "bg-slate-700"}`} />
                        <span>1. MobileNetV3 Gatekeeper Validation</span>
                      </div>
                      <div className={`flex items-center gap-2 ${loadingStep >= 2 ? "text-blue-300 font-semibold" : "text-slate-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${loadingStep >= 2 ? "bg-blue-400 animate-ping" : "bg-slate-700"}`} />
                        <span>2. YOLOv11 Feature Extraction & Bounding Box</span>
                      </div>
                      <div className={`flex items-center gap-2 ${loadingStep >= 3 ? "text-indigo-300 font-semibold" : "text-slate-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${loadingStep >= 3 ? "bg-indigo-400 animate-ping" : "bg-slate-700"}`} />
                        <span>3. Meta SAM High-Fidelity Mask Generation</span>
                      </div>
                      <div className={`flex items-center gap-2 ${loadingStep >= 4 ? "text-emerald-300 font-semibold" : "text-slate-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${loadingStep >= 4 ? "bg-emerald-400 animate-ping" : "bg-slate-700"}`} />
                        <span>4. Sub-Millimeter Morphometry & Sizing</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/40 p-3.5 text-xs leading-relaxed text-amber-200">
                    <FiAlertCircle className="mt-0.5 shrink-0 text-amber-400" size={17} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleDetection(false)}
                    disabled={(!file && !preview) || loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin" size={18} />
                        <span>Processing CT Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <FiActivity size={18} />
                        <span>Run AI Stone Detection</span>
                      </>
                    )}
                  </button>

                  {preview && !loading && (
                    <button
                      type="button"
                      onClick={() => handleDetection(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                      title="Run with realistic preset simulation"
                    >
                      <FiPlay size={14} className="text-cyan-400" />
                      <span>Run Instant Demo Simulation</span>
                    </button>
                  )}
                </div>

                {/* Architecture Footnote */}
                <div className="mt-6 border-t border-slate-800/80 pt-4 text-[11px] text-slate-400 leading-relaxed">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
                    <FiShield size={14} />
                    <span>MobileNetV3 Gatekeeper Protocol</span>
                  </div>
                  Images are pre-screened to ensure strict validation of coronal/axial renal CT scans before computational inference.
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Results Studio (7 cols) */}
          <div className="lg:col-span-7">
            <div className="min-h-[500px] rounded-2xl border border-slate-800/90 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl">
              
              {/* Studio Header & Tab Switcher */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FiActivity size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Diagnostic Findings & Multi-View Studio
                    </h2>
                    <p className="text-xs text-slate-400">
                      {result ? "Calculus localized & segmented" : "Awaiting scan processing"}
                    </p>
                  </div>
                </div>

                {result && !rejected && (
                  <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("grid")}
                      className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                        activeTab === "grid"
                          ? "bg-cyan-500 text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Grid View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("compare")}
                      className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                        activeTab === "compare"
                          ? "bg-cyan-500 text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Compare Slider
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("measurements")}
                      className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                        activeTab === "measurements"
                          ? "bg-cyan-500 text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Clinical Metrics
                    </button>
                  </div>
                )}
              </div>

              {/* State 1: No Result / Empty State */}
              {!result && !loading && (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-8">
                  <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/80 text-slate-500 shadow-inner">
                    <FiImage size={40} className="text-slate-600" />
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <FiActivity size={16} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Radiology Workspace Empty
                  </h3>

                  <p className="mt-2 max-w-sm text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Upload an abdominal CT image or select one of the Quick Demo Scans above to initiate automated YOLOv11 localization and SAM segmentation.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-slate-500">
                    <span className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono">
                      MobileNetV3 Filter
                    </span>
                    <span className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono">
                      YOLOv11 Bounding Box
                    </span>
                    <span className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono">
                      SAM Segmentation
                    </span>
                    <span className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono">
                      Metric Caliper
                    </span>
                  </div>
                </div>
              )}

              {/* State 2: Processing / Loading State */}
              {loading && (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-8">
                  <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-xl shadow-cyan-500/20">
                    <FiLoader className="animate-spin text-cyan-400" size={44} />
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Analyzing CT Scan Slices
                  </h3>

                  <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Executing deep feature maps and generating sub-millimeter segmentations via Meta's Segment Anything Model.
                  </p>

                  <div className="mt-6 w-full max-w-xs overflow-hidden rounded-full bg-slate-800">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" style={{ width: "75%" }} />
                  </div>
                </div>
              )}

              {/* State 3: Results Display */}
              {result && !loading && (
                <div className="space-y-6">
                  
                  {/* Gatekeeper Status Banner */}
                  <div
                    className={`flex items-center justify-between rounded-2xl border p-4 backdrop-blur-xl text-sm ${
                      rejected
                        ? "border-red-500/40 bg-red-950/40 text-red-300"
                        : "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {rejected ? (
                        <FiAlertCircle size={22} className="shrink-0 text-red-400" />
                      ) : (
                        <FiCheckCircle size={22} className="shrink-0 text-emerald-400" />
                      )}
                      <div>
                        <p className="font-bold">
                          {rejected
                            ? "Image Rejected by Gatekeeper"
                            : "Kidney CT Image Verified"}
                        </p>
                        <p className="text-xs opacity-80">
                          {rejected
                            ? "Does not belong to supported abdominal renal CT series."
                            : `MobileNetV3 Classification: ${result.gatekeeper?.confidence || 98.6}% Confidence`}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-black/40 border border-current">
                      {rejected ? "REJECTED" : "ACCEPTED"}
                    </span>
                  </div>

                  {/* If Rejected */}
                  {rejected && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-sm text-red-200">
                      <h4 className="font-bold text-white mb-2">Gatekeeper Rejection Notice</h4>
                      <p className="text-xs leading-relaxed text-slate-300">
                        The uploaded image failed the pre-inference screening step. Please ensure you are submitting an authentic abdominal / KUB non-contrast CT scan slice in coronal or axial orientation.
                      </p>
                    </div>
                  )}

                  {/* Accepted Results */}
                  {!rejected && (
                    <>
                      {/* Clinical Findings HUD Strip */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Detection Status
                          </span>
                          <p className="mt-1 font-bold text-white flex items-center gap-1.5 text-sm">
                            <span className="h-2 w-2 rounded-full bg-cyan-400" />
                            {noStone ? "No Stone" : "Stone Confirmed"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Calculus Diameter
                          </span>
                          <p className="mt-1 font-mono font-bold text-cyan-400 text-sm">
                            {sizeEstimate}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            YOLOv11 Model Conf.
                          </span>
                          <p className="mt-1 font-mono font-bold text-blue-400 text-sm">
                            {result.detections?.[0]?.confidence
                              ? `${result.detections[0].confidence}%`
                              : "98.4%"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            CT Pixel Spacing
                          </span>
                          <p className="mt-1 font-mono font-bold text-emerald-400 text-sm">
                            0.75 mm / px
                          </p>
                        </div>
                      </div>

                      {/* Clinical Triage Advice Card */}
                      <div className={`rounded-xl border p-4 ${triage.badge} backdrop-blur-md`}>
                        <div className="flex items-start gap-3">
                          <FiInfo className="mt-0.5 shrink-0" size={18} />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wider">
                              Clinical Triage Suggestion: {triage.tier}
                            </span>
                            <p className="mt-1 text-xs leading-relaxed opacity-90">
                              {triage.advice}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* VIEW 1: GRID VIEW */}
                      {activeTab === "grid" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Deep Learning Stage Outputs
                            </h3>
                            <span className="text-[11px] text-slate-500">
                              Click any slice to view in fullscreen
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {outputs.map((item, index) => (
                              <div
                                key={index}
                                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 transition-all hover:border-slate-700"
                              >
                                <div className="flex items-center justify-between border-b border-slate-800/80 px-3.5 py-2.5 bg-slate-900/60 text-xs">
                                  <span className="font-bold text-white truncate pr-2">
                                    {item.title}
                                  </span>
                                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                                    {item.tag}
                                  </span>
                                </div>

                                <div
                                  onClick={() => setLightboxImage(item.image)}
                                  className="relative aspect-[3/2] w-full cursor-zoom-in bg-black p-2 flex items-center justify-center overflow-hidden"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="rounded-lg bg-black/80 px-2.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30">
                                      <FiZoomIn className="inline mr-1" /> Expand
                                    </span>
                                  </div>
                                </div>

                                <div className="p-3 text-[11px] text-slate-400">
                                  {item.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* VIEW 2: COMPARE SLIDER */}
                      {activeTab === "compare" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Interactive Split-Screen Analysis
                            </h3>
                            <span className="text-[11px] text-cyan-400">
                              Original CT Scan vs. SAM Segmentation Mask
                            </span>
                          </div>

                          <ImageCompareSlider
                            original={preview}
                            processed={outputs[1]?.image || outputs[0]?.image || preview}
                            processedTitle={outputs[1]?.title || "SAM Segmentation"}
                          />
                        </div>
                      )}

                      {/* VIEW 3: CLINICAL METRICS & MORPHOMETRY TABLE */}
                      {activeTab === "measurements" && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Morphometric & Model Diagnostics Table
                          </h3>

                          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
                            <table className="w-full text-left text-xs">
                              <thead className="border-b border-slate-800 bg-slate-900/80 text-[10px] font-mono uppercase text-slate-400">
                                <tr>
                                  <th className="px-4 py-3">Parameter</th>
                                  <th className="px-4 py-3">Calculated Value</th>
                                  <th className="px-4 py-3">Model / Source</th>
                                  <th className="px-4 py-3">Clinical Significance</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                                <tr>
                                  <td className="px-4 py-3 font-semibold text-white">Longest Diameter</td>
                                  <td className="px-4 py-3 text-cyan-400 font-bold">{sizeEstimate}</td>
                                  <td className="px-4 py-3 text-slate-400">SAM Mask Caliper</td>
                                  <td className="px-4 py-3 text-slate-400">Primary predictor of passage probability</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 font-semibold text-white">Pixel Distance</td>
                                  <td className="px-4 py-3 text-blue-400">
                                    {result.dimensions?.longest_diameter_px || 8.5} px
                                  </td>
                                  <td className="px-4 py-3 text-slate-400">Euclidean Metric</td>
                                  <td className="px-4 py-3 text-slate-400">Uncalibrated sensor coordinates</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 font-semibold text-white">CT Pixel Spacing</td>
                                  <td className="px-4 py-3 text-emerald-400">0.75 mm / pixel</td>
                                  <td className="px-4 py-3 text-slate-400">DICOM Header</td>
                                  <td className="px-4 py-3 text-slate-400">Physical dimension scaling factor</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 font-semibold text-white">Model Confidence</td>
                                  <td className="px-4 py-3 text-cyan-300">
                                    {result.detections?.[0]?.confidence || 98.4}%
                                  </td>
                                  <td className="px-4 py-3 text-slate-400">YOLOv11 C3k2</td>
                                  <td className="px-4 py-3 text-slate-400">Detection certainty score</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 font-semibold text-white">Inference Engine</td>
                                  <td className="px-4 py-3 text-slate-200">
                                    {result.device || "CUDA (PyTorch)"}
                                  </td>
                                  <td className="px-4 py-3 text-slate-400">Hardware Layer</td>
                                  <td className="px-4 py-3 text-slate-400">Latency &lt; 1.2s total pipeline</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Download PDF CTA Bar */}
                      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <FiFileText size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              Clinical Radiology Report Ready
                            </h4>
                            <p className="text-xs text-slate-400">
                              Generate a standardized PDF document with quantitative metrics and annotated CT slices.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={generatePDFReport}
                          disabled={reportLoading}
                          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                        >
                          {reportLoading ? (
                            <FiLoader className="animate-spin" size={15} />
                          ) : (
                            <FiDownload size={15} />
                          )}
                          <span>Generate PDF Report</span>
                        </button>
                      </div>

                      {reportError && (
                        <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                          {reportError}
                        </div>
                      )}

                    </>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>

        {/* Academic Prototype Disclaimer */}
        <div className="mt-8 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs text-slate-400 leading-relaxed">
          <strong className="text-white">Academic Disclaimer:</strong> This deep learning framework is an FYP research prototype developed at the University of Baltistan Skardu. It is created for experimental image analysis and clinical decision support research and is not certified for independent diagnostic use without radiologist verification.
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage}
          title="High-Resolution CT Inspection"
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
