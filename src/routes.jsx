import App from "/src/App.jsx";
import Home from "/src/pages/Home.jsx";
import CrazyNotFoundPage from "/src/pages/CrazyNotFoundPage";
import StatsHeader from "/src/components/ui/StatsHeader"; // Updated component name

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <CrazyNotFoundPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/stats", element: <StatsHeader /> }, // Route for StatsHeader
    ],
  },
];

export default routes;
