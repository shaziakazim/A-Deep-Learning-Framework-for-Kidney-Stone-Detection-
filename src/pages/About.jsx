
import React from "react";
import {
  FiActivity,
  FiTarget,
  FiLayers,
  FiCpu,
  FiShield,
  FiDatabase,
  FiUsers,
  FiCheckCircle,
  FiArrowUpRight,
  FiSearch,
  FiMaximize,
  FiEye,
  FiTrendingUp,
  FiHeart,
} from "react-icons/fi";

const images = {
  ctScan:
    "https://bookmerilab.com/blog/wp-content/uploads/2018/02/CT-KUB-Kidney-Stone-Image-min-1024x533.jpg",
  kidney:
    "https://www.hakkiperk.com/view/uploads/icerik/67e70a6b7a6a6174319473189.jpg",
};

const projectHighlights = [
  {
    icon: FiTarget,
    title: "Kidney Stone Detection",
    description:
      "YOLOv11 identifies and localizes suspected kidney stones in CT scan images.",
  },
  {
    icon: FiLayers,
    title: "AI-Based Segmentation",
    description:
      "SAM generates segmentation masks for detected kidney stones.",
  },
  {
    icon: FiMaximize,
    title: "Stone Size Estimation",
    description:
      "Estimates stone dimensions using the longest Feret diameter and mask area.",
  },
  {
    icon: FiActivity,
    title: "Integrated Analysis",
    description:
      "Combines detection, segmentation, and measurement in one analysis platform.",
  },
];

const technologies = [
  {
    name: "YOLOv11",
    category: "Object Detection",
    description: "Kidney stone detection and localization.",
  },
  {
    name: "MobileNetV3-Large",
    category: "Image Verification",
    description: "Initial CT image verification in the diagnostic pipeline.",
  },
  {
    name: "Segment Anything Model",
    category: "Image Segmentation",
    description: "Generates segmentation masks for detected stones.",
  },
  {
    name: "React.js",
    category: "Frontend",
    description: "Builds the interactive user interface.",
  },
  {
    name: "Tailwind CSS",
    category: "UI Design",
    description: "Provides responsive layouts and consistent styling.",
  },
  {
    name: "Flask",
    category: "Backend",
    description: "Connects the frontend with the trained AI models.",
  },
];

const futureWork = [
  {
    number: "01",
    icon: FiDatabase,
    title: "Expand the Local Dataset",
    description:
      "Collect CT scans from more patients and multiple hospitals to improve dataset diversity and support better generalization.",
  },
  {
    number: "02",
    icon: FiUsers,
    title: "Patient-Level Dataset Splitting",
    description:
      "Organize training, validation, and testing datasets at patient level to prevent images from the same patient appearing across different splits.",
  },
  {
    number: "03",
    icon: FiShield,
    title: "Radiologist Validation",
    description:
      "Involve radiologists in reviewing model detections and annotations to improve the reliability of system outputs.",
  },
  {
    number: "04",
    icon: FiSearch,
    title: "Improve Segmentation Accuracy",
    description:
      "Compare SAM and MedSAM using expert-prepared masks and evaluation metrics such as Dice Similarity Coefficient and Intersection over Union.",
  },
  {
    number: "05",
    icon: FiMaximize,
    title: "Accurate Stone Size Measurement",
    description:
      "Use actual CT pixel-spacing metadata instead of an assumed pixel scale and compare estimated measurements with radiologist references.",
  },
  {
    number: "06",
    icon: FiEye,
    title: "Improve Annotation Quality",
    description:
      "Review and refine manually created bounding-box annotations to reduce differences in label placement.",
  },
];

const limitations = [
  { value: "57", label: "Local Patients" },
  { value: "57", label: "Original Stone Images" },
  { value: "20", label: "Normal Images" },
  { value: "Manual", label: "Bounding-Box Annotations" },
];

const technologiesOverview = [
  {
    icon: FiTarget,
    title: "Detection",
    description: "YOLOv11",
  },
  {
    icon: FiLayers,
    title: "Segmentation",
    description: "SAM",
  },
  {
    icon: FiMaximize,
    title: "Measurement",
    description: "Stone Dimensions",
  },
];

