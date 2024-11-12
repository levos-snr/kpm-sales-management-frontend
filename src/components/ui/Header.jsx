// Header.js
import React from 'react';
import { AiOutlineBell, AiOutlineSearch } from 'react-icons/ai';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-white shadow-lg rounded-xl">
      {/* Logo or App Title */}
      <div className="text-xl font-semibold text-gray-900">
        Fieldsale
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-1/3 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
        <AiOutlineSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Notification and Profile */}
      <div className="flex items-center space-x-6">
        <AiOutlineBell className="text-gray-600 text-2xl cursor-pointer transition-all duration-200 hover:text-blue-500" />
        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src="path/to/profile-image.jpg" // replace with dynamic image source
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-gray-300"
          />
          <span className="text-gray-700 font-medium text-sm">User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
