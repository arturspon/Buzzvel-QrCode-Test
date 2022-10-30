import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import GenerateQrCodePage from "./pages/GenerateQrCodePage";
import ViewUserLinksPage from "./pages/ViewUserLinksPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/generate" />,
  },
  {
    path: "/generate",
    element: <GenerateQrCodePage />,
  },
  {
    path: "/:pageName",
    element: <ViewUserLinksPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
