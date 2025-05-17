import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import PageSidebar from "@/components/page-sidebar";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useProjectDataStore } from "@/stores/useProjectDataStore";
import { getProjectBySlug } from "@/api/projects";

const ViewProject = () => {
  const { orgId, projectId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { setSelectedProject } = useProjectDataStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectBySlug(projectId!), // Assumes slug is unique
    enabled: !!projectId,
    retry(_failureCount, error) {
      // Retry only if the error is a 500 or 503
      if (error instanceof Error) {
        const status = parseInt(error.message);
        return status === 500 || status === 503;
      }
      return false;
    },
  });

  useEffect(() => {
    setSelectedProject({
      name: data?.project.name,
      slug: data?.project.slug,
    });
  }, [data, setSelectedProject, navigate, orgId]);

  useEffect(() => {
    if (!data?.project) return;

    const project = data.project;

    if (project.organization.slug !== orgId) {
      toast.error("You are not authorized to view this project");
      navigate(`/organizations/${orgId}/projects`);
      return;
    }
  }, [data, setSelectedProject, navigate, orgId]);

  useEffect(() => {
    if (!data?.project) return;

    const project = data.project;

    const key = `recentProjects`;
    const newEntry = {
      name: project.name,
      slug: project.slug,
    };

    try {
      const stored = localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];

      // Remove existing entry if exists
      const filtered = parsed.filter((entry: { name: string; slug: string }) => entry.slug !== newEntry.slug);

      // Add new to the front
      const updated = [newEntry, ...filtered];

      // Keep only the latest 5
      const limited = updated.slice(0, 5);

      localStorage.setItem(key, JSON.stringify(limited));
    } catch (error) {
      console.error("Failed to store recent projects:", error);
    }
  }, [data, userId]);

  // Redirect on 404
  useEffect(() => {
    // @ts-expect-error stauts
    if (isError && error?.status === 404) {
      toast.error("Project not found");
      navigate("/projects");
    }
  }, [isError, error, navigate]);

  const menuItems = [
    { name: "Overview", path: `/organizations/${orgId}/projects/${projectId}` },
    { name: "Project Members", path: `/organizations/${orgId}/projects/${projectId}/members` },
    { name: "Integrations", path: `/organizations/${orgId}/projects/${projectId}/integrations` },
    { name: "API Keys", path: `/organizations/${orgId}/projects/${projectId}/api-keys` },
    { name: "Webhooks", path: `/organizations/${orgId}/projects/${projectId}/webhooks` },
    { name: "Audit Logs", path: `/organizations/${orgId}/projects/${projectId}/audit-logs` },
    { name: "Monitoring", path: `/organizations/${orgId}/projects/${projectId}/monitoring` },
    { name: "Billing", path: `/organizations/${orgId}/projects/${projectId}/billing` },
    { name: "Settings", path: `/organizations/${orgId}/projects/${projectId}/settings` },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  const project = data.project;

  return (
    <div className="flex min-h-screen ">
      <PageSidebar title={project.name} menuItems={menuItems} />
      <main className="flex-1 p-6">
        <div className="mt-2">
          <Outlet
            context={{
              project,
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ViewProject;
