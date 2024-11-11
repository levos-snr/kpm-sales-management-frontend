import App from "/src/App.jsx";
import Home from "/src/pages/Home.jsx";
import CrazyNotFoundPage from "/src/pages/CrazyNotFoundPage";
import LoginPage from "/src/pages/LoginPage";
import RegistrationForm from "/src/pages/RegistrationForm";
import AccountSuccess from "/src/pages/AccountSuccess";
import OrganizationSetupPage from "/src/pages/OrganizationSetupPage";
import SuccessPage from "/src/pages/SuccessPage";
import CompanyDetails from "/src/pages/CompanyDetails";
import CompanyBranding from "/src/pages/CompanyBranding";


const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <CrazyNotFoundPage />,
    children: [
      { path: "/", element: <LoginPage /> },
       { path: "/dashboard", element: <Home /> },
       { path: "/register", element: <RegistrationForm /> },
       { path: "/account-success", element: <AccountSuccess /> },
       { path: "/organization-setup", element: <OrganizationSetupPage /> },
       { path: "/success", element: <SuccessPage /> },
       { path: "/company-details", element: <CompanyDetails /> },
    ],
  },
];


export default routes;
