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

type Organization = {
  id: string;
  name: string;
  description?: string;
  website?: string;
  location?: string;
  slug: string;
  ownerId: string;
};

interface OrganizationCardProps {
  organization: Organization;
  currentUserId: string | null | undefined;
  onDelete: (orgId: string) => void;
}

const OrganizationCard = ({ organization, currentUserId }: OrganizationCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-white rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] hover:shadow-xl transition p-6 h-64 flex flex-col justify-between cursor-pointer"
      onClick={() => navigate(`/organizations/${organization.slug}`)}
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
                navigate(`/organizations/${organization.slug}`);
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/organizations/${organization.slug}/members`);
              }}
            >
              {organization.ownerId === currentUserId ? "Manage Members" : "Members"}
            </DropdownMenuItem>
            {organization.ownerId === currentUserId && (
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
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center h-full w-full items-center">
        <h3 className="text-lg md:text-xl lg:text-2xl font-mediun text-gray-900">{organization.name}</h3>
        {organization.description && <p className="text-sm text-muted-foreground mt-2">{organization.description}</p>}
        {organization.website && (
          <p className="text-sm text-blue-600 mt-1">
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {organization.website}
            </a>
          </p>
        )}
        {organization.location && <p className="text-sm text-gray-500 mt-1">{organization.location}</p>}
      </div>

      {/* Owner Tag */}
      <div className="absolute bottom-0 right-0 bg-muted text-xs text-gray-600 px-3 py-2 rounded-tl-lg rounded-br-lg">
        {organization.ownerId === currentUserId ? (
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

export default OrganizationCard;
