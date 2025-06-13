import { getProjects, getProjectsByOrg } from "@/api/projects";
import { ChoseOrganizationDialog } from "@/components/ChoseOrganizationDialog";
import Loader from "@/components/Loader";
import PageHeading from "@/components/PageHeading";
import ProjectCard from "@/components/ProjectCard";
import ToolTip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { useOrganizationDataStore } from "@/stores/useOrganizationDataStore";
import { useProjectDataStore } from "@/stores/useProjectDataStore";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoAddCircleOutline, IoReload } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MyProjects = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { organizations } = useOrganizationDataStore();
  const { projects, setProjects } = useProjectDataStore();

  const [choseOrgDialog, setChoseOrgDialog] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: orgId ? () => getProjectsByOrg(orgId) : getProjects,
  });

  useEffect(() => {
    if (data) {
      setProjects(data.projects);
    }
  }, [setProjects, data]);

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-10 gap-4">
        <PageHeading title="My Projects" />

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

          <Button
            className="flex items-center justify-center bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
            onClick={() => {
              if (orgId) {
                navigate(`/organizations/${orgId}/projects/create`);
              } else {
                setChoseOrgDialog((prev) => !prev);
              }
            }}
          >
            <IoAddCircleOutline />
            Create Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            currentUserId={userId}
            onDelete={(orgId) => {
              // Implement your delete logic here (e.g. mutation, toast, refetch, etc.)
              console.log("Delete organization", orgId);
            }}
          />
        ))}
      </div>

      {/* PROJECT CARDS*/}
      {/* REMEMBER github repo */}
      {/* MONITORING PAGE WITHIN */}
      <ChoseOrganizationDialog open={choseOrgDialog} setOpen={setChoseOrgDialog} organizations={organizations} />

      {projects.length === 0 && (
        <div className="mt-4">
          <p className="text-lg font-semibold">No projects found</p>
          <p className="text-gray-500">You can create a new project by clicking the button above.</p>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
