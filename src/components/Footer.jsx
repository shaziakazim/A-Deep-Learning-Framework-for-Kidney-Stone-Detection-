import { Link } from "react-router-dom";
import { FiActivity, FiMail, FiMapPin, FiShield } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1.1fr]">

          {/* Logo / About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                <FiActivity size={22} className="text-cyan-300" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white">
                  Nephro<span className="text-cyan-400">Scan</span> AI
                </span>
                <span className="ml-2 rounded border border-cyan-500/30 bg-cyan-950/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                  FYP v2.4
                </span>
              </div>
            </div>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400">
              An advanced deep learning framework combining MobileNetV3 pre-filtering, YOLOv11 localization, and Meta SAM segmentation for automated kidney stone detection and sub-millimeter size quantification in CT scans.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <FiShield />
              <span>MobileNetV3 • YOLOv11 • Meta SAM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-400 transition hover:text-cyan-400">
                  Home Overview
                </Link>
              </li>

              <li>
                <Link to="/about" className="text-slate-400 transition hover:text-cyan-400">
                  Methodology & Stack
                </Link>
              </li>

              <li>
                <Link to="/detection" className="text-slate-400 transition hover:text-cyan-400">
                  Detection Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Highlights */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Core Technologies
            </h3>

            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>MobileNetV3 CT Gatekeeper</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span>YOLOv11 Real-Time Localization</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>Meta Segment Anything Model</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Morphometric Diameter Caliper</span>
              </li>
            </ul>
          </div>

          {/* Academic & Contact Info */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Academic Affiliation
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="mt-0.5 shrink-0 text-cyan-400" size={15} />
                <span>Department of Computer Science<br />University of Baltistan Skardu</span>
              </li>

              <li className="flex items-center gap-2.5">
                <FiMail className="shrink-0 text-cyan-400" size={15} />
                <span>cs.research@uobs.edu.pk</span>
              </li>

              <li className="flex items-center gap-2.5">
                <FiShield className="shrink-0 text-emerald-400" size={15} />
                <span className="text-slate-300">Clinical Partner: RHQ Hospital Skardu</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-4 text-center sm:flex-row sm:text-left text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} NephroScan AI Framework. Final Year Project Research Prototype.
          </p>

          <p className="text-[11px] text-slate-600">
            For academic and experimental research purposes only. Not certified as a standalone medical diagnostic device.
          </p>
        </div>
      </div>
    </footer>
  );
}
