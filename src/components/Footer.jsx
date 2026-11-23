
import { FiActivity, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.1fr]">

          {/* Logo / About */}
          <div>
            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-400">
                <FiActivity size={20} />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                KidneyAI
              </h2>

            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-300">
              An AI-based kidney stone analysis system that uses
              YOLOv11 and SAM to detect, localize, segment, and
              visualize kidney stones in CT scan images.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <a
                  href="/"
                  className="text-slate-300 transition duration-300 hover:text-cyan-400"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/aboutus"
                  className="text-slate-300 transition duration-300 hover:text-cyan-400"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="/detection"
                  className="text-slate-300 transition duration-300 hover:text-cyan-400"
                >
                  Detection
                </a>
              </li>

            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Our Technology
            </h3>

            <ul className="space-y-3 text-sm text-slate-300">

              <li className="transition hover:text-cyan-400">
                YOLOv11 Detection
              </li>

              <li className="transition hover:text-cyan-400">
                SAM Segmentation
              </li>

              <li className="transition hover:text-cyan-400">
                OpenCV Size Estimation
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm text-slate-300">

              <li className="flex items-center gap-3">
                <FiMail className="shrink-0 text-cyan-400" size={17} />
                <span>support@kidneydetector.com</span>
              </li>

              <li className="flex items-center gap-3">
                <FiMapPin className="shrink-0 text-cyan-400" size={17} />
                <span>University of Baltistan Skardu</span>
              </li>

              <li className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-cyan-400" size={17} />
                <span>+92 300 1234567</span>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-slate-950/80">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left">

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} KidneyDetector. All Rights Reserved.
          </p>

          <p className="text-xs text-slate-500">
            Research prototype. Not a substitute for medical advice.
          </p>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
