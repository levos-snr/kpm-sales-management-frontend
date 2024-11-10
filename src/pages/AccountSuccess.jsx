import React from "react";

const AccountSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white space-y-8">
      {/* Logo and Fieldsale text at the top */}
      <div className="absolute top-8 flex flex-col items-center mb-16">
        <div className="flex items-center text-5xl font-extrabold space-x-1">
          <span className="tracking-wider text-blue-200">F</span>
          <span className="tracking-wide text-blue-400">S</span>
        </div>
        <span className="text-lg uppercase font-semibold tracking-wider">FIELDSALE</span>
      </div>

      {/* Success message in the center */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-blue-100 rounded-full p-4">
          <svg
            className="w-16 h-16 text-blue-500 transform transition-all duration-500 ease-in-out scale-90 hover:scale-100"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12 22a10 10 0 100-20 10 10 0 000 20zm5.707-13.707a1 1 0 10-1.414-1.414l-5.586 5.586-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l6-6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">Account created successfully!</h1>
        <p className="text-gray-200">
          Welcome aboard! Start your success journey with FIELDSALE
        </p>
      </div>

      {/* Button at the bottom */}
      <button
        className="mt-auto mb-8 bg-blue-500 text-white px-6 py-2 rounded-md transform transition-all duration-300 ease-in-out hover:bg-blue-400 hover:scale-105"
      >
         Let&apos;s Start!
      </button>
    </div>
  );
};

export default AccountSuccess;
