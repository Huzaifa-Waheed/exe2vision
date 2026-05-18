import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldIcon, LogOutIcon } from "./SVGIcons";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logout } from "../api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    navigate("/");
  };

  return (
    <header className="fixed w-full z-10 backdrop-blur-sm bg-gray-900/90 border-b border-gray-800 shadow-xl">
      <div className="flex justify-between items-center px-4 py-4 md:px-10 lg:px-20">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-white font-bold text-xl">
          <ShieldIcon className="w-7 h-7 text-cyan-400" />
          <Link to="/admin-dashboard">Exe2Vision</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/admin-dashboard"
            className="text-gray-300 hover:text-cyan-400 transition-colors text-sm md:text-base flex items-center space-x-2 font-medium py-1 px-2 rounded-lg"
          >
            <span>Admin Dashboard</span>
          </Link>
          <Link
            to="/"
            className="flex items-center space-x-1.5 text-gray-300 hover:text-red-400 transition-colors text-sm md:text-base font-medium border border-gray-700 hover:border-red-500 py-1.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-700/50"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <LogOutIcon className="w-4 h-4" />
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex items-center text-gray-300 hover:text-cyan-400 p-2 rounded-md focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}

        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/95 border-t border-gray-800 shadow-lg">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            <Link
              to="/admin-dashboard"
              className="text-gray-300 hover:text-cyan-400 transition-colors text-base font-medium py-2 px-2 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/"
              className="flex items-center justify-between text-gray-300 hover:text-red-400 transition-colors text-base font-medium border border-gray-700 hover:border-red-500 py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700/50"
              onClick={() => { handleLogout(); setIsOpen(false); }}
            >
              <span>Logout</span>
              <LogOutIcon className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

