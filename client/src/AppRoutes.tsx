import { Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import Login from "./pages/SignIn";
import CreateAccount from "./pages/SignUp";
import Layout from "./Layout";
import { useValidateSession } from "./hooks/useValidateSession";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import Loading from "./components/Loading";

function AppRoutes() {
  const { isLoading } = useValidateSession();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route index path="/" element={<div>Landing page</div>} />
      <Route element={<PublicRoutes />}>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<CreateAccount />} />
        <Route path="/about" element={<div>About</div>} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Route>
      </Route>

      {/* Catch all additional routes */}

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default AppRoutes;
