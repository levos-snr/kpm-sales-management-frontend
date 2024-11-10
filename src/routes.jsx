import App from "/src/App.jsx";
import Home from "/src/pages/Home.jsx";
import CrazyNotFoundPage from "/src/pages/CrazyNotFoundPage";
import LoginPage from "/src/pages/LoginPage";
import RegistrationPage from "/src/pages/RegistrationPage";


const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <CrazyNotFoundPage />,
    children: [
      { path: "/", element: <LoginPage /> },
       { path: "/dashboard", element: <Home /> },
       { path: "/register", element: <RegistrationPage /> },
    ],
  },
];


export default routes;
