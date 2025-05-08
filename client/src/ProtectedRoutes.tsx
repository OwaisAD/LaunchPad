import { Navigate, Outlet } from "react-router-dom";
import { useValidateSession } from "./hooks/useValidateSession";
import Loading from "./components/Loading";

const ProtectedRoutes = () => {
  const { isLoading, isSuccess, data } = useValidateSession();

  if (isLoading) return <Loading />;

  if (!isSuccess || !data) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
