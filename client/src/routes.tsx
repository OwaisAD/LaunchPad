import { Route, Routes as ReactRouterRoutes } from "react-router-dom";
import Error from "./pages/Error";
import Login from "./pages/SignIn";
import CreateAccount from "./pages/SignUp";
import { ProtectedRoute } from "./ProtectedRoute";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route index path="/" element={<div>Landing page</div>} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<CreateAccount />} />
      <Route path="/about" element={<div>About</div>} />

      {/* Protected Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div>Profile</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div>Settings</div>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}

      <Route path="*" element={<Error />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
