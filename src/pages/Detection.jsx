
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

/* RESULT IMAGE COMPONENT */
const ResultImage = ({ title, image, description }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  if (!image) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-lg">

      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiImage size={18} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">{title}</h3>
            {description && (
              <p className="mt-1 text-xs text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-[220px] items-center justify-center bg-slate-50 p-4">

        {imageError ? (
          <div className="py-10 text-center text-sm text-slate-500">
            <FiImage className="mx-auto mb-2 text-2xl" />
            Unable to load this image.
          </div>
        ) : (
          <a
            href={image}
            target="_blank"
            rel="noreferrer"
            className="block w-full"
          >
            <img
              src={image}
              alt={title}
              onError={() => setImageError(true)}
              className="mx-auto max-h-[360px] w-full rounded-lg object-contain"
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
    selectFile(event.dataTransfer.files?.[0]);
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
          title: "YOLOv11 Detection Result",
          image: findImage(result, [
            "yolo_image",
            "detection_image",
            "annotated_image",
            "bbox_image",
            "result_image",
          ]),
          description: "Detection and localization output.",
        },
        {
          title: "MedSAM Segmentation Result",
          image: findImage(result, [
            "segmentation_image",
            "sam_image",
            "mask_image",
            "segmented_image",
          ]),
          description: "Kidney stone segmentation output.",
        },
        {
          title: "Stone Size Estimation",
          image: findImage(result, [
            "segmentation_size_image",
            "size_image",
            "measurement_image",
          ]),
          description: "Visual representation of the estimated stone size.",
        },
      ].filter((item) => item.image)
    : [];

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

      const outputFigures = outputs
        .map(
          (item, index) => `
            <div class="figure">
              <h3>${index + 1}. ${escapeHTML(item.title)}</h3>
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" />
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
            * { box-sizing: border-box; }

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

            .section { margin-top: 28px; }

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
              <div class="summary">Kidney CT image detected.</div>
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

            <section class="section">
              <h2>Original CT Scan Image</h2>
              <img class="original-image" src="${originalImage}" alt="Original CT scan" />
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
                MedSAM is used to generate a segmentation mask for the detected region.

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
    <section className="relative overflow-hidden bg-white px-4 py-16 text-slate-900 sm:px-6 lg:px-8 lg:py-20">

      {/* SUBTLE BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* SECTION HEADER */}
        <div className="mx-auto mb-12 max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
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
            {["YOLOv11", "MedSAM", "OpenCV", "Deep Learning"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>

        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">

          {/* UPLOAD SECTION */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

              <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
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
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
                    }`}
                  >

                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <FiUploadCloud size={30} />
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      Drag and drop your CT image
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      or click below to browse files
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700">
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
                        <FiImage className="text-blue-600" />
                        Uploaded Image
                      </div>

                      <button
                        onClick={clearImage}
                        type="button"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
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

                {/* ERROR MESSAGE */}
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
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-md shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
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
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <FiRefreshCw size={16} />
                    Reset Image
                  </button>
                )}

                {/* IMAGE FILTERING INFO */}
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
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

          {/* RESULTS SECTION */}
          <div className="lg:col-span-7">

            <div className="min-h-[420px] rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 sm:p-6">

              <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
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

                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
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

              {/* RESULTS */}
              {result && !loading && (

                <div className="space-y-6">

                  {/* FILTER STATUS */}
                  <div
                    className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${
                      rejected
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >

                    {rejected ? (
                      <FiAlertCircle size={21} className="shrink-0" />
                    ) : (
                      <FiCheckCircle size={21} className="shrink-0" />
                    )}

                    <span>
                      {rejected
                        ? "Image did not pass Kidney CT Filtering"
                        : "Kidney CT image detected."}
                    </span>

                  </div>

                  {/* REJECTED IMAGE */}
                  {rejected && (

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                      <h3 className="font-semibold text-red-700">
                        Image Not Accepted
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Please upload a supported kidney CT scan image to
                        continue the analysis.
                      </p>

                    </div>
                  )}

                  {/* ACCEPTED IMAGE */}
                  {!rejected && (

                    <>

                      {/* NO STONE */}
                      {noStone && (

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

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

                      {/* OUTPUT IMAGES */}
                      {outputs.length > 0 && (

                        <div>

                          <div className="mb-4">
                            <h3 className="font-bold text-slate-900">
                              Processing Output
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Visual results generated by the detection pipeline.
                            </p>
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

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                          The image passed the kidney CT filter, but no
                          output images were returned by the backend.
                          Please check the backend response.
                        </div>

                      )}

                      {/* PDF REPORT */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-start gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                              <FiFileText size={21} />
                            </div>

                            <div>
                              <h3 className="font-bold text-slate-900">
                                Detection Report
                              </h3>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                Generate a PDF report containing the uploaded
                                image and available processing results.
                              </p>
                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={generatePDFReport}
                            disabled={reportLoading}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >

                            {reportLoading ? (
                              <FiLoader className="animate-spin" size={17} />
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

                    </>
                  )}

                </div>
              )}

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
