import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOutIcon, ShieldIcon } from "./SVGIcons";
import { logout } from "../api";

const HeaderLogin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-xl fixed w-full z-20 backdrop-blur-sm bg-gray-900/90">
      <div className="flex justify-between items-center px-4 py-3 sm:px-10 lg:px-20">

        {/* Logo */}
        <div className="flex items-center space-x-2 text-white font-bold text-xl">
          <ShieldIcon className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
          <Link to="/">Exe2Vision</Link>
        </div>

        {/* Hamburger Button for Mobile */}
        {!menuOpen && (
          <button
            className="sm:hidden flex items-center text-gray-300 focus:outline-none"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex sm:items-center sm:space-x-4">
          <Link
            to="/scanmalware"
            className="text-gray-300 hover:text-cyan-400 transition-colors text-sm sm:text-base flex items-center space-x-2 font-medium py-1 px-2 rounded-lg"
          >
            New Scan
          </Link>

          <Link
            to="/scanhistory"
            className="text-gray-300 hover:text-cyan-400 transition-colors text-sm sm:text-base flex items-center space-x-2 font-medium py-1 px-2 rounded-lg"
          >
            Scan History
          </Link>

          <Link
            to="/login"
            onClick={handleLogout}
            className="flex items-center justify-center space-x-1.5 text-gray-300 hover:text-red-400 transition-colors text-sm sm:text-base font-medium border border-gray-700 hover:border-red-500 py-1.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-700/50"
          >
            <span>Logout</span>
            <LogOutIcon className="w-4 h-4" />
          </Link>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 bg-gray-900/95 z-30 flex flex-col p-6">
          {/* Close Button */}
          <button
            className="self-end text-gray-300 hover:text-red-400 mb-4 focus:outline-none"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Menu Items */}
          <Link
            to="/scanmalware"
            className="text-gray-300 hover:text-cyan-400 transition-colors text-lg font-medium py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700/50"
            onClick={() => setMenuOpen(false)}
          >
            New Scan
          </Link>

          <Link
            to="/scanhistory"
            className="text-gray-300 hover:text-cyan-400 transition-colors text-lg font-medium py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700/50"
            onClick={() => setMenuOpen(false)}
          >
            Scan History
          </Link>

          <Link
            to="/login"
            className="flex items-center justify-center space-x-2 text-gray-300 hover:text-red-400 transition-colors text-lg font-medium border border-gray-700 hover:border-red-500 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700/50"
            onClick={() => { handleLogout(); setMenuOpen(false); }}
          >
            <span>Logout</span>
            <LogOutIcon className="w-5 h-5" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default HeaderLogin;
