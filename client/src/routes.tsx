import { Route, Routes as ReactRouterRoutes } from "react-router-dom";
import Error from "./pages/Error";
import Login from "./pages/SignIn";
import CreateAccount from "./pages/SignUp";
import { ProtectedRoute } from "./ProtectedRoute";
import Layout from "./Layout";

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
            <Layout>
              <div>Dashboard</div>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <div>Profile</div>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <div>Settings</div>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}

      <Route path="*" element={<Error />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
