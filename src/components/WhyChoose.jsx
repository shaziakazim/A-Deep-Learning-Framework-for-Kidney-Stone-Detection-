
import {
  FiCpu,
  FiTarget,
  FiZap,
  FiActivity,
} from "react-icons/fi";

function WhyChoose() {
  const features = [
    {
      icon: <FiCpu />,
      title: "AI-Powered Detection",
      description:
        "Detect and localize kidney stones in CT scan images using the YOLOv11 deep learning model.",
    },
    {
      icon: <FiTarget />,
      title: "Precise Segmentation",
      description:
        "Original SAM generates segmentation masks using detected stone regions to visualize their boundaries.",
    },
    {
      icon: <FiZap />,
      title: "Fast Processing",
      description:
        "Process CT scan images through automated detection and segmentation for efficient image analysis.",
    },
    {
      icon: <FiActivity />,
      title: "Stone Size Estimation",
      description:
        "Estimate kidney stone size from the generated segmentation mask to support further research and analysis.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-blue-700">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-800 md:text-4xl">
            Why Choose Our AI System?
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-7 text-gray-600">
            Our kidney stone analysis system combines artificial
            intelligence and medical imaging techniques to detect,
            localize, and visualize kidney stones in CT scan images.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border border-gray-100
                bg-white
                p-5
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >
              {/* Icon */}
              <div
                className="
                  mb-5
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-600 to-cyan-400
                  text-2xl text-white
                  shadow-md
                "
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
