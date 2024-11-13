import React, { useState } from 'react';
import { ArrowLeft, Briefcase, Upload, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrganizationCustomize = ({
  formData,
  updateFormData,
  prevStep,
  handleSubmit,
}) => {
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        updateFormData({ logo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
        <div className="space-y-8">
          {/* Back Button */}
          <button
            onClick={prevStep}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          {/* Logo */}
          <div className="text-center">
            <img
              src="/assets/react.svg"
              alt="FIELDSALE Logo"
              width="200"
              height="40"
              className="mx-auto"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold">
              Customize your Organization
            </h1>
            <p className="text-gray-500">
              Set up your organization for members that may join later.
            </p>
          </div>

          {/* Logo Upload Section */}
          <div className="space-y-6">
            <div className="mx-auto h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {logo ? (
                <img
                  src={logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Briefcase className="h-16 w-16 text-blue-500" />
              )}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 border rounded-md px-4 py-2"
                onClick={() => document.getElementById('logo-upload').click()}
              >
                <Upload className="h-4 w-4" />
                Upload Logo
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 border rounded-md px-4 py-2"
                onClick={() => setLogo(null)}
              >
                <Edit className="h-4 w-4" />
                Remove Logo
              </Button>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button
            onClick={handleFinalSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2"
          >
            Complete Registration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCustomize;