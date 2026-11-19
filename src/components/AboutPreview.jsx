
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function AboutPreview() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">

        {/* Left Side */}
        <div className="flex justify-center">
          <div
            className="relative flex min-h-[350px] w-full max-w-[470px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-blue-900 p-8 shadow-xl shadow-blue-900/20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          >
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold tracking-tight">
                Kidney Stone AI
              </h2>

              <p className="mt-3 text-lg text-blue-100">
                Detection & Segmentation
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {["YOLOv11", "SAM", "Size estimation"].map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div>
          <p className="mb-3 font-semibold text-blue-600">
            About Our Project
          </p>

          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            AI-Powered Kidney Stone Detection System
          </h2>

          <p className="mb-8 max-w-xl leading-8 text-slate-600">
            Our AI-based system analyzes CT scan images to detect and
            localize kidney stones using the YOLOv11 deep learning model.
            It uses Original SAM to generate segmentation masks and
            visualize stone boundaries. The system also estimates stone
            size from the segmentation results to support further
            research and image analysis.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Read More
            <FaArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default AboutPreview;