const About = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 sm:px-10 md:grid-cols-2 lg:px-12 lg:py-16">

          {/* HERO CONTENT */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-300">
              <FiActivity />
              About Our Project
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              AI-Powered
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Kidney Stone Analysis
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              An intelligent system designed to detect, localize, segment, and
              estimate kidney stone dimensions from CT scan images using deep
              learning and computer vision.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#overview"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Explore Project
                <FiArrowUpRight />
              </a>

              <a
                href="#future-work"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Future Work
                <FiTrendingUp />
              </a>
            </div>

            {/* TECHNOLOGY LABELS */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["YOLOv11", "SAM", "Deep Learning", "Computer Vision"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl">
              <img
                src="images\Stone_frame_0040.png"
                alt="Illustrative kidney CT scan showing kidney stones"
                className="h-64 w-full object-cover sm:h-80 lg:h-[350px]"
                loading="eager"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="rounded-full border border-cyan-300/30 bg-cyan-400/15 px-3 py-1.5 text-xs font-semibold text-cyan-200">
                  CT Image Analysis
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">
                  Intelligent Kidney Stone Detection
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Deep learning-based image analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT OVERVIEW */}
      <section id="overview" className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:px-12">

          {/* OVERVIEW IMAGE */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-50 blur-xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-xl">
              <img
                src={images.kidney}
                alt="Illustration of kidney anatomy and kidney stones"
                className="h-72 w-full rounded-2xl object-cover sm:h-96"
                loading="lazy"
              />

              <div className="absolute bottom-6 left-6 rounded-xl border border-white/20 bg-slate-950/90 px-4 py-3 text-white shadow-lg backdrop-blur">
                <p className="text-xs text-slate-400">
                  Research Focus
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Kidney Stone Analysis
                </p>
              </div>
            </div>
          </div>

          {/* OVERVIEW TEXT */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              <FiActivity />
              Project Overview
            </div>

            <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              A Deep Learning Framework for Kidney Stone Analysis
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              Kidney stones are a common urinary tract condition that require
              accurate examination for appropriate clinical assessment. This
              project explores artificial intelligence and deep learning to
              support kidney stone analysis in CT scan images.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              The proposed system integrates YOLOv11 for stone detection and
              localization, while the Segment Anything Model generates
              segmentation masks. These masks are then used to estimate stone
              dimensions.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              The platform brings these analysis capabilities together in an
              integrated interface. It is a research and decision-support
              prototype, not a replacement for professional medical diagnosis.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {technologiesOverview.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <Icon className="text-xl text-blue-600" />
                    <h4 className="mt-3 text-sm font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT HIGHLIGHTS */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
              <FiLayers />
              Core Capabilities
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Project Highlights
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              The main capabilities developed as part of the kidney stone
              analysis framework.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projectHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon />
                  </div>

                  <h3 className="text-base font-bold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY STACK */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              <FiCpu />
              Technologies
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Technologies Behind the Project
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Deep learning models and modern web technologies used to develop
              the analysis platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {tech.category}
                  </span>

                  <FiCheckCircle className="text-lg text-blue-600" />
                </div>

                <h3 className="text-lg font-bold text-slate-950">
                  {tech.name}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUTURE WORK */}
      <section
        id="future-work"
        className="relative overflow-hidden bg-slate-950 py-16 text-white lg:py-20"
      >
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-300">
              <FiTrendingUp />
              Research Directions
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Limitations & Future Work
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              The current research provides a foundation for AI-based kidney
              stone analysis. The following areas have been identified for
              further improvement.
            </p>
          </div>

          {/* DATASET LIMITATIONS */}
          <div className="mb-14">
            <h3 className="mb-6 text-xl font-bold text-white">
              Identified Dataset Limitations
            </h3>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {limitations.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-center"
                >
                  <p className="text-3xl font-bold text-blue-300 sm:text-4xl">
                    {item.value}
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-400 sm:text-sm">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              The local dataset was collected from a single hospital and
              contains a limited number of original patient images. Data
              augmentation increases the number of training samples but does
              not introduce new patient information.
            </p>
          </div>

          {/* FUTURE WORK CARDS */}
          <div className="mb-14">
            <h3 className="mb-7 text-xl font-bold text-white">
              Recommended Future Improvements
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {futureWork.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:border-blue-400/40 hover:bg-white/[0.07]"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-xl text-blue-300 transition group-hover:bg-blue-500 group-hover:text-white">
                        <Icon />
                      </div>

                      <span className="text-sm font-bold tracking-widest text-blue-400">
                        {item.number}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white">
                      {item.title}
                    </h4>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LONG-TERM VISION */}
          <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-600/15 to-cyan-500/10 p-7 sm:p-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl text-blue-300">
                <FiHeart />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Long-Term Research Vision
                </h3>

                <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
                  The long-term goal is to develop a more reliable and
                  thoroughly validated AI-based kidney stone analysis
                  framework through larger and more diverse datasets,
                  improved segmentation evaluation, accurate image
                  measurements, and collaboration with medical experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-7 text-center">
        <p className="text-sm font-semibold text-slate-300">
          Kidney Stone Detection & Analysis System
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Final Year Project | Artificial Intelligence & Deep Learning
        </p>
      </footer>
    </div>
  );
};

export default About;
