import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationBySlug } from "@/api/organizations"; // You need to implement this if not done
import Loader from "@/components/Loader";
import PageSidebar from "@/components/page-sidebar";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useOrganizationDataStore } from "@/stores/useOrganizationDataStore";

const ViewOrganization = () => {
  const { orgId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { setSelectedOrg } = useOrganizationDataStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["org", orgId],
    queryFn: () => getOrganizationBySlug(orgId!), // Assumes slug is unique
    enabled: !!orgId,
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
    setSelectedOrg({
      name: data?.organization.name,
      slug: data?.organization.slug,
    });
  }, [data, setSelectedOrg]);

  useEffect(() => {
    if (!data?.organization) return;

    const org = data.organization;

    const key = `recentOrganizations`;
    const newEntry = {
      name: org.name,
      slug: org.slug,
      userId,
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
      console.error("Failed to store recent organizations:", error);
    }
  }, [data, userId]);

  // Redirect on 404
  useEffect(() => {
    // @ts-expect-error stauts
    if (isError && error?.status === 404) {
      toast.error("Organization not found");
      navigate("/organizations");
    }
  }, [isError, error, navigate]);

  const menuItems = [
    { name: "Overview", path: `/organizations/${orgId}` },
    { name: "Members", path: `/organizations/${orgId}/members` },
    { name: "Projects", path: `/organizations/${orgId}/projects` },
    { name: "Billing & Plan", path: `/organizations/${orgId}/billing` },
    { name: "Integrations", path: `/organizations/${orgId}/integrations` },
    { name: "Settings", path: `/organizations/${orgId}/settings` },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  const organization = data.organization;

  return (
    <div className="flex min-h-screen ">
      <PageSidebar title={organization.name} menuItems={menuItems} />
      <main className="flex-1 p-6">
        <div className="mt-2">
          <Outlet
            context={{
              organization,
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ViewOrganization;
