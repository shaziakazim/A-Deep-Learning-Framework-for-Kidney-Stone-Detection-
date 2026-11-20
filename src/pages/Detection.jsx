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
  FiFileText,
  FiShield,
  FiExternalLink,
  FiTarget,
  FiMaximize2,
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000/api/predict";
const BACKEND_URL = "http://127.0.0.1:5000";

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

const ResultImage = ({ title, image, description }) => {
  const [imageError, setImageError] = useState(false);
  const [prevImage, setPrevImage] = useState(image);

  if (image !== prevImage) {
    setPrevImage(image);
    setImageError(false);
  }

  if (!image) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-4 py-3">
        <div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-slate-400">{description}</p>
          )}
        </div>
        <a
          href={image}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Open image in new tab"
        >
          <span>Expand</span>
          <FiExternalLink size={12} />
        </a>
      </div>

      <div className="flex min-h-[220px] items-center justify-center bg-black p-3">
        {imageError ? (
          <div className="py-10 text-center text-sm text-slate-400">
            <FiImage className="mx-auto mb-2 text-2xl text-slate-500" />
            Unable to load this image.
          </div>
        ) : (
          <a
            href={image}
            target="_blank"
            rel="noreferrer"
            className="block w-full cursor-zoom-in"
          >
            <img
              src={image}
              alt={title}
              onError={() => setImageError(true)}
              className="mx-auto max-h-[380px] w-full rounded-lg object-contain transition-transform duration-200 hover:scale-[1.01]"
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default function Detection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const [error, setError] = useState("");
  const [reportError, setReportError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setReportError("");
    setResult(null);

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PNG or JPG image.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
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

  const handleDetection = async () => {
    if (!file) {
      setError("Please upload a CT scan image first.");
      return;
    }

    setLoading(true);
    setError("");
    setReportError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Image processing failed."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the backend. Please check that the Flask server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    setReportError("");
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
          title: "YOLOv11 Bounding Box Detection",
          image: findImage(result, [
            "yolo_labeled_image",
            "yolo_image",
            "detection_image",
            "annotated_image",
            "bbox_image",
            "result_image",
          ]),
          description: "AI localized bounding box with detection confidence and exact stone size badge.",
        },
        {
          title: "SAM Pixel-Level Segmentation",
          image: findImage(result, [
            "segmentation_image",
            "sam_image",
            "mask_image",
            "segmented_image",
          ]),
          description: "High-precision boundary segmentation mask generated by Meta SAM.",
        },
        {
          title: "Exact Stone Size & Caliper Measurement",
          image: findImage(result, [
            "segmentation_size_image",
            "size_image",
            "measurement_image",
          ]),
          description: "Bounding box, PACS-style caliper dimension line, and exact size in mm.",
        },
      ].filter((item) => item.image)
    : [];

  const getSizeEstimate = () => {
    if (!result) return "Not available";

    if (result.stone_size) return result.stone_size;
    if (result.estimated_size) return result.estimated_size;
    if (result.size_mm) return `${result.size_mm} mm`;
    if (result.primary_stone?.exact_size_mm) return `${result.primary_stone.exact_size_mm} mm`;
    if (result.dimensions?.estimated_size_mm) return `${result.dimensions.estimated_size_mm} mm`;

    return "No stone detected";
  };

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

      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();

      const originalImage = escapeHTML(preview);
      const sizeEstimate = escapeHTML(getSizeEstimate());

      const stoneRows = (result.detections || [])
        .map(
          (det, idx) => `
            <tr>
              <td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;color:#0284c7;">Stone #${det.id || idx + 1}</td>
              <td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;color:#1e293b;">${det.exact_size_mm || det.dimensions?.estimated_size_mm || 0} mm</td>
              <td style="padding:8px;border:1px solid #e2e8f0;">${det.length_mm || det.dimensions?.length_mm || 0} × ${det.width_mm || det.dimensions?.width_mm || 0} mm</td>
              <td style="padding:8px;border:1px solid #e2e8f0;">${det.area_mm2 || det.dimensions?.area_mm2 || 0} mm²</td>
              <td style="padding:8px;border:1px solid #e2e8f0;font-size:11px;color:#64748b;">[${(det.box || []).map((v) => Math.round(v)).join(", ")}]</td>
              <td style="padding:8px;border:1px solid #e2e8f0;">${escapeHTML(det.clinical_category || "N/A")}</td>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:right;font-weight:bold;">${det.confidence?.toFixed(1) || 0}%</td>
            </tr>
          `
        )
        .join("");

      const stoneTableSection = (result.detections && result.detections.length > 0)
        ? `
            <section class="section">
              <h2>Exact Stone Sizing & Clinical Metrics</h2>
              <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;">
                <thead>
                  <tr style="background:#f8fafc;color:#475569;text-align:left;">
                    <th style="padding:8px;border:1px solid #e2e8f0;">Stone</th>
                    <th style="padding:8px;border:1px solid #e2e8f0;">Exact Size</th>
                    <th style="padding:8px;border:1px solid #e2e8f0;">Dimensions (L×W)</th>
                    <th style="padding:8px;border:1px solid #e2e8f0;">Area</th>
                    <th style="padding:8px;border:1px solid #e2e8f0;">Bounding Box</th>
                    <th style="padding:8px;border:1px solid #e2e8f0;">Classification</th>
                    <th style="padding:8px;border:1px solid #e2e8f0;text-align:right;">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  ${stoneRows}
                </tbody>
              </table>
              <div style="margin-top:10px;font-size:11px;color:#64748b;line-height:1.6;">
                <strong>Clinical Risk Assessment:</strong> ${escapeHTML(result.primary_stone?.clinical_action || "Calibrated at 0.75 mm/pixel spacing.")}
              </div>
            </section>
          `
        : "";

      const outputFigures = outputs
        .map(
          (item, index) => `
            <div class="figure">
              <h3>${index + 1}. ${escapeHTML(item.title)}</h3>
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(
                item.title
              )}" />
              <p>${escapeHTML(item.description)}</p>
            </div>
          `
        )
        .join("");

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Kidney Stone Detection Report</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 35px;
              background: #f1f5f9;
              color: #1e293b;
              font-family: Arial, Helvetica, sans-serif;
            }

            .report {
              max-width: 850px;
              margin: auto;
              padding: 42px;
              background: #ffffff;
              border: 1px solid #e2e8f0;
            }

            .header {
              padding-bottom: 24px;
              border-bottom: 3px solid #12345a;
            }

            .header h1 {
              margin: 0;
              color: #12345a;
              font-size: 27px;
            }

            .header p {
              margin: 8px 0 0;
              color: #64748b;
              font-size: 13px;
            }

            .section {
              margin-top: 28px;
            }

            .section h2 {
              margin: 0 0 14px;
              padding-bottom: 9px;
              border-bottom: 1px solid #e2e8f0;
              color: #12345a;
              font-size: 17px;
            }

            .summary {
              padding: 16px;
              border: 1px solid #bbf7d0;
              border-radius: 8px;
              background: #f0fdf4;
              color: #166534;
              font-weight: bold;
            }

            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }

            .detail {
              padding: 13px;
              border: 1px solid #e2e8f0;
              border-radius: 7px;
            }

            .detail span {
              display: block;
              margin-bottom: 6px;
              color: #64748b;
              font-size: 11px;
            }

            .detail strong {
              color: #1e293b;
              font-size: 13px;
              overflow-wrap: anywhere;
            }

            .original-image,
            .figure img {
              display: block;
              width: 100%;
              max-height: 420px;
              margin: 12px auto;
              object-fit: contain;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              background: #f8fafc;
            }

            .figure {
              margin: 20px 0;
              page-break-inside: avoid;
            }

            .figure h3 {
              color: #1e293b;
              font-size: 14px;
            }

            .figure p {
              color: #64748b;
              font-size: 12px;
            }

            .note {
              padding: 14px;
              border-left: 4px solid #12345a;
              background: #f8fafc;
              color: #475569;
              font-size: 12px;
              line-height: 1.7;
            }

            .footer {
              margin-top: 35px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 11px;
              line-height: 1.6;
              text-align: center;
            }

            @media print {
              body {
                padding: 0;
                background: #ffffff;
              }

              .report {
                max-width: none;
                padding: 20px;
                border: none;
              }

              .section,
              .figure {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <main class="report">
            <header class="header">
              <h1>Kidney Stone Detection Report</h1>
              <p>AI-Based Kidney CT Image Analysis System</p>
            </header>

            <section class="section">
              <h2>Analysis Summary</h2>
              <div class="summary">
                Kidney CT image detected.
              </div>
              <p style="font-size: 12px; color: #64748b; line-height: 1.7;">
                The uploaded image passed the image filtering stage and was
                processed by the available detection and segmentation pipeline.
              </p>
            </section>

            <section class="section">
              <h2>Report Information</h2>
              <div class="details">
                <div class="detail">
                  <span>Report Date</span>
                  <strong>${escapeHTML(date)}</strong>
                </div>

                <div class="detail">
                  <span>Report Time</span>
                  <strong>${escapeHTML(time)}</strong>
                </div>

                <div class="detail">
                  <span>Uploaded File</span>
                  <strong>${escapeHTML(file?.name || "CT Scan Image")}</strong>
                </div>

                <div class="detail">
                  <span>Estimated Stone Size</span>
                  <strong>${sizeEstimate}</strong>
                </div>
              </div>
            </section>

            ${stoneTableSection}

            <section class="section">
              <h2>Original CT Scan Image</h2>
              <img
                class="original-image"
                src="${originalImage}"
                alt="Original CT scan"
              />
            </section>

            <section class="section">
              <h2>Model Processing Results</h2>
              ${
                outputFigures ||
                `<p style="color:#64748b;font-size:13px;">
                  No output images were provided by the backend.
                </p>`
              }
            </section>

            <section class="section">
              <h2>Processing Methodology</h2>
              <div class="note">
                <strong>Image Filtering:</strong>
                MobileNetV3 Gatekeeper checks whether the uploaded image
                belongs to the supported kidney CT image category.

                <br /><br />

                <strong>Detection:</strong>
                YOLOv11 is used for kidney stone detection and localization.

                <br /><br />

                <strong>Segmentation:</strong>
                SAM is used to generate segmentation results for the detected
                region.

                <br /><br />

                <strong>Size Estimation:</strong>
                The system presents the size estimation information returned
                by the backend, when available.
              </div>
            </section>

            <section class="section">
              <h2>Important Disclaimer</h2>
              <div class="note">
                This report is generated by an academic research prototype.
                It is intended for educational and research purposes only.
                It is not a clinical diagnosis and must not be used as a
                substitute for professional medical evaluation.
              </div>
            </section>

            <footer class="footer">
              Kidney Stone Detection System<br />
              AI-Based Medical Image Analysis Research Project
            </footer>
          </main>

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
      setReportError(
        err.message || "Unable to generate the PDF report."
      );
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 border-b border-slate-900 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950 text-cyan-400">
                <FiActivity size={24} className="animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Kidney Stone Detection
                </h1>
                <span className="rounded-md border border-cyan-500/30 bg-cyan-950/60 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                  AI WORKSTATION
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Upload a CT scan image to start the deep learning detection and segmentation pipeline.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Upload Section (5 cols) */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-xl">
              <div className="border-b border-slate-800 bg-slate-950/70 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <FiUploadCloud className="text-cyan-400" size={20} />
                  <h2 className="font-bold text-white text-sm sm:text-base">
                    Upload CT Scan
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Supported formats: JPG, JPEG and PNG. Maximum size: 10 MB.
                </p>
              </div>

              <div className="p-5">
                {!preview ? (
                  <label
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`flex min-h-[290px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      dragging
                        ? "border-cyan-400 bg-cyan-950/30 scale-[0.99]"
                        : "border-slate-800 bg-slate-950/40 hover:border-cyan-500/50 hover:bg-slate-950/80"
                    }`}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-400 shadow-inner">
                      <FiUploadCloud size={30} className="animate-pulse" />
                    </div>

                    <h3 className="font-bold text-white text-sm">
                      Drag and drop your CT image
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      or click below to browse files from your computer
                    </p>

                    <span className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-105">
                      Browse Image
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
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                        <FiImage className="text-cyan-400" />
                        Uploaded Image
                      </div>

                      <button
                        onClick={clearImage}
                        type="button"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-950/40 hover:text-red-400"
                        title="Remove image"
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-black p-2">
                      <img
                        src={preview}
                        alt="Uploaded CT scan"
                        className="max-h-[350px] w-full rounded-lg object-contain"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-mono text-xs font-semibold text-slate-200">
                          {file?.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {file
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : ""}
                        </p>
                      </div>
                      <span className="rounded bg-cyan-950/80 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300 border border-cyan-800/40">
                        READY
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300 leading-relaxed">
                    <FiAlertCircle className="mt-0.5 shrink-0 text-red-400" size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDetection}
                  disabled={!file || loading}
                  className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-3.5 font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={19} />
                      <span>Processing Image...</span>
                    </>
                  ) : (
                    <>
                      <FiActivity size={19} />
                      <span>Start Detection</span>
                    </>
                  )}
                </button>

                {file && !loading && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    <FiRefreshCw size={15} />
                    <span>Reset Image</span>
                  </button>
                )}

                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-start gap-3">
                    <FiShield className="mt-0.5 shrink-0 text-cyan-400" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Image Filtering (MobileNetV3)
                      </h4>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        The uploaded image is verified by the gatekeeper classifier before detection and segmentation stages are executed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section (7 cols) */}
          <div className="lg:col-span-7">
            <div className="min-h-[460px] rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <FiActivity className="text-cyan-400" size={20} />
                <h2 className="font-bold text-white text-base sm:text-lg">
                  Detection Results
                </h2>
              </div>

              {!result && !loading && (
                <div className="flex min-h-[340px] flex-col items-center justify-center text-center p-6">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-slate-500 shadow-inner">
                    <FiImage size={34} />
                  </div>

                  <h3 className="font-bold text-white text-base">
                    No Results Available
                  </h3>

                  <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400">
                    Upload a kidney CT scan image and click Start Detection to view the model processing results here.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex min-h-[340px] flex-col items-center justify-center text-center p-6">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-lg shadow-cyan-500/20">
                    <FiLoader className="animate-spin" size={32} />
                  </div>

                  <h3 className="font-bold text-white text-base">
                    Processing Your Image
                  </h3>

                  <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400">
                    Please wait while the image filtering, detection and segmentation pipeline processes your image.
                  </p>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-6">
                  {/* Gatekeeper Status */}
                  <div
                    className={`flex items-center justify-between rounded-xl border p-4 text-xs sm:text-sm font-semibold backdrop-blur-sm ${
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

                      <span>
                        {rejected
                          ? "Image didnt pass Kidney CT Filteration"
                          : "Kidney CT image detected."}
                      </span>
                    </div>

                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-black/40 border border-current">
                      {rejected ? "REJECTED" : "ACCEPTED"}
                    </span>
                  </div>

                  {/* Rejected Image */}
                  {rejected && (
                    <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
                      <h3 className="font-bold text-red-300 text-sm">
                        Image Not Accepted
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        Please upload a supported kidney CT scan image to continue the analysis.
                      </p>
                    </div>
                  )}

                  {/* Accepted Image Results */}
                  {!rejected && (
                    <>
                      {noStone && (
                        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4">
                          <div className="flex items-start gap-3">
                            <FiAlertCircle className="mt-0.5 shrink-0 text-amber-400" size={18} />
                            <div>
                              <h3 className="font-bold text-amber-300 text-sm">
                                No Stone Detection
                              </h3>
                              <p className="mt-1 text-xs leading-relaxed text-amber-200/90">
                                The image passed the kidney CT filter, but the detection model did not report a stone detection for this image.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 1. Output Images First (YOLO -> SAM -> Caliper Size) */}
                      {outputs.length > 0 && (
                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-white text-sm">
                                Processing Output
                              </h3>
                              <p className="mt-0.5 text-xs text-slate-400">
                                Visual results generated by the detection and segmentation pipeline.
                              </p>
                            </div>
                            <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                              {outputs.length} Output View{outputs.length > 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-5">
                            {outputs.map((item) => (
                              <ResultImage
                                key={item.title}
                                title={item.title}
                                image={item.image}
                                description={item.description}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {outputs.length === 0 && (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-xs leading-relaxed text-amber-200">
                          The image passed the kidney CT filter, but no output images were returned by the backend. Please check the backend response.
                        </div>
                      )}

                      {/* 2. Baqi Details Neechay (Stone Detection & Exact Size Analysis Dashboard) */}
                      {!noStone && (result?.detection_count > 0 || (result?.detections && result.detections.length > 0)) && (
                        <div className="overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/90 shadow-2xl backdrop-blur-xl">
                          {/* Banner Header */}
                          <div className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-950/90 via-blue-950/60 to-slate-950/90 px-5 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
                                  <FiTarget size={24} className="animate-pulse" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-extrabold text-white text-base sm:text-lg">
                                      Kidney Stone Detected!
                                    </h3>
                                    <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 text-[11px] font-bold text-red-300">
                                      {result.detection_count || result.detections?.length || 1} Stone{(result.detection_count || result.detections?.length || 1) > 1 ? "s" : ""} Boxed
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-slate-400">
                                    Stone localized with bounding box and measured using PACS-calibrated Feret caliper
                                  </p>
                                </div>
                              </div>

                              {/* Primary Exact Size Badge */}
                              <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500/25 to-blue-500/20 border border-cyan-400/50 px-4 py-2 shadow-lg shadow-cyan-500/10">
                                <div className="text-right">
                                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                                    Exact Stone Size
                                  </div>
                                  <div className="text-2xl font-black tracking-tight text-white font-mono drop-shadow">
                                    {result.stone_size || `${result.primary_stone?.exact_size_mm || result.size_mm} mm`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Metrics Grid */}
                          <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                              {/* 1. Max Diameter (Length) */}
                              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 transition-all hover:border-cyan-500/30">
                                <div className="text-[11px] font-semibold text-slate-400">
                                  Max Diameter (Length)
                                </div>
                                <div className="mt-1 text-lg sm:text-xl font-mono font-extrabold text-cyan-300">
                                  {result.primary_stone?.exact_size_mm || result.size_mm || 0} mm
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  ~{(((result.primary_stone?.exact_size_mm || result.size_mm || 0)) / 10).toFixed(2)} cm
                                </div>
                              </div>

                              {/* 2. Transverse Width */}
                              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 transition-all hover:border-cyan-500/30">
                                <div className="text-[11px] font-semibold text-slate-400">
                                  Transverse Width
                                </div>
                                <div className="mt-1 text-lg sm:text-xl font-mono font-extrabold text-blue-300">
                                  {result.primary_stone?.width_mm || result.primary_stone?.dimensions?.width_mm || "N/A"} mm
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Minor caliper axis
                                </div>
                              </div>

                              {/* 3. Surface Area */}
                              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 transition-all hover:border-cyan-500/30">
                                <div className="text-[11px] font-semibold text-slate-400">
                                  Surface Area
                                </div>
                                <div className="mt-1 text-lg sm:text-xl font-mono font-extrabold text-emerald-300">
                                  {result.primary_stone?.area_mm2 || result.primary_stone?.dimensions?.area_mm2 || "N/A"} mm²
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {result.primary_stone?.dimensions?.area_px || 0} px² mask
                                </div>
                              </div>

                              {/* 4. Estimated Volume */}
                              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 transition-all hover:border-cyan-500/30">
                                <div className="text-[11px] font-semibold text-slate-400">
                                  Est. Volume
                                </div>
                                <div className="mt-1 text-lg sm:text-xl font-mono font-extrabold text-purple-300">
                                  {result.primary_stone?.volume_mm3 ? `~${result.primary_stone.volume_mm3} mm³` : "N/A"}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Ellipsoid estimate
                                </div>
                              </div>
                            </div>

                            {/* Clinical Assessment Box */}
                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`mt-0.5 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase ${
                                      (result.primary_stone?.exact_size_mm || 0) < 5
                                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                                        : (result.primary_stone?.exact_size_mm || 0) <= 10
                                        ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                                        : "bg-red-950/80 text-red-300 border border-red-500/40"
                                    }`}
                                  >
                                    {result.primary_stone?.clinical_category || "Stone Evaluation"}
                                  </span>
                                  <div>
                                    <div className="text-xs font-semibold text-slate-200">
                                      Spontaneous Passage:{" "}
                                      <span className="font-bold text-white">
                                        {result.primary_stone?.spontaneous_passage || "High likelihood (< 5 mm)"}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                                      {result.primary_stone?.clinical_action ||
                                        "Consult a medical specialist for clinical correlation and treatment recommendations."}
                                    </p>
                                  </div>
                                </div>

                                <div className="shrink-0 text-left sm:text-right font-mono text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5">
                                  <div>Detection Confidence: <strong className="text-cyan-300">{result.primary_stone?.confidence || 0}%</strong></div>
                                  <div>CT Pixel Spacing: <strong className="text-slate-300">{result.pixel_spacing_mm || 0.75} mm/px</strong></div>
                                </div>
                              </div>
                            </div>

                            {/* Detected Stones Table */}
                            {result.detections && result.detections.length > 0 && (
                              <div>
                                <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                                  <span>Stone Breakdown ({result.detections.length})</span>
                                  <span className="text-[11px] font-mono text-cyan-400">All stones boxed with exact dimensions</span>
                                </div>
                                <div className="overflow-x-auto rounded-xl border border-slate-800">
                                  <table className="w-full text-left text-xs">
                                    <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                                      <tr>
                                        <th className="px-3.5 py-2.5">Stone #</th>
                                        <th className="px-3.5 py-2.5">Exact Size</th>
                                        <th className="px-3.5 py-2.5">Dimensions (L × W)</th>
                                        <th className="px-3.5 py-2.5">Area</th>
                                        <th className="px-3.5 py-2.5">Bounding Box [X1, Y1, X2, Y2]</th>
                                        <th className="px-3.5 py-2.5">Category</th>
                                        <th className="px-3.5 py-2.5 text-right">Confidence</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-mono">
                                      {result.detections.map((det, i) => (
                                        <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                                          <td className="px-3.5 py-2.5 font-bold text-cyan-400">
                                            Stone #{det.id || i + 1}
                                          </td>
                                          <td className="px-3.5 py-2.5 font-bold text-white">
                                            {det.exact_size_mm || det.dimensions?.estimated_size_mm || 0} mm
                                          </td>
                                          <td className="px-3.5 py-2.5 text-slate-300">
                                            {det.length_mm || det.dimensions?.length_mm || 0} × {det.width_mm || det.dimensions?.width_mm || 0} mm
                                          </td>
                                          <td className="px-3.5 py-2.5 text-slate-300">
                                            {det.area_mm2 || det.dimensions?.area_mm2 || 0} mm²
                                          </td>
                                          <td className="px-3.5 py-2.5 text-slate-400 text-[10px]">
                                            [{det.box?.map((v) => Math.round(v)).join(", ")}]
                                          </td>
                                          <td className="px-3.5 py-2.5">
                                            <span
                                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                                (det.exact_size_mm || 0) < 5
                                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                                                  : (det.exact_size_mm || 0) <= 10
                                                  ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                                                  : "bg-red-950 text-red-300 border border-red-500/30"
                                              }`}
                                            >
                                              {det.clinical_category || (det.exact_size_mm < 5 ? "< 5 mm" : det.exact_size_mm <= 10 ? "5-10 mm" : "> 10 mm")}
                                            </span>
                                          </td>
                                          <td className="px-3.5 py-2.5 text-right font-bold text-cyan-300">
                                            {det.confidence?.toFixed(1)}%
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* PDF Report */}
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              <FiFileText size={22} />
                            </div>

                            <div>
                              <h3 className="font-bold text-white text-sm">
                                Detection Report
                              </h3>
                              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                                Generate a professional PDF report containing the uploaded image and available processing results.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={generatePDFReport}
                            disabled={reportLoading}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reportLoading ? (
                              <FiLoader className="animate-spin" size={16} />
                            ) : (
                              <FiDownload size={16} />
                            )}
                            <span>Generate PDF</span>
                          </button>
                        </div>

                        {reportError && (
                          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                            {reportError}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
          <p className="text-xs leading-relaxed text-slate-400">
            <strong className="text-white">Disclaimer:</strong>{" "}
            This system is an academic research prototype for medical image analysis. Its results are for educational and research purposes only and should not be treated as a clinical diagnosis or treatment recommendation.
          </p>
        </div>
      </div>
    </div>
  );
}
