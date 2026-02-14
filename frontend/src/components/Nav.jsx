import React, { useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full border-b-2 border-white/20 bg-transparent text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left side - logo / brand */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <div className="flex h-9 w-9 items-center justify-center text-gray-100/90 rounded-md text-xl font-bold text-black shadow-emerald-500/40">
              W
            </div>
          </Link>
        </div>

        {/* Desktop - navigation links */}
        <ul className="hidden gap-8 text-[16px] md:text-[20px] font-medium text-gray-100/90 md:flex">
          <li className="cursor-pointer transition hover:text-white">
            <Link to="/updates">Updates</Link>
          </li>
          <li className="cursor-pointer transition hover:text-white">
            <Link to="/buy">How to buy CP</Link>
          </li>
          <li className="cursor-pointer transition hover:text-white">
            <Link to="/sale">Sales</Link>
          </li>
          <li className="cursor-pointer transition hover:text-white">
            <Link to="/support">Support</Link>
          </li>
          <li className="cursor-pointer transition hover:text-white">
            <Link to="/fix">Fix Problem</Link>
          </li>
          <li className="cursor-pointer transition hover:text-white">
            <Link to="/accounts">Accounts for sale</Link>
          </li>
          <li className="cursor-pointer transition hover:text-white">
            <Link to="/auth">Login / Register</Link>
          </li>
        </ul>

        {/* Mobile - hamburger on the right */}
        <div className="ml-auto flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20"
            aria-label="Open navigation"
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-4 bg-white" />
              <span className="block h-0.5 w-4 bg-white" />
              <span className="block h-0.5 w-4 bg-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu - slides in from the right */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          mobileOpen ? "visible" : "invisible"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          className="absolute inset-0 bg-black/60 transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />

        {/* Panel from right */}
        <div
          className={`absolute top-0 right-0 h-full w-[50vw] bg-black/95 border-l border-white/20 shadow-xl flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <span className="font-medium text-white">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white"
              aria-label="Close menu"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <ul className="flex flex-col gap-1 p-4 text-gray-100">
            <li>
              <Link
                to="/updates"
                className="block py-3 px-2 rounded hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Updates
              </Link>
            </li>
            <li>
              <Link
                to="/buy"
                className="block py-3 px-2 rounded hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                How to buy CP
              </Link>
            </li>
            <li>
              <Link
                to="/sale"
                className="block py-3 px-2 rounded hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Sales
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="block py-3 px-2 rounded hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                to="/fix"
                className="block py-3 px-2 rounded hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Fix Problem
              </Link>
            </li>
            <li>
              <Link
                to="/accounts"
                className="block py-3 px-2 rounded hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Accounts for sale
              </Link>
            </li>
            <li>
              <Link
                to="/auth"
                className="block py-3 px-2 rounded hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Login / Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

