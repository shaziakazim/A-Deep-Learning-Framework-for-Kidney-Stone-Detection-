
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

    const now = new Date();

    const generatedDate = now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const pad = (n) => String(n).padStart(2, "0");

    const reportId = `KSD-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    const detectionStatus = noStone
      ? "No Stone Detected"
      : "Detection Completed";

    const statusClass = noStone ? "status-neutral" : "status-positive";

    const fileSizeKB = file ? `${(file.size / 1024).toFixed(0)} KB` : "N/A";

    const fileType = file?.type
      ? file.type.replace("image/", "").toUpperCase()
      : "N/A";

    const summaryText = noStone
      ? "No kidney stone was detected by the YOLOv11 model in the submitted CT image. Segmentation outputs are shown only where the system returned them."
      : "The submitted CT image was analysed by the YOLOv11 detection model and the detected region(s) were segmented using the Segment Anything Model (SAM). The visual outputs are presented in the Findings section below.";

    const figures = [
      {
        title: "Original CT Scan",
        description: "Input image submitted for analysis",
        image: preview,
        wide: false,
      },
      ...outputs,
    ];

    const figureHTML = figures
      .map(
        (item, index) => `
          <figure class="figure ${item.wide ? "figure-wide" : ""}">
            <div class="figure-frame">
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" />
            </div>
            <figcaption>
              <strong>Figure ${index + 1}.</strong>
              ${escapeHTML(item.title)}
              <span>${escapeHTML(item.description)}</span>
            </figcaption>
          </figure>
        `
      )
      .join("");

    const messageHTML = result.message
      ? `
        <div class="note">
          <div class="note-title">System Message</div>
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
        <title>Kidney Stone Detection Report - ${escapeHTML(reportId)}</title>

        <style>
          * { box-sizing: border-box; }

          :root {
            --navy: #0b2a4a;
            --blue: #1d4ed8;
            --blue-soft: #eff6ff;
            --line: #d7dee8;
            --text: #1e293b;
            --muted: #64748b;
          }

          body {
            margin: 0;
            padding: 30px 0;
            background: #e8edf3;
            color: var(--text);
            font-family: "Segoe UI", Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.55;
          }

          .page {
            position: relative;
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 16mm 16mm 22mm;
            background: #ffffff;
            box-shadow: 0 2px 14px rgba(15, 23, 42, 0.12);
          }

          /* ---------- Letterhead ---------- */

          .letterhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding-bottom: 14px;
            border-bottom: 3px solid var(--navy);
          }

          .org {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .logo {
            display: flex;
            width: 42px;
            height: 42px;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: var(--navy);
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 1px;
          }

          .org-name {
            color: var(--navy);
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.4px;
          }

          .org-sub {
            margin-top: 2px;
            color: var(--muted);
            font-size: 10px;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          .meta {
            text-align: right;
            font-size: 10px;
            color: var(--muted);
            line-height: 1.7;
          }

          .meta strong { color: var(--text); }

          /* ---------- Title ---------- */

          .title-block {
            margin: 22px 0 18px;
            text-align: center;
          }

          .title-block h1 {
            margin: 0;
            color: var(--navy);
            font-size: 22px;
            letter-spacing: 0.6px;
            text-transform: uppercase;
          }

          .title-block p {
            margin: 6px 0 0;
            color: var(--muted);
            font-size: 11px;
          }

          /* ---------- Section heading ---------- */

          .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 24px 0 10px;
            padding: 7px 12px;
            border-left: 4px solid var(--blue);
            background: var(--blue-soft);
            color: var(--navy);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            break-after: avoid;
          }

          /* ---------- Tables ---------- */

          table.info {
            width: 100%;
            border-collapse: collapse;
          }

          table.info td {
            padding: 8px 12px;
            border: 1px solid var(--line);
            vertical-align: top;
            word-break: break-word;
          }

          table.info td.label {
            width: 22%;
            background: #f8fafc;
            color: var(--muted);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.6px;
            text-transform: uppercase;
          }

          table.info td.value {
            width: 28%;
            font-weight: 600;
          }

          /* ---------- Summary ---------- */

          .summary {
            display: flex;
            gap: 16px;
            align-items: stretch;
            border: 1px solid var(--line);
            break-inside: avoid;
          }

          .summary-status {
            display: flex;
            min-width: 170px;
            flex-direction: column;
            justify-content: center;
            padding: 14px 16px;
            color: #fff;
          }

          .status-positive { background: #15803d; }
          .status-neutral  { background: #b45309; }

          .summary-status small {
            font-size: 9px;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.85;
          }

          .summary-status strong {
            margin-top: 4px;
            font-size: 15px;
            line-height: 1.3;
          }

          .summary-text {
            flex: 1;
            padding: 14px 16px 14px 0;
            font-size: 12px;
            line-height: 1.7;
          }

          .note {
            margin-top: 12px;
            padding: 10px 14px;
            border-left: 3px solid var(--blue);
            background: #f8fafc;
            break-inside: avoid;
          }

          .note-title {
            margin-bottom: 3px;
            color: var(--navy);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          .note p { margin: 0; color: #475569; }

          /* ---------- Figures ---------- */

          .figures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .figure {
            margin: 0;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .figure-wide { grid-column: 1 / -1; }

          .figure-frame {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            border: 1px solid var(--line);
            background: #0b0f14;
          }

          .figure-frame img {
            display: block;
            max-width: 100%;
            max-height: 250px;
            object-fit: contain;
          }

          .figure-wide .figure-frame img { max-height: 330px; }

          figcaption {
            margin-top: 6px;
            font-size: 10.5px;
            color: var(--text);
          }

          figcaption strong { color: var(--navy); }

          figcaption span {
            display: block;
            margin-top: 1px;
            color: var(--muted);
            font-size: 10px;
          }

          /* ---------- Methodology ---------- */

          .method-text {
            margin: 0;
            color: #475569;
            text-align: justify;
          }

          /* ---------- Sign-off ---------- */

          .signoff {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 34px;
            break-inside: avoid;
          }

          .sign-line {
            padding-top: 6px;
            border-top: 1px solid var(--text);
            color: var(--muted);
            font-size: 10px;
          }

          .disclaimer {
            margin-top: 24px;
            padding: 12px 14px;
            border: 1px solid #fcd9a8;
            background: #fffbf3;
            color: #7c4a03;
            font-size: 10px;
            line-height: 1.7;
            break-inside: avoid;
          }

          /* ---------- Footer ---------- */

          .footer {
            position: absolute;
            right: 16mm;
            bottom: 9mm;
            left: 16mm;
            display: flex;
            justify-content: space-between;
            padding-top: 7px;
            border-top: 1px solid var(--line);
            color: var(--muted);
            font-size: 9px;
          }

          @page { size: A4; margin: 0; }

          @media print {
            body {
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .page {
              width: auto;
              margin: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>

      <body>
        <main class="page">

          <header class="letterhead">
            <div class="org">
              <div class="logo">KSD</div>
              <div>
                <div class="org-name">Kidney Stone Detection System</div>
                <div class="org-sub">AI-Assisted CT Image Analysis</div>
              </div>
            </div>

            <div class="meta">
              <div><strong>Report ID:</strong> ${escapeHTML(reportId)}</div>
              <div><strong>Date:</strong> ${escapeHTML(generatedDate)}</div>
            </div>
          </header>

          <section class="title-block">
            <h1>CT Analysis Report</h1>
            <p>Kidney stone detection and segmentation</p>
          </section>

          <div class="section-title">1. Summary of Analysis</div>

          <div class="summary">
            <div class="summary-status ${statusClass}">
              <small>Analysis Status</small>
              <strong>${escapeHTML(detectionStatus)}</strong>
            </div>
            <div class="summary-text">${escapeHTML(summaryText)}</div>
          </div>

          ${messageHTML}

          <div class="section-title">2. Scan Information</div>

          <table class="info">
            <tr>
              <td class="label">File Name</td>
              <td class="value">${escapeHTML(file?.name || "N/A")}</td>
              <td class="label">Report ID</td>
              <td class="value">${escapeHTML(reportId)}</td>
            </tr>
            <tr>
              <td class="label">Image Format</td>
              <td class="value">${escapeHTML(fileType)}</td>
              <td class="label">File Size</td>
              <td class="value">${escapeHTML(fileSizeKB)}</td>
            </tr>
            <tr>
              <td class="label">Detection Model</td>
              <td class="value">YOLOv11</td>
              <td class="label">Segmentation Model</td>
              <td class="value">Segment Anything (SAM)</td>
            </tr>
            <tr>
              <td class="label">Generated On</td>
              <td class="value" colspan="3">${escapeHTML(generatedDate)}</td>
            </tr>
          </table>

          <div class="section-title">3. Findings: Visual Results</div>

          <div class="figures">
            ${figureHTML}
          </div>

          <div class="section-title">4. Methodology</div>

          <p class="method-text">
            The uploaded CT image is first passed to a YOLOv11 object
            detection model, which localises candidate kidney stone regions.
            The detected regions are then segmented using the Segment
            Anything Model (SAM) to outline stone boundaries. Where the
            system returns it, an additional output with the estimated
            stone size is included. All results are produced automatically
            and have not been manually verified.
          </p>

          <div class="signoff">
            <div class="sign-line">Reviewed by (Name &amp; Signature)</div>
            <div class="sign-line">Date</div>
          </div>

          <div class="disclaimer">
            <strong>Important Notice:</strong> This report is generated by an
            academic research prototype and is intended for research and
            educational purposes only. It is not a medical diagnosis or a
            treatment recommendation. All findings must be reviewed and
            confirmed by a qualified healthcare professional.
          </div>

          <footer class="footer">
            <span>Kidney Stone Detection System | ${escapeHTML(reportId)}</span>
            <span>Confidential: Research Use Only</span>
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
      const images = Array.from(reportWindow.document.images);

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
