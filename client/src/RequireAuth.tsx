import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RequireAuth = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId && isLoaded) {
      navigate("/sign-in");
    }
  }, [userId, isLoaded, navigate]);

  if (isLoaded) {
    return <Outlet />;
  }
};

export default RequireAuth;
