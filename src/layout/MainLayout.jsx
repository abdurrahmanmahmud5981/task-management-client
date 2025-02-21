import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const MainLayout = () => {
  const {loader,user , logOut} = useAuth();
  console.log(user);
  if (loader) {
    return <div>Loading...</div>;
  }

  if (user?.email) {
    return (
      <div>
        hello {user.email}
        <Outlet />
        <br />
        <button onClick={logOut}>logout</button>
      </div>
    );
  } else {
    return <Navigate to="/login" state={location.pathname} />;
  }
};

export default MainLayout;
