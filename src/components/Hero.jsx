import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { FiActivity, FiArrowRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    title: "Automated Kidney Stone Detection",
    description:
      "An AI-powered framework designed to detect kidney stones from CT scan images using advanced deep learning techniques.",
  },
  {
    title: "Automated Kidney Stone Detection",
    description:
      "Automatically identify and locate kidney stones in CT scan images with an intelligent detection system.",
  },
  {
    title: "Stone Segmentation & Size Estimation",
    description:
      "Precisely segment detected kidney stones and estimate their size to support better medical analysis.",
  },
];

/* Stone position inside the image, in % of the image (1536 x 1024).
   If you change the image, adjust these 4 numbers. */
const STONE = { left: 62, top: 30.9, width: 5.4, height: 7.2 };

const ScanViewer = () => (
  <div className="relative w-full max-w-[560px]">
    {/* soft glow behind the viewer */}
    <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-2xl" />

    <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl shadow-blue-950/50">
      {/* viewer top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-400">
        <span className="font-medium text-slate-300">CT Scan · Coronal view</span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Analysis ready
        </span>
      </div>

      {/* scan area: same ratio as the image so the box always lands on the stone */}
      <div className="relative aspect-[3/2] w-full">
        <img
          src="/images/kidney.png"
          alt="Abdominal CT scan with a kidney stone highlighted"
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* bounding box on the stone */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
          style={{
            left: `${STONE.left}%`,
            top: `${STONE.top}%`,
            width: `${STONE.width}%`,
            height: `${STONE.height}%`,
          }}
        />

        {/* side markers */}
        <span className="absolute left-3 top-2 text-sm font-semibold text-amber-300">R</span>
        <span className="absolute right-3 top-2 text-sm font-semibold text-amber-300">L</span>
      </div>

      {/* viewer bottom bar */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-400">
        <span>1 stone detected</span>
        <span>Left kidney</span>
      </div>
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-slate-900">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="hero-swiper h-[560px] [--swiper-theme-color:#ffffff] [--swiper-navigation-size:20px] [--swiper-pagination-bullet-inactive-color:#cbd5e1] [--swiper-pagination-bullet-inactive-opacity:0.6]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[560px] overflow-hidden bg-slate-900">
              {/* Background Grid */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                  backgroundSize: "45px 45px",
                }}
              />

              {/* Background Glow */}
              <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-8 px-8 md:grid-cols-2 lg:px-16">
                {/* Left Content */}
                <div className="z-10 py-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200">
                    <FiActivity className="text-blue-300" />
                    AI Powered Kidney Stone Analysis
                  </div>

                  <h1 className="mb-5 max-w-xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                    {slide.title}
                  </h1>

                  <p className="mb-7 max-w-lg text-sm leading-7 text-slate-300 md:text-base">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => navigate("/detection")}
                      className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-blue-100"
                    >
                      Start Detection
                      <FiArrowRight />
                    </button>

                    <button
                      onClick={() => navigate("/about")}
                      className="rounded-lg border border-slate-500 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Right Side: CT viewer */}
                <div className="relative hidden items-center justify-center md:flex">
                  <ScanViewer />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
