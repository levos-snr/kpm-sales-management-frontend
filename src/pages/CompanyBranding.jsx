import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft, FaCloudUploadAlt, FaPencilAlt } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";

const CompanyBranding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Save company branding details to the database
    // ...
    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleLogoUpload = async (e) => {
    // Handle logo upload logic
    // ...
    setLogoUrl(e.target.files[0].name);
  };

  const handleLogoEdit = () => {
    // Handle logo editing logic
    // ...
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Company Branding</h2>
            <p className="text-gray-600 mt-2">Add your company's visual identity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-40 h-40 rounded-full border-3 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 group hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                {logoUrl ? (
                  <img src={`/api/placeholder/400/320`} alt="Company Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="text-center">
                    <IoCloudUploadOutline className="w-8 h-8 mx-auto text-gray-400 group-hover:text-gray-500" />
                    <span className="mt-2 block text-sm text-gray-500">Drop your logo here</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <label
                  htmlFor="logo-upload"
                  className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <FaCloudUploadAlt className="w-4 h-4 mr-2" />
                  Upload Logo
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleLogoEdit}
                  className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaPencilAlt className="w-4 h-4 mr-2" />
                  Edit Logo
                </button>
              </div>

              <div className="flex justify-between w-full">
                <button
                  type="button"
                  onClick={() => navigate('/company-details')}
                  className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                >
                  <FaLongArrowAltLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyBranding;