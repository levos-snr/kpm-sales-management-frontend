import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/auth';
import RegistrationPage from '../pages/RegistrationPage';
import CompanyDetails from '../pages/CompanyDetails';
import OrganizationCustomize from '../pages/OrganizationCustomize';
import SuccessPage from '../pages/SuccessPage';
import { toast } from 'react-toastify';
import useStore from '../store';

const MultiStepRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    company_name: '',
    company_code: '',
    company_id: null,
    registration_number: '',
    county: '',
    sub_county: '',
    ward: '',
    time_zone: '',
    address: '',
    logo_url: '',
  });
  
   const { setUser, setAccessToken, setRefreshToken } = useStore();

   const registerMutation = useMutation({
     mutationFn: registerUser,
     onSuccess: (data) => {
       setUser(data.user);
       setAccessToken(data.access_token);
       setRefreshToken(data.refresh_token);
       toast.success('Registration successful!');
       setStep(4);
     },
     onError: (error) => {
       toast.error('Registration failed. Please try again.');
       console.error('Registration error:', error);
     },
   });

   const updateFormData = (newData) => {
      setFormData((prevData) => ({ ...prevData, ...newData }));
    };

   const nextStep = () => setStep(step + 1);
   const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    registerMutation.mutate(formData);
  };

  switch (step) {
    case 1:
      return (
        <RegistrationPage
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
        />
      );
    case 2:
      return (
        <CompanyDetails
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      );
    case 3:
      return (
        <OrganizationCustomize
          formData={formData}
          updateFormData={updateFormData}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />
      );
    case 4:
      return <SuccessPage />;
    default:
      return (
        <RegistrationPage
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
        />
      );
  }
};

export default MultiStepRegistration;
