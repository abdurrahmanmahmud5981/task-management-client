import { Link, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AllTasks from "../pages/tasks/AllTasks";
import { 
  Navbar, 
  Typography, 
  Avatar, 
  Button,
  IconButton
} from "@material-tailwind/react";
import { FaSignOutAlt, FaTasks } from "react-icons/fa";

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
      <div className="grid min-h-screen place-items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user?.email) {
    return <Navigate to="/login" state={location.pathname} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        className="sticky top-0 z-10 h-max max-w-full rounded-none border-none px-4 py-2 shadow-md"
        color="white"
      >
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          <div className="flex items-center gap-2">
            <IconButton
              as={Link}
              size="sm"
              className="  border-none px-4 text-blue-500  flex items-center gap-2 border-blue-500"
            >
              <FaTasks className="h-5 w-5" />
            </IconButton>
            <Link
            
              to="/"
              className="mr-4 cursor-pointer py-1.5  text-blue-500 font-bold"
            >
              Task Manager
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                variant="circular"
                className="cursor-pointer border-2 border-blue-500"
                src={user.photoURL || "https://docs.material-tailwind.com/img/face-2.jpg"}
                alt="avatar"
              />
              <div className="hidden lg:block">
                <Typography variant="small" className="font-normal">
                  {user.displayName || user.email}
                </Typography>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              size="sm"
              className="cursor-pointer  border-none px-4 text-white  flex items-center gap-2 bg-blue-500 hover:bg-blue-600  shadow-blue-500/20"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </Button>
          </div>
        </div>
      </Navbar>

      <main className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="rounded-xl bg-white p-6 shadow-sm">
        <Typography type="h4" className="text-gray-800 text-center">
          Task Management
        </Typography>
          <div className="mb-8">
            <Typography variant="h4" color="blue-gray" className="font-semibold">
              Welcome back, {user.displayName || "User"}!
            </Typography>
            <Typography variant="paragraph" color="gray" className="mt-1">
              Manage your tasks and stay organized.
            </Typography>
          </div>

          <div className="mt-6">
            <AllTasks />
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;