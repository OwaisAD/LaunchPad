import { Navigate, Outlet } from "react-router-dom";
import { useValidateSession } from "./hooks/useValidateSession";
import Loading from "./components/Loading";

const PublicRoutes = () => {
  const { isLoading, isSuccess, data } = useValidateSession();

  if (isLoading) return <Loading />;

  if (isSuccess && data) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoutes;
