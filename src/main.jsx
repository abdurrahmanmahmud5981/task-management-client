import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routes/routes";
import AuthProvider from './provider/AuthProvider';


createRoot(document.getElementById("root")).render(
  <StrictMode>
  <AuthProvider>

   <RouterProvider router={routes} />
  </AuthProvider>
  
  </StrictMode>
);
