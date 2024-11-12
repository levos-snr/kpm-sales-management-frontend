import App from "/src/App.jsx";
import Dashboard from "/src/pages/Dashboard.jsx";
import CrazyNotFoundPage from "/src/pages/CrazyNotFoundPage";
import LoginPage from "/src/pages/LoginPage";
import RegistrationForm from "/src/pages/RegistrationForm";
import OrganizationCustomize from "/src/pages/OrganizationCustomize";
import SuccessPage from "/src/pages/SuccessPage";
import CompanyDetails from "/src/pages/CompanyDetails";




const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <CrazyNotFoundPage />,
    children: [
      { path: "/", element: <LoginPage /> },
        { path: "login", element: <LoginPage /> },
       { path: "/dashboard", element: <Dashboard /> },
       { path: "/register", element: <RegistrationForm /> },
       { path: "/organization-setup", element: <OrganizationCustomize /> },
       { path: "/success", element: <SuccessPage /> },
       { path: "/company-details", element: <CompanyDetails /> },
    ],
  },
];


export default routes;
