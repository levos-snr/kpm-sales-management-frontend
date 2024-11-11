import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: '',
    time_zone: '',
    company_name: '',
    company_code: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save company details to the database
    // ...
    navigate('/company-branding');
  };

  const InputField = ({ name, placeholder, value, onChange }) => (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700"
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Organization Details</h2>
            <p className="text-gray-600 mt-2">Tell us about your company</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
              />
              <InputField
                name="time_zone"
                placeholder="Time Zone"
                value={formData.time_zone}
                onChange={handleChange}
              />
            </div>

            <InputField
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleChange}
            />
            
            <InputField
              name="company_code"
              placeholder="Company Code"
              value={formData.company_code}
              onChange={handleChange}
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/registration')}
                className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600"
              >
                <FaLongArrowAltLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;