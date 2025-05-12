import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOutletContext } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { OutletContextType } from "@/types/OrganizationOutletContextType";

const Overview = () => {
  const { organization } = useOutletContext<OutletContextType>();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{organization.name}</h1>
        <p className="text-sm text-muted-foreground">
          Created {formatDistanceToNow(new Date(organization.createdAt), { addSuffix: true })} (
          {new Date(organization.createdAt).toLocaleDateString()})
        </p>
      </div>

      <Separator />

      {/* Organization Info */}
      <div className="space-y-6">
        {/* Name */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-base">{organization.name}</p>
          </div>
          <Button variant="outline">Edit</Button>
        </div>

        <Separator />

        {/* Description */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-base">
              {organization.description || <span className="text-muted-foreground">No description provided</span>}
            </p>
          </div>
          <Button variant="outline">Edit</Button>
        </div>

        <Separator />

        {/* Website */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Website</p>
            <p className="text-base">
              {organization.website || <span className="text-muted-foreground">No website provided</span>}
            </p>
          </div>
          <Button variant="outline">Edit</Button>
        </div>

        <Separator />

        {/* Location */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="text-base">
              {organization.location || <span className="text-muted-foreground">No location provided</span>}
            </p>
          </div>
          <Button variant="outline">Edit</Button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
