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

const OrganizationCard = ({ organization, currentUserId, onDelete }: OrganizationCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 h-64 flex flex-col justify-between cursor-pointer"
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
                onDelete(organization.id);
              }}
            >
              Invite members
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(organization.id);
              }}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center h-full w-full items-center">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-mediun text-gray-900">{organization.name}</h3>
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
      {organization.ownerId === currentUserId && (
        <div className="absolute bottom-0 right-0 bg-muted text-xs text-gray-600 px-3 py-2 rounded-tl-lg rounded-br-lg">
          <MdOutlineAdminPanelSettings className="inline-block mr-1" />
          Owner
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;
