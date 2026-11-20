import { FiActivity, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.1fr]">

          {/* Logo / About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                <FiActivity size={19} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                KidneyAI
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-blue-200">
              An AI-based kidney stone analysis system that uses
              YOLOv11 and Original SAM to detect, localize, and
              visualize kidney stones in CT scan images.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-blue-200 transition hover:text-white">
                  Home
                </a>
              </li>

              

              <li>
                <a href="/aboutus" className="text-blue-200 transition hover:text-white">
                About Us
                </a>
              </li>

              <li>
                <a href="/detection" className="text-blue-200 transition hover:text-white">
                 Detection
                </a>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Our Technology
            </h3>

            <ul className="space-y-3 text-sm text-blue-200">
              <li>YOLOv11 Detection</li>
              <li>SAM Segmentation</li>
              <li>Stone Size Estimation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-center gap-3">
                <FiMail className="shrink-0 text-blue-400" size={16} />
                support@kidneydetector.com
              </li>

              <li className="flex items-center gap-3">
                <FiMapPin className="shrink-0 text-blue-400" size={16} />
                University of Baltistan Skardu
              </li>

              <li className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-blue-400" size={16} />
                +92 300 1234567
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-blue-300">
            © {new Date().getFullYear()} KidneyDetector. All Rights Reserved.
          </p>

          <p className="text-xs text-blue-400">
            Research prototype. Not a substitute for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
