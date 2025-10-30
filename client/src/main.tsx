import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import './index.css'
import ExperienceDetail from "./pages/ExperienceDetail";
import Checkout from "./pages/Checkout";
import BookingConfirmed from "./pages/BookingConfirmed"

// Define all routes
const router = createBrowserRouter([
  {
    path: "/", // main route
    element: <App />,
    children: [
      {
        path: "/", // default route
        element: <Home />,
      },
      {
        path: "/experience/:id",
        element:<ExperienceDetail />
      },
      {
        path: "/checkout",
        element:<Checkout />
      },
      {
      path:"/complete",
      element:<BookingConfirmed />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
