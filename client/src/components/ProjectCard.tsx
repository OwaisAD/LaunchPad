import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiUserCommunityLine } from "react-icons/ri";
import { useProjectDataStore } from "@/stores/useProjectDataStore";

type Project = {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: string;
  stack: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    website: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string | null;
  };
};

interface ProjectCardProps {
  project: Project;
  currentUserId: string | null | undefined;
  onDelete: (orgId: string) => void;
}

const ProjectCard = ({ project, currentUserId }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { setSelectedProject } = useProjectDataStore();

  return (
    <div
      className="relative bg-white rounded-2xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-in-out p-6 h-64 flex flex-col justify-between cursor-pointer shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]
"
      onClick={() => {
        setSelectedProject({
          name: project.name,
          slug: project.slug,
        });
        navigate(`/organizations/${project.organization.slug}/projects/${project.slug}`);
      }}
    >
      {/* Dropdown Menu */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/organizations/${project.organization.slug}`);
              }}
            >
              View
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/organizations/${project.organization.slug}/members`);
              }}
            >
              {projectorganization.ownerId === currentUserId ? "Manage Members" : "Members"}
            </DropdownMenuItem> */}
            {/* {organization.ownerId === currentUserId && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/organizations/${organization.slug}/settings`);
                  }}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </>
            )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center h-full w-full justify-center px-4">
        <h3 className="text-xl md:text-2xl font-medium text-gray-900 break-all">{project.name}</h3>

        {project.description && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{project.description}</p>
        )}
      </div>
      {/* last updated at */}
      <p className="text-xs text-gray-500 mt-2">
        Last updated: {new Date(project.updatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
      </p>
      {/* Owner Tag */}
      <div className="absolute bottom-3 right-3 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
        {project.createdBy.id === currentUserId ? (
          <span className="flex items-center">
            <MdOutlineAdminPanelSettings className="mr-1" />
            Owner
          </span>
        ) : (
          <span className="flex items-center">
            <RiUserCommunityLine className="mr-1" />
            Member
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
