import { getOrganizations } from "@/api/organizations";
import Loader from "@/components/Loader";
import ToolTip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { IoReload } from "react-icons/io5";
import CreateOrganizationDialog from "./CreateOrganizationDialog";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import OrganizationCard from "@/components/OrganizationCard";
import PageHeading from "@/components/PageHeading";
import { toast } from "sonner";

type Organization = {
  id: string;
  name: string;
  description: string;
  website: string;
  location: string;
  slug: string;
  ownerId: string;
};

const MyOrganizations = () => {
  const { userId } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  useEffect(() => {
    if (data) {
      setOrganizations(data.organizations);
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <PageHeading title="My Organizations" />

      <div className="flex justify-end items-center gap-2">
        <ToolTip tooltipText="Refresh">
          <Button
            onClick={() => {
              refetch();
              toast.success("Refreshed successfully");
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
          >
            <IoReload />
          </Button>
        </ToolTip>

        <CreateOrganizationDialog refetch={refetch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
            currentUserId={userId}
            onDelete={(orgId) => {
              // Implement your delete logic here (e.g. mutation, toast, refetch, etc.)
              console.log("Delete organization", orgId);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MyOrganizations;
