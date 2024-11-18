import React, { useState } from 'react';
import {
  AiOutlineDashboard,
  AiOutlineTeam,
  AiOutlineShopping,
  AiOutlineCustomerService,
  AiOutlineBarChart,
  AiOutlineMessage,
  AiOutlineCheckSquare,
  AiOutlineClockCircle,
  AiOutlineEnvironment,
  AiOutlineSetting,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
} from 'react-icons/ai';

const Sidebar = () => {
  const [active, setActive] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: <AiOutlineDashboard /> },
    { name: 'Team', icon: <AiOutlineTeam /> },
    { name: 'Products', icon: <AiOutlineShopping /> },
    { name: 'Customer', icon: <AiOutlineCustomerService /> },
    { name: 'Reports', icon: <AiOutlineBarChart /> },
    { name: 'Messages', icon: <AiOutlineMessage /> },
    { name: 'Tasks', icon: <AiOutlineCheckSquare /> },
    { name: 'Attendance', icon: <AiOutlineClockCircle /> },
    { name: 'Locations', icon: <AiOutlineEnvironment /> },
    { name: 'Settings', icon: <AiOutlineSetting /> },
    { name: 'Support', icon: <AiOutlineQuestionCircle /> },
  ];

  return (
    <div className="flex flex-col h-screen w-72 bg-white text-gray-900 shadow-xl">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center h-24 bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-4xl font-bold">F</span>
          <span className="text-4xl font-bold">S</span>
        </div>
        <h1 className="text-xl font-semibold tracking-wide">Fieldsale</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6 py-4 overflow-y-auto space-y-2">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out group ${
              active === item.name
                ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-bold'
                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100'
            }`}
          >
            <span
              className={`text-xl transition-transform transform group-hover:scale-110 ${active === item.name ? 'text-blue-700' : 'text-blue-600'}`}
            >
              {item.icon}
            </span>
            <a href="#" className="text-lg">
              {item.name}
            </a>
          </div>
        ))}
      </nav>

      {/* Sign Out Section */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer group hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition duration-200 ease-in-out">
          <span className="text-red-500 text-xl group-hover:scale-110 transition-transform">
            <AiOutlineLogout />
          </span>
          <a
            href="#"
            className="text-red-500 font-medium text-lg group-hover:font-bold group-hover:text-red-600 transition-colors duration-150"
          >
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
