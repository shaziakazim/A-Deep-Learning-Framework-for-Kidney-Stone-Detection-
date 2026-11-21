
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import { FiActivity, FiArrowRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Automated Kidney",
    p1: "Stone Detection",
    description:
      "An AI-powered framework designed to detect kidney stones from CT scan images using advanced deep learning techniques.",
    badge: "AI Powered Kidney Stone Analysis",
  },
  {
    title: "Intelligent",
    p1: "Stone Segmentation",
    description:
      "Advanced AI-based segmentation using MedSAM to identify kidney stone boundaries and generate detailed segmentation masks from CT scan images.",
    badge: "Advanced Image Segmentation",
  },
  {
    title: "Accurate",
    p1: "Stone Size Estimation",
    description:
      "Estimate kidney stone dimensions using segmentation masks and computer vision techniques to support medical image analysis.",
    badge: "Computer Vision & Measurement",
  },
];

const STONE = {
  left: 60,
  top: 35,
  width: 5.4,
  height: 7.2,
};

const ScanViewer = () => (
  <div className="relative w-full max-w-[560px]">

    {/* IMAGE GLOW */}
    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 blur-2xl" />

    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl shadow-blue-950/50">

      {/* TOP BAR */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3">
        <span className="text-xs font-semibold text-slate-200 sm:text-sm">
          CT Scan · Coronal View
        </span>

        <span className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-cyan-300">Analysis Ready</span>
        </span>
      </div>

      {/* CT IMAGE - SAME HEIGHT AS ABOUT IMAGE */}
      <div className="relative h-64 w-full bg-black sm:h-80 lg:h-[350px]">

        <img
          src="/images/a_high_resolution_medically_styled_ct_scan_image.png"
          alt="CT scan showing kidney stone"
          className="absolute inset-0 h-full w-full object-contain"
          loading="eager"
        />

        {/* BOUNDING BOX */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.65)]"
          style={{
            left: `${STONE.left}%`,
            top: `${STONE.top}%`,
            width: `${STONE.width}%`,
            height: `${STONE.height}%`,
          }}
        />

        {/* SIDE MARKERS */}
        <span className="absolute left-3 top-2 text-sm font-bold text-amber-300">
          R
        </span>

        <span className="absolute right-3 top-2 text-sm font-bold text-amber-300">
          L
        </span>

        {/* DETECTION LABEL */}
        <div className="absolute bottom-3 left-3 rounded-md border border-cyan-300/30 bg-slate-950/90 px-3 py-1.5 text-xs font-medium text-cyan-300">
          Kidney Stone Detected
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex items-center justify-between border-t border-white/10 bg-slate-900 px-4 py-3">
        <span className="text-xs text-slate-400">
          1 Stone Detected
        </span>

        <span className="text-xs font-medium text-cyan-300">
          Left Kidney
        </span>
      </div>

    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-slate-950">

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="hero-swiper h-[calc(100svh-80px)] min-h-[520px] max-h-[850px] [--swiper-pagination-bullet-inactive-color:#94a3b8] [--swiper-pagination-bullet-inactive-opacity:0.6]"
      >

        {slides.map((slide, index) => (
          <SwiperSlide key={index}>

            <div className="relative flex h-full w-full items-center overflow-hidden bg-slate-950">

              {/* BACKGROUND GRID */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
                  backgroundSize: "45px 45px",
                }}
              />

              {/* BLUE GLOW */}
              <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

              {/* CYAN GLOW */}
              <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

              {/* CENTER GLOW */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.06] blur-3xl" />

              {/* MAIN CONTENT */}
              <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 px-6 pb-8 pt-5 sm:px-10 md:grid-cols-2 md:gap-8 md:py-8 lg:gap-14 lg:px-12">

                {/* LEFT CONTENT */}
                <div className="flex flex-col items-start">

                  {/* BADGE */}
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-2 text-[11px] font-semibold text-blue-300 sm:mb-5 sm:px-4 sm:text-xs">
                    <FiActivity className="text-sm" />
                    {slide.badge}
                  </div>

                  {/* HEADING */}
                  <h1 className="max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[54px]">
                    {slide.title}

                    <span className="mt-1 block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                      {slide.p1}
                    </span>
                  </h1>

                  {/* DESCRIPTION */}
                  <p className="mt-3 max-w-xl text-xs leading-6 text-slate-300 sm:mt-5 sm:text-sm sm:leading-7 lg:text-base">
                    {slide.description}
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">

                    <button
                      onClick={() => navigate("/detection")}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-900/30 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500 sm:px-6 sm:py-3.5 sm:text-sm"
                    >
                      Start Detection
                      <FiArrowRight />
                    </button>

                    <button
                      onClick={() => navigate("/about")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-white/[0.03] px-5 py-3 text-xs font-semibold text-slate-200 transition duration-300 hover:border-cyan-400 hover:bg-cyan-400/5 hover:text-cyan-300 sm:px-6 sm:py-3.5 sm:text-sm"
                    >
                      Learn More
                    </button>

                  </div>

                  {/* TECHNOLOGY LABELS */}
                  <div className="mt-6 flex w-full flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-4 sm:mt-8 sm:gap-x-9 sm:pt-5">

                    <div>
                      <p className="text-base font-bold text-blue-400 sm:text-lg">
                        YOLOv11
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                        Detection
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-bold text-cyan-400 sm:text-lg">
                        MedSAM
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                        Segmentation
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-bold text-blue-300 sm:text-lg">
                        OpenCV
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                        Size Estimation
                      </p>
                    </div>

                  </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="relative flex w-full items-center justify-center md:pl-3 lg:pl-6">
                  <ScanViewer />
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>

      {/* SWIPER CUSTOM STYLING */}
      <style>
        {`
          .hero-swiper,
          .hero-swiper .swiper-wrapper,
          .hero-swiper .swiper-slide {
            height: 100%;
          }

          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none !important;
          }

          .hero-swiper .swiper-pagination {
            bottom: 12px !important;
          }

          .hero-swiper .swiper-pagination-bullet {
            background: #60a5fa;
          }

          .hero-swiper .swiper-pagination-bullet-active {
            background: #22d3ee;
            width: 22px;
            border-radius: 6px;
          }

          @media (max-width: 767px) {
            .hero-swiper .swiper-pagination {
              bottom: 5px !important;
            }
          }
        `}
      </style>

    </section>
  );
};

export default Hero;
