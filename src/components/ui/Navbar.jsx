// Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Navbar Links */}
      <ul className="flex space-x-6">
        <li>
          <a href="#" className="text-gray-700 font-medium">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 font-medium">
            Settings
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 font-medium">
            Reports
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
