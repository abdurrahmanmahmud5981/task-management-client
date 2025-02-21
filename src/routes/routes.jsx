import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Login from "../pages/login/Login";

import PrivateRoute from "./PrivateRoute";
import Register from '../pages/register/Register';

const routers = createBrowserRouter([
  {
    path: "/",
    errorElement: "Error",
    element: (
        <MainLayout />   
    ),
  },

  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register/>
  },
]);
export default routers;
