import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchCompanies } from '../api/companies';

const CompanyDetails = ({ formData, updateFormData, nextStep, prevStep }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch companies
  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCompanySelect = (companyId) => {
    const selectedCompany = companies.find(
      (company) => company.id === parseInt(companyId)
    );
    if (selectedCompany) {
      updateFormData({
        company_id: selectedCompany.id,
        company_name: selectedCompany.company_name,
        company_code: selectedCompany.company_code,
        registration_number: selectedCompany.registration_number,
        county: selectedCompany.county,
        time_zone: selectedCompany.time_zone,
        address: selectedCompany.address,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    nextStep();
    setIsLoading(false);
  };

  const Features = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Branding */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <img
            src="/api/placeholder/1200/800"
            alt="Abstract background"
            className="object-cover w-full h-full opacity-20"
          />
        </div>

        <div className="relative z-10 h-full p-12 flex flex-col">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white">FIELDSALE</h1>
          </div>

          <div className="my-auto space-y-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Company Details
              </h2>
              <p className="text-xl text-white/90">
                Tell us about your organization
              </p>
            </div>

            <div className="space-y-8">
              <Features
                icon={<Check className="w-6 h-6 text-white" />}
                title="Customized Setup"
                description="Tailor the system to your company's specific needs"
              />
              <Features
                icon={<Check className="w-6 h-6 text-white" />}
                title="Efficient Management"
                description="Streamline your sales processes and team coordination"
              />
              <Features
                icon={<Check className="w-6 h-6 text-white" />}
                title="Insightful Analytics"
                description="Gain valuable insights into your company's performance"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Company Details Form */}
      <div className="w-full lg:w-1/2 bg-gray-50">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
            <Card className="w-full max-w-md border-none shadow-none bg-transparent">
              <CardContent>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Company Information
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Please select or enter your company details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="company_select"
                        className="text-sm font-medium"
                      >
                        Select Existing Company
                      </Label>
                      <Select
                        onValueChange={handleCompanySelect}
                        disabled={isLoadingCompanies}
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies?.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id.toString()}
                            >
                              <span className="x-sm text-gray-500">Name: </span>{' '}
                              {company.company_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company_name"
                        className="text-sm font-medium"
                      >
                        Company Name
                      </Label>
                      <Input
                        type="text"
                        name="company_name"
                        id="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company_code"
                        className="text-sm font-medium"
                      >
                        Company Code
                      </Label>
                      <Input
                        type="text"
                        name="company_code"
                        id="company_code"
                        value={formData.company_code}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="registration_number"
                        className="text-sm font-medium"
                      >
                        Registration Number
                      </Label>
                      <Input
                        id="registration_number"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="county" className="text-sm font-medium">
                        County
                      </Label>
                      <Input
                        id="county"
                        name="county"
                        value={formData.county}
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="time_zone"
                        className="text-sm font-medium"
                      >
                        Time Zone
                      </Label>
                      <Input
                        id="time_zone"
                        name="time_zone"
                        value={formData.time_zone}
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-between space-x-4">
                      <Button
                        type="button"
                        onClick={prevStep}
                        className="w-full h-12 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          'Saving...'
                        ) : (
                          <span className="flex items-center justify-center">
                            Continue
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;