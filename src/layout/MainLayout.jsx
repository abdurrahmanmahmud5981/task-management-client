import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AllTasks from "../pages/tasks/AllTasks";
import {
  Navbar,
  Typography,
  Menu,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { FaUser, FaSignOutAlt, FaTasks } from "react-icons/fa";

const MainLayout = () => {
  const { loader, user, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loader) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user?.email) {
    return <Navigate to="/login" state={location.pathname} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar className="max-w-full rounded-none px-4 py-2">
        <div className="flex items-center justify-between text-gray-900">
          <div className="flex items-center gap-2">
            <FaTasks className="h-6 w-6 text-blue-500" />
            <Typography
              as="a"
              href="#"
              variant="h6"
              className="mr-4 cursor-pointer py-1.5"
            >
              Task Manager
            </Typography>
          </div>

          {/* User Menu */}

          <div className="">
            <Avatar
              size="sm"
              className="border-2 border-blue-400 lg:ml-auto"
              src={
                user.photoURL ||
                "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/ct-assets/team-4.jpg"
              }
              alt="profile-picture"
            />
            <Button className="cursor-pointer bg-blue-500 border-none px-4 text-white ml-1.5"><FaSignOutAlt className="mr-1.5"/> Logout</Button>
          </div>
        </div>
      </Navbar>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Page Content */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <Typography type="h4" className="font-semibold">
              Welcome back, {user.displayName || "User"}!
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Manage your tasks and stay organized.
            </Typography>
          </div>

          {/* Tasks Section */}
          <div className="mt-6">
            <AllTasks />
          </div>

          {/* Router Outlet for nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
