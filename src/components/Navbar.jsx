
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiActivity, FiMenu, FiX } from "react-icons/fi";

import navLinks from "../data/navLinks";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 shadow-lg shadow-black/10 backdrop-blur-xl">

      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* LOGO */}
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/30 transition duration-300 group-hover:scale-105">
            <FiActivity size={23} />
          </div>

          <div className="leading-tight">
            <p className="text-lg font-bold tracking-tight text-white">
              Kidney Stone
            </p>

            <p className="mt-1 text-[11px] font-medium tracking-wider text-cyan-400">
              AI DETECTION SYSTEM
            </p>
          </div>
        </NavLink>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden h-full items-center gap-1 md:flex">

          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `relative flex h-full items-center px-5 text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "text-cyan-400 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[3px] after:rounded-full after:bg-gradient-to-r after:from-blue-500 after:to-cyan-400"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-5 py-4 shadow-xl md:hidden">

          <ul className="mx-auto flex max-w-7xl flex-col gap-2">

            {navLinks.map((link) => (
              <li key={link.id}>

                <NavLink
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-400"
                        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {link.title}
                </NavLink>

              </li>
            ))}

          </ul>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
