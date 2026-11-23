
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
  FiMaximize,
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

/* RESULT IMAGE CARD */
const ResultImage = ({ title, image, description, number }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  if (!image) return null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <FiImage size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <span className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          {number}
        </span>
      </div>

      {/* IMAGE PREVIEW */}
      <div className="relative flex min-h-[230px] items-center justify-center bg-slate-100 p-3 sm:min-h-[270px] sm:p-5">
        {imageError ? (
          <div className="py-10 text-center text-sm text-slate-500">
            <FiImage className="mx-auto mb-2 text-2xl" />
            Unable to load this image.
          </div>
        ) : (
          <>
            <a
              href={image}
              target="_blank"
              rel="noreferrer"
              className="block w-full cursor-zoom-in"
              title="Open full image"
            >
              <img
                src={image}
                alt={title}
                onError={() => setImageError(true)}
                className="mx-auto max-h-[350px] w-full rounded-lg object-contain"
              />
            </a>

            <div className="pointer-events-none absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-700 shadow-sm">
              <FiMaximize size={15} />
            </div>
          </>
        )}
      </div>

      {/* CARD FOOTER */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
        <p className="text-xs leading-5 text-slate-500">
          {description}
        </p>
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

  /* FILE SELECTION */
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
    selectFile(event.dataTransfer.files?.[0]);
  };

  /* DETECTION API */
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

  /* RESET */
  const clearImage = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    setReportError("");
  };

  /* RESULT STATUS */
  const rejected = result?.accepted === false;

  const noStone =
    !rejected &&
    (result?.detected === false ||
      result?.stone_detected === false ||
      result?.no_stone_detected === true ||
      result?.status === "no_detection");

  /* RESULT IMAGES */
  const outputs = result
    ? [
        {
          title: "YOLOv11 Detection",
          image: findImage(result, [
            "yolo_image",
            "detection_image",
            "annotated_image",
            "bbox_image",
            "result_image",
          ]),
          description: "Stone detection and bounding-box localization.",
        },
        {
          title: "Segmentation",
          image: findImage(result, [
            "segmentation_image",
            "sam_image",
            "mask_image",
            "segmented_image",
          ]),
          description: "Segmented kidney stone mask.",
        },
        {
          title: "Stone Size Estimation",
          image: findImage(result, [
            "segmentation_size_image",
            "size_image",
            "measurement_image",
          ]),
          description: "Visual representation of estimated stone dimensions.",
        },
      ].filter((item) => item.image)
    : [];

  /* SIZE ESTIMATE */
  const getSizeEstimate = () => {
    if (!result) return "Not available";

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

  /* PDF REPORT */
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

      const reportStatus = noStone
        ? "No Stone Detected"
        : "Kidney CT Image Processed";

      const outputFigures = outputs
        .map(
          (item, index) => `
            <div class="figure">
              <div class="figure-heading">
                <span class="figure-number">${index + 1}</span>
                <h3>${escapeHTML(item.title)}</h3>
              </div>

              <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.title)}"
              />

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
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Kidney Stone Detection Report</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              background: #f8fafc;
              color: #1e293b;
              font-family: Arial, Helvetica, sans-serif;
            }

            .report {
              max-width: 850px;
              margin: auto;
              padding: 42px;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
            }

            .header {
              padding-bottom: 24px;
              border-bottom: 3px solid #0f172a;
            }

            .brand {
              margin-bottom: 12px;
              color: #475569;
              font-size: 10px;
              font-weight: bold;
              letter-spacing: 2px;
              text-transform: uppercase;
            }

            .header h1 {
              margin: 0;
              color: #0f172a;
              font-size: 27px;
              line-height: 1.3;
            }

            .header p {
              margin: 8px 0 0;
              color: #64748b;
              font-size: 13px;
              line-height: 1.6;
            }

            .section {
              margin-top: 30px;
            }

            .section h2 {
              margin: 0 0 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #e2e8f0;
              color: #0f172a;
              font-size: 17px;
            }

            .summary {
              padding: 17px 18px;
              border: 1px solid #cbd5e1;
              border-left: 4px solid #0f172a;
              border-radius: 7px;
              background: #f1f5f9;
              color: #0f172a;
              font-size: 14px;
              font-weight: bold;
            }

            .summary p {
              margin: 7px 0 0;
              color: #64748b;
              font-size: 12px;
              font-weight: normal;
              line-height: 1.6;
            }

            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }

            .detail {
              padding: 14px;
              border: 1px solid #e2e8f0;
              border-radius: 7px;
              background: #ffffff;
            }

            .detail span {
              display: block;
              margin-bottom: 7px;
              color: #64748b;
              font-size: 11px;
            }

            .detail strong {
              color: #0f172a;
              font-size: 13px;
              overflow-wrap: anywhere;
            }

            .original-image {
              display: block;
              width: 100%;
              max-height: 430px;
              margin: 14px auto;
              object-fit: contain;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              background: #f8fafc;
            }

            .figure {
              margin: 20px 0 26px;
              padding: 15px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              page-break-inside: avoid;
            }

            .figure-heading {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
            }

            .figure-number {
              display: inline-flex;
              width: 27px;
              height: 27px;
              align-items: center;
              justify-content: center;
              border-radius: 6px;
              background: #0f172a;
              color: #ffffff;
              font-size: 12px;
              font-weight: bold;
            }

            .figure h3 {
              margin: 0;
              color: #0f172a;
              font-size: 14px;
            }

            .figure img {
              display: block;
              width: 100%;
              max-height: 420px;
              margin: 0 auto;
              object-fit: contain;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              background: #f8fafc;
            }

            .figure p {
              margin: 10px 0 0;
              color: #64748b;
              font-size: 12px;
              line-height: 1.6;
            }

            .note {
              padding: 16px;
              border: 1px solid #e2e8f0;
              border-left: 4px solid #334155;
              border-radius: 6px;
              background: #f8fafc;
              color: #475569;
              font-size: 12px;
              line-height: 1.8;
            }

            .note strong {
              color: #0f172a;
            }

            .footer {
              margin-top: 38px;
              padding-top: 17px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 11px;
              line-height: 1.8;
              text-align: center;
            }

            @media print {
              @page {
                size: A4;
                margin: 14mm;
              }

              body {
                padding: 0;
                background: #ffffff;
              }

              .report {
                max-width: none;
                padding: 10px;
                border: none;
                box-shadow: none;
              }

              .section,
              .figure {
                page-break-inside: avoid;
              }

              .figure img,
              .original-image {
                max-height: 350px;
              }
            }
          </style>
        </head>

        <body>
          <main class="report">

            <header class="header">
              <div class="brand">
                Kidney Stone Detection & Analysis System
              </div>

              <h1>Kidney Stone Detection Report</h1>

              <p>
                AI-Based Kidney CT Image Analysis System
              </p>
            </header>

            <section class="section">
              <h2>Analysis Summary</h2>

              <div class="summary">
                ${escapeHTML(reportStatus)}

                <p>
                  ${
                    noStone
                      ? "The uploaded image passed the image filtering stage, but the detection model did not report a kidney stone."
                      : "The uploaded image passed the image filtering stage and was processed by the available analysis pipeline."
                  }
                </p>
              </div>
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
                The image filtering stage checks whether the uploaded image
                belongs to the supported kidney CT image category.

                <br /><br />

                <strong>Detection:</strong>
                YOLOv11 is used for kidney stone detection and localization.

                <br /><br />

                <strong>Segmentation:</strong>
                SAM is used to generate a segmentation mask for the detected region.

                <br /><br />

                <strong>Size Estimation:</strong>
                OpenCV is used for image-based stone size estimation.
                The report displays the estimate returned by the backend, when available.
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
              Kidney Stone Detection & Analysis System<br />
              Final Year Project | Artificial Intelligence & Deep Learning
            </footer>

          </main>

          <script>
            window.onload = function () {
              const images = Array.from(document.images);

              Promise.all(
                images.map((img) => {
                  if (img.complete) return Promise.resolve();

                  return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                  });
                })
              ).then(() => {
                setTimeout(() => window.print(), 500);
              });
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

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 text-slate-900 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* SECTION HEADER */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700">
            <FiActivity />
            AI-Powered Analysis
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Kidney Stone Detection
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Upload a kidney CT scan image to detect, segment and estimate
            kidney stone dimensions using deep learning and computer vision.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["YOLOv11", "SAM", "OpenCV", "Deep Learning"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">

          {/* UPLOAD PANEL */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

              <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <FiUploadCloud size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Upload CT Scan
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Select an image for analysis
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
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
                    className={`flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-8 text-center transition duration-300 ${
                      dragging
                        ? "border-slate-900 bg-slate-100"
                        : "border-slate-300 bg-slate-50 hover:border-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <FiUploadCloud size={30} />
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      Drag and drop your CT image
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      or click below to browse files
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800">
                      <FiImage size={17} />
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
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <FiImage className="text-slate-700" />
                        Uploaded Image
                      </div>

                      <button
                        onClick={clearImage}
                        type="button"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
                        title="Remove image"
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <img
                        src={preview}
                        alt="Uploaded CT scan"
                        className="max-h-[350px] w-full rounded-lg object-contain"
                      />
                    </div>

                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="break-all text-sm font-medium text-slate-800">
                        {file?.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {file
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                          : ""}
                      </p>
                    </div>
                  </div>
                )}

                {/* ERROR */}
                {error && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FiAlertCircle className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* DETECTION BUTTON */}
                <button
                  type="button"
                  onClick={handleDetection}
                  disabled={!file || loading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={19} />
                      Processing Image...
                    </>
                  ) : (
                    <>
                      <FiActivity size={19} />
                      Start Detection
                    </>
                  )}
                </button>

                {file && !loading && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <FiRefreshCw size={16} />
                    Reset Image
                  </button>
                )}

                {/* IMAGE FILTERING INFO */}
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <FiShield size={19} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Image Filtering
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        The uploaded image is checked before the detection
                        and segmentation stages are performed.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="lg:col-span-7">
            <div className="min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

              {/* RESULTS HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <FiActivity size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Detection Results
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      AI image processing and analysis output
                    </p>
                  </div>
                </div>

                {result && !loading && (
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    Analysis Complete
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6">

                {/* EMPTY STATE */}
                {!result && !loading && (
                  <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
                      <FiImage size={34} />
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      No Results Available
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Upload a kidney CT image and click Start Detection to
                      view the processing results here.
                    </p>
                  </div>
                )}

                {/* LOADING STATE */}
                {loading && (
                  <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-800">
                      <FiLoader className="animate-spin" size={30} />
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      Processing Your Image
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Please wait while the image filtering, detection and
                      segmentation pipeline processes your image.
                    </p>
                  </div>
                )}

                {/* RESULT CONTENT */}
                {result && !loading && (
                  <div className="space-y-6">

                    {/* STATUS */}
                    <div
                      className={`flex items-center gap-3 rounded-xl border p-4 ${
                        rejected
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-slate-200 bg-slate-50 text-slate-800"
                      }`}
                    >
                      {rejected ? (
                        <FiAlertCircle size={21} className="shrink-0" />
                      ) : (
                        <FiCheckCircle size={21} className="shrink-0" />
                      )}

                      <div>
                        <p className="text-sm font-bold">
                          {rejected
                            ? "Image Not Accepted"
                            : "Kidney CT Image Processed"}
                        </p>

                        <p className="mt-1 text-xs leading-5 opacity-80">
                          {rejected
                            ? "The uploaded image did not pass the image filtering stage."
                            : "The uploaded image passed the image filtering stage."}
                        </p>
                      </div>
                    </div>

                    {/* REJECTED IMAGE */}
                    {rejected && (
                      <div className="rounded-xl border border-red-200 bg-white p-5">
                        <h3 className="font-semibold text-red-700">
                          Image Not Accepted
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Please upload a supported kidney CT scan image to
                          continue the analysis.
                        </p>
                      </div>
                    )}

                    {!rejected && (
                      <>
                        {/* NO STONE */}
                        {noStone && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                            <div className="flex items-start gap-3">
                              <FiAlertCircle className="mt-0.5 shrink-0 text-amber-600" />

                              <div>
                                <h3 className="font-semibold text-amber-800">
                                  No Stone Detected
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                  The image passed the kidney CT filter, but
                                  the detection model did not report a stone
                                  detection for this image.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* OUTPUT SECTION */}
                        {outputs.length > 0 && (
                          <div>
                            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                              <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                  Processing Output
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  Results generated by the AI analysis pipeline.
                                </p>
                              </div>

                              <span className="w-fit rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                {outputs.length} Output
                                {outputs.length !== 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                              {outputs.map((item, index) => (
                                <div
                                  key={item.title}
                                  className={
                                    outputs.length === 3 && index === 2
                                      ? "md:col-span-2"
                                      : ""
                                  }
                                >
                                  <ResultImage
                                    number={String(index + 1).padStart(2, "0")}
                                    title={item.title}
                                    image={item.image}
                                    description={item.description}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* NO OUTPUT IMAGES */}
                        {outputs.length === 0 && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-6 text-amber-800">
                            The image passed the kidney CT filter, but no
                            output images were returned by the backend.
                            Please check the backend response.
                          </div>
                        )}

                        {/* REPORT DETAILS */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200">
                          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                              <FiFileText size={21} />
                            </div>

                            <div>
                              <h3 className="font-bold text-slate-900">
                                Detection Report
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                Summary of your image analysis.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-medium text-slate-500">
                                Processing Status
                              </p>

                              <p className="mt-2 text-sm font-bold text-slate-900">
                                {noStone
                                  ? "No Stone Detected"
                                  : "Image Processed"}
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-medium text-slate-500">
                                Estimated Stone Size
                              </p>

                              <p className="mt-2 break-words text-sm font-bold text-slate-900">
                                {noStone ? "Not available" : getSizeEstimate()}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-slate-200 p-4 sm:p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  Export Analysis Report
                                </h4>

                                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                                  Generate a printable PDF report with the
                                  original CT image and available processing
                                  results.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={generatePDFReport}
                                disabled={reportLoading}
                                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {reportLoading ? (
                                  <FiLoader
                                    className="animate-spin"
                                    size={17}
                                  />
                                ) : (
                                  <FiDownload size={17} />
                                )}

                                Generate PDF
                              </button>
                            </div>

                            {reportError && (
                              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {reportError}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs leading-6 text-slate-600">
            <strong className="text-slate-800">Disclaimer:</strong>{" "}
            This system is an academic research prototype for medical image
            analysis. Its results are for educational and research purposes
            only and should not be treated as a clinical diagnosis or
            treatment recommendation.
          </p>
        </div>
      </div>
    </section>
  );
}
