import App from "/src/App.jsx";
import Home from "/src/pages/Home.jsx";
import CrazyNotFoundPage from "/src/pages/CrazyNotFoundPage";



const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <CrazyNotFoundPage />,
    children: [
      { path: "/", element: <Home /> },
        ],
  },
];


export default routes;
