import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AllTasks from "../pages/tasks/AllTasks";

const MainLayout = () => {
  const {loader,user , logOut} = useAuth();
  console.log(user);
  if (loader) {
    return <div>Loading...</div>;
  }

  if (user?.email) {
    return (
      <div className="w-11/12  mx-auto my-2.5">
        hello {user.email}
        <Outlet />
        <br />
        <button onClick={logOut}>logout</button>
        <div className="">
         <AllTasks/>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" state={location.pathname} />;
  }
};

export default MainLayout;
