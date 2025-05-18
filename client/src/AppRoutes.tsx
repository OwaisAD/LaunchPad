import { Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import Login from "./pages/SignIn";
import CreateAccount from "./pages/SignUp";
import Layout from "./Layout";
import LandingPage from "./pages/LandingPage";
import RequireAuth from "./RequireAuth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Organizations from "./pages/Organization/MyOrganizations";
import ViewOrganization from "./pages/Organization/ViewOrganization";
import OrganizationOverview from "./pages/Organization/Overview";
import OrganizationSettings from "./pages/Organization/Settings";
import OrganizationMembers from "./pages/Organization/OrganizationMembers";
import MyProjects from "./pages/Project/MyProjects";
import CreateProject from "./pages/Project/CreateProject";
import ViewProject from "./pages/Project/ViewProject";
import ProjectOverview from "./pages/Project/Overview";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route index path="/" element={<LandingPage />} />

      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<CreateAccount />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />

          {/* Organizations */}
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/organizations/:orgId" element={<ViewOrganization />}>
            <Route index element={<OrganizationOverview />} />
            <Route path="members" element={<OrganizationMembers />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="billing" element={<div>Your current plan + Billing</div>} />
            <Route path="integrations" element={<div>Integrations</div>} />
            <Route path="settings" element={<OrganizationSettings />} />
          </Route>

          <Route path="/organizations/:orgId/projects/:projectId" element={<ViewProject />}>
            <Route index element={<ProjectOverview />} />
            <Route path="deployments" element={<div>Deployments</div>} />
            <Route path="members" element={<div>Project Members</div>} />
            <Route path="integrations" element={<div>Integrations</div>} />
            <Route path="api-keys" element={<div>API Keys</div>} />
            <Route path="webhooks" element={<div>Webhooks</div>} />
            <Route path="audit-logs" element={<div>Audit Logs</div>} />
            <Route path="monitoring" element={<div>Monitoring</div>} />
            <Route path="billing" element={<div>Billing</div>} />
            <Route path="settings" element={<div>Project Settings</div>} />
          </Route>

          {/* Projects */}
          <Route path="/projects" element={<MyProjects />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:projectId" element={<div>Project Details</div>} />
          <Route path="/projects/:projectId/edit" element={<div>Edit Project</div>} />
          <Route path="/projects/:projectId/edit" element={<div>Edit Project Overview</div>} />
          {/* Create project */}
          <Route path="/projects/create" element={<div>Create Project</div>} />

          {/* Settings page */}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch all additional routes */}

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default AppRoutes;
