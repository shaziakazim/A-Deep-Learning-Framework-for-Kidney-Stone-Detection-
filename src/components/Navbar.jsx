import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiMenu,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import navLinks from "../data/navLinks";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-xl shadow-black/40"
          : "border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand / Logo */}
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-3.5 focus:outline-none"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 transition-all duration-300 group-hover:shadow-cyan-500/40 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950 text-cyan-400">
              <FiActivity size={24} className="animate-pulse text-cyan-400 transition-transform group-hover:scale-110" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-sm" />
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Nephro<span className="text-cyan-400">Scan</span>
              </span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                AI v2.4
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400">
              Deep Learning Kidney Stone Framework
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        {/* Live System Status & Action CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">YOLOv11 + SAM</span>
            <span className="text-slate-600">•</span>
            <span className="font-semibold text-emerald-400">Active</span>
          </div>

          <NavLink
            to="/detection"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-[1px] font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center gap-2 rounded-[11px] bg-slate-950/40 px-5 py-2.5 text-sm backdrop-blur-sm transition-all group-hover:bg-transparent">
              <span>Start Analysis</span>
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </NavLink>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition-all hover:bg-slate-800 hover:text-white focus:outline-none md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="border-b border-slate-800 bg-slate-950/95 px-6 py-5 backdrop-blur-2xl md:hidden">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">Model Pipeline: Ready</span>
            </div>
            <span className="font-mono text-[11px] text-cyan-400">v2.4.0</span>
          </div>

          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <span>{link.title}</span>
                  <FiArrowRight size={16} className="text-slate-500" />
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <NavLink
              to="/detection"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25"
            >
              <span>Launch CT Detection</span>
              <FiArrowRight />
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
