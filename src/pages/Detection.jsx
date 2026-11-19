
import { useEffect, useState } from "react";

import {
  FiUploadCloud,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiX,
  FiActivity,
  FiRefreshCw,
  FiDownload,
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000/api/predict";

/* ================= IMAGE HELPERS ================= */

function getImageUrl(value) {
  if (!value || typeof value !== "string") return "";

  if (
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `http://127.0.0.1:5000${value}`;
  }

  return `http://127.0.0.1:5000/${value}`;
}

function findImage(data, keys) {
  for (const key of keys) {
    const value = data?.[key];

    if (typeof value === "string" && value.length > 0) {
      return getImageUrl(value);
    }

    if (value && typeof value === "object") {
      if (typeof value.url === "string") {
        return getImageUrl(value.url);
      }

      if (typeof value.src === "string") {
        return getImageUrl(value.src);
      }

      if (typeof value.image === "string") {
        return getImageUrl(value.image);
      }
    }
  }

  return "";
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ================= DETECTION PAGE ================= */

export default function Detection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ================= SELECT IMAGE ================= */

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
      setError("Please select a PNG, JPG or JPEG image.");
      return;
    }

    setError("");
    setResult(null);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  /* ================= DRAG AND DROP ================= */

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    selectFile(event.dataTransfer.files?.[0]);
  };

  /* ================= CLEAR IMAGE ================= */

  const clearImage = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  /* ================= BACKEND DETECTION ================= */

  const handleDetection = async () => {
    if (!file) {
      setError("Please upload a CT scan image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Backend returned an invalid response.");
      }

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Server error: ${response.status}`
        );
      }

      console.log("Backend API Response:", data);

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect with the backend. Please check the Flask server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DETECTION STATUS ================= */

  const noStone =
    result?.detected === false ||
    result?.stone_detected === false ||
    result?.no_stone_detected === true ||
    result?.status === "no_detection";

  /* ================= RESULT IMAGES ================= */

  const yoloImage = findImage(result, [
    "yolo_image",
    "detection_image",
    "annotated_image",
    "bbox_image",
    "result_image",
  ]);

  const segmentationImage = findImage(result, [
    "segmentation_image",
    "sam_image",
    "mask_image",
    "segmented_image",
  ]);

  const segmentationSizeImage = findImage(result, [
    "segmentation_size_image",
  ]);

  const outputs = [
    {
      title: "YOLOv11 Detection",
      description: "Stone localization and detection output",
      image: yoloImage,
    },
    {
      title: "SAM Segmentation",
      description: "Stone boundary segmentation output",
      image: segmentationImage,
    },
    {
      title: "Estimated Stone Size",
      description: "Segmentation output with size estimation",
      image: segmentationSizeImage,
      wide: true,
    },
  ].filter((item) => item.image);

  /* ================= PDF REPORT ================= */

  const generatePDFReport = () => {
    if (!result) return;

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      setError(
        "Please allow pop-ups in your browser to generate the PDF report."
      );
      return;
    }

    setReportLoading(true);
    setError("");

    const generatedDate = new Date().toLocaleString();

    const detectionStatus = noStone
      ? "No Stone Detected"
      : "Detection Completed";

    const imageSections = [
      {
        title: "Original CT Scan",
        description: "Uploaded input image",
        image: preview,
      },
      ...outputs,
    ];

    const imageHTML = imageSections
      .map(
        (item, index) => `
          <section class="image-section">
            <div class="image-heading">
              <span class="image-number">${String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>${escapeHTML(item.title)}</h3>
                <p>${escapeHTML(item.description)}</p>
              </div>
            </div>

            <div class="image-frame">
              <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.title)}"
              />
            </div>
          </section>
        `
      )
      .join("");

    const messageHTML = result.message
      ? `
        <div class="message-box">
          <h3>Backend Message</h3>
          <p>${escapeHTML(result.message)}</p>
        </div>
      `
      : "";

    const reportHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Kidney Stone Detection Report</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 35px;
            background: #f1f5f9;
            color: #0f172a;
            font-family: Arial, Helvetica, sans-serif;
          }

          .report {
            max-width: 850px;
            margin: 0 auto;
            padding: 42px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
          }

          .top-line {
            height: 7px;
            margin: -42px -42px 35px;
            background: #0f172a;
          }

          .brand {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding-bottom: 22px;
            border-bottom: 1px solid #e2e8f0;
          }

          .brand-name {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .report-label {
            color: #64748b;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
          }

          .heading {
            padding: 35px 0 25px;
          }

          .heading .eyebrow {
            color: #64748b;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          h1 {
            margin: 12px 0;
            font-size: 30px;
            line-height: 1.2;
          }

          .subtitle {
            color: #64748b;
            font-size: 13px;
            line-height: 1.7;
          }

          .status-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            margin: 12px 0 30px;
            padding: 18px 20px;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
          }

          .status-label {
            color: #64748b;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.3px;
            text-transform: uppercase;
          }

          .status-value {
            margin-top: 6px;
            font-size: 17px;
            font-weight: 700;
          }

          .status-mark {
            display: flex;
            width: 38px;
            height: 38px;
            align-items: center;
            justify-content: center;
            border: 1px solid #0f172a;
            border-radius: 50%;
            font-size: 19px;
            font-weight: 700;
          }

          .section-title {
            margin: 30px 0 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #0f172a;
            font-size: 15px;
            font-weight: 700;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .info-item {
            padding: 14px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
          }

          .info-label {
            display: block;
            margin-bottom: 7px;
            color: #64748b;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .info-value {
            overflow-wrap: anywhere;
            font-size: 12px;
            font-weight: 600;
            line-height: 1.5;
          }

          .message-box {
            margin-top: 18px;
            padding: 15px;
            border-left: 3px solid #0f172a;
            background: #f8fafc;
          }

          .message-box h3 {
            margin: 0 0 7px;
            font-size: 12px;
          }

          .message-box p {
            margin: 0;
            color: #475569;
            font-size: 12px;
            line-height: 1.6;
          }

          .image-section {
            margin-top: 25px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .image-heading {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .image-number {
            display: flex;
            width: 34px;
            height: 34px;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            background: #0f172a;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
          }

          .image-heading h3 {
            margin: 0;
            font-size: 13px;
          }

          .image-heading p {
            margin: 5px 0 0;
            color: #64748b;
            font-size: 11px;
          }

          .image-frame {
            display: flex;
            min-height: 120px;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 10px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
          }

          .image-frame img {
            display: block;
            max-width: 100%;
            max-height: 440px;
            object-fit: contain;
          }

          .methodology {
            margin-top: 30px;
            padding: 18px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            page-break-inside: avoid;
          }

          .methodology h3 {
            margin: 0 0 10px;
            font-size: 13px;
          }

          .methodology p {
            margin: 0;
            color: #475569;
            font-size: 11px;
            line-height: 1.8;
          }

          .disclaimer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #cbd5e1;
            color: #64748b;
            font-size: 10px;
            line-height: 1.7;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-top: 22px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 9px;
          }

          @page {
            size: A4;
            margin: 14mm;
          }

          @media print {
            body {
              padding: 0;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .report {
              max-width: none;
              padding: 15px;
              border: none;
            }

            .top-line {
              margin: -15px -15px 25px;
            }

            .image-section {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            .image-frame img {
              max-height: 390px;
            }
          }
        </style>
      </head>

      <body>
        <main class="report">

          <div class="top-line"></div>

          <header class="brand">
            <div class="brand-name">
              Kidney Stone Detection System
            </div>

            <div class="report-label">
              ANALYSIS REPORT
            </div>
          </header>

          <section class="heading">
            <div class="eyebrow">Medical Imaging Research Project</div>

            <h1>Kidney Stone Detection Report</h1>

            <p class="subtitle">
              CT scan analysis using YOLOv11 detection and
              Segment Anything Model (SAM) segmentation.
            </p>
          </section>

          <section class="status-card">
            <div>
              <div class="status-label">Analysis Status</div>
              <div class="status-value">
                ${escapeHTML(detectionStatus)}
              </div>
            </div>

            <div class="status-mark">
              ${noStone ? "!" : "✓"}
            </div>
          </section>

          <h2 class="section-title">01 — Scan Information</h2>

          <div class="info-grid">

            <div class="info-item">
              <span class="info-label">Uploaded File</span>
              <span class="info-value">
                ${escapeHTML(file?.name || "Not available")}
              </span>
            </div>

            <div class="info-item">
              <span class="info-label">Report Generated</span>
              <span class="info-value">
                ${escapeHTML(generatedDate)}
              </span>
            </div>

            <div class="info-item">
              <span class="info-label">Detection Model</span>
              <span class="info-value">YOLOv11</span>
            </div>

            <div class="info-item">
              <span class="info-label">Segmentation Model</span>
              <span class="info-value">Original SAM</span>
            </div>

          </div>

          ${messageHTML}

          <h2 class="section-title">02 — Visual Analysis Results</h2>

          ${imageHTML}

          <section class="methodology">
            <h3>Analysis Pipeline</h3>
            <p>
              The uploaded CT scan is processed by the YOLOv11
              detection model to identify candidate regions.
              The Original Segment Anything Model (SAM) is then
              used for segmentation of the detected regions.
              The system also provides the size-estimation output
              when it is returned by the backend.
            </p>
          </section>

          <section class="disclaimer">
            <strong>Important Notice:</strong>
            This report is generated by an academic research
            prototype. Its outputs are intended for research
            and educational purposes only. They do not constitute
            a medical diagnosis or treatment recommendation.
            All findings must be reviewed by a qualified healthcare
            professional.
          </section>

          <footer class="footer">
            <span>Kidney Stone Detection System</span>
            <span>Generated: ${escapeHTML(generatedDate)}</span>
          </footer>

        </main>
      </body>
      </html>
    `;

    reportWindow.document.open();
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();

    const printReport = () => {
      setReportLoading(false);

      reportWindow.focus();

      setTimeout(() => {
        reportWindow.print();
      }, 500);
    };

    reportWindow.onload = async () => {
      const images = Array.from(
        reportWindow.document.images
      );

      await Promise.all(
        images.map((image) => {
          if (image.complete) return Promise.resolve();

          return new Promise((resolve) => {
            image.onload = resolve;
            image.onerror = resolve;
          });
        })
      );

      printReport();
    };

    // Fallback in case the browser does not fire onload.
    setTimeout(() => {
      if (reportLoading) {
        setReportLoading(false);
        reportWindow.focus();
        reportWindow.print();
      }
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-12">

        {/* PAGE HEADING */}

        <header className="mb-8">

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Kidney Stone Detection
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-900/70">
            Upload a CT scan to detect kidney stones with YOLOv11
            and segment detected regions using SAM.
          </p>

        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">

          {/* ================= UPLOAD SECTION ================= */}

          <section className="rounded-2xl border border-slate-900/15 bg-white p-6 shadow-sm lg:sticky lg:top-24">

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              CT Scan Image
            </h2>

            {!preview ? (

              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
                  dragging
                    ? "border-slate-900 bg-slate-900/5"
                    : "border-slate-900/30 bg-white hover:border-slate-900 hover:bg-slate-900/5"
                }`}
              >

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
                  <FiUploadCloud size={26} />
                </div>

                <p className="text-base font-semibold text-slate-900">
                  Drag and drop your image here
                </p>

                <p className="mt-1 text-sm text-slate-900/60">
                  or click to browse · PNG, JPG, JPEG
                </p>

                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="sr-only"
                />

              </label>

            ) : (

              /* IMAGE PREVIEW */

              <div className="rounded-xl border border-slate-900/15 bg-white p-2">

                <div className="overflow-hidden rounded-xl bg-white">

                  <img
                    src={preview}
                    alt="Uploaded CT scan"
                    className="max-h-[360px] w-full bg-white object-contain"
                  />

                </div>

                <div className="mt-3 flex items-center justify-between gap-3 px-2 pb-2">

                  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-900/70">

                    <FiImage className="shrink-0 text-slate-900" />

                    <span className="truncate font-medium text-slate-900">
                      {file?.name}
                    </span>

                    <span className="shrink-0 text-slate-900/60">
                      {file
                        ? (file.size / 1024).toFixed(0)
                        : 0} KB
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={loading}
                    className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:opacity-50"
                  >
                    <FiX size={15} />
                    Remove
                  </button>

                </div>

              </div>

            )}

            {/* ERROR MESSAGE */}

            {error && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-3 rounded-lg border border-slate-900 bg-slate-900 p-3 text-sm text-white"
              >
                <FiAlertCircle className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* DETECTION BUTTON */}

            <button
              type="button"
              onClick={handleDetection}
              disabled={!file || loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900/85 disabled:cursor-not-allowed disabled:bg-slate-900/30"
            >

              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Processing CT Scan...
                </>
              ) : (
                <>
                  <FiActivity size={18} />
                  Start Detection
                </>
              )}

            </button>

          </section>

          {/* ================= RESULTS SECTION ================= */}

          <section className="rounded-2xl border border-slate-900/15 bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center justify-between gap-3">

              <h2 className="text-lg font-semibold text-slate-900">
                Detection Results
              </h2>

              {result && !loading && (
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setError("");
                  }}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
                >
                  <FiRefreshCw size={14} />
                  Clear
                </button>
              )}

            </div>

            {/* EMPTY STATE */}

            {!result && !loading && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-white p-8 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
                  <FiActivity size={26} />
                </div>

                <p className="font-semibold text-slate-900">
                  No Results Yet
                </p>

                <p className="mt-1.5 max-w-xs text-sm leading-6 text-slate-900/60">
                  Upload a CT scan and click Start Detection.
                  Your results will appear here.
                </p>

              </div>
            )}

            {/* LOADING STATE */}

            {loading && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-900/15 bg-white p-8 text-center">

                <FiLoader className="mb-4 animate-spin text-4xl text-slate-900" />

                <p className="font-semibold text-slate-900">
                  Analyzing CT Scan
                </p>

                <p className="mt-1.5 text-sm text-slate-900/60">
                  YOLOv11 detection and SAM segmentation are running.
                  Please wait.
                </p>

              </div>
            )}

            {/* COMPLETED RESULTS */}

            {result && !loading && (
              <div className="space-y-5 bg-white">

                {/* STATUS */}

                <div className="flex items-start gap-3 rounded-lg border border-slate-900 bg-slate-900 p-3 text-white">

                  {noStone ? (
                    <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />
                  ) : (
                    <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />
                  )}

                  <div className="text-sm">

                    <p className="font-semibold">
                      {noStone
                        ? "No Stone Detected"
                        : "Detection Completed"}
                    </p>

                    {result.message && (
                      <p className="mt-0.5 text-white/70">
                        {result.message}
                      </p>
                    )}

                  </div>

                </div>

                {/* RESULT IMAGES */}

                {outputs.length > 0 ? (

                  <div className="grid gap-4 bg-white sm:grid-cols-2">

                    {outputs.map((item) => (
                      <ResultImage
                        key={item.title}
                        {...item}
                      />
                    ))}

                  </div>

                ) : (

                  <div className="rounded-xl border border-slate-900/15 bg-white p-8 text-center text-sm text-slate-900/60">
                    The backend did not return any output images.
                  </div>

                )}

                {/* PROFESSIONAL PDF REPORT */}

                <div className="rounded-xl border border-slate-900/15 bg-white p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <FiDownload size={21} />
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Detection Report
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-slate-900/60">
                          Download a professional report with scan
                          information and analysis images.
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={generatePDFReport}
                      disabled={reportLoading}
                      className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900/85 disabled:cursor-wait disabled:opacity-60"
                    >

                      {reportLoading ? (
                        <>
                          <FiLoader className="animate-spin" size={17} />
                          Preparing Report...
                        </>
                      ) : (
                        <>
                          <FiDownload size={17} />
                          Generate PDF Report
                        </>
                      )}

                    </button>

                  </div>

                </div>

              </div>
            )}

          </section>

        </div>

        {/* FOOTER */}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-slate-900/60">
          Research prototype. Results are not a substitute for
          professional medical interpretation.
        </p>

      </main>

    </div>
  );
}

/* ================= RESULT IMAGE COMPONENT ================= */

function ResultImage({ title, description, image, wide }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image]);

  return (
    <figure className={wide ? "bg-white sm:col-span-2" : "bg-white"}>

      <a
        href={image}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center overflow-hidden rounded-xl border border-slate-900/15 bg-white"
        title="Open full-size image"
      >

        {failed ? (

          <div className="flex min-h-[200px] items-center justify-center bg-white p-6 text-sm text-slate-900/60">
            Image could not be displayed.
          </div>

        ) : (

          <img
            src={image}
            alt={title}
            className={`w-full bg-white object-contain ${
              wide ? "max-h-[440px]" : "max-h-[300px]"
            }`}
            onError={() => setFailed(true)}
          />

        )}

      </a>

      <figcaption className="mt-2 bg-white">

        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-900/60">
          {description}
        </p>

      </figcaption>

    </figure>
  );
}
