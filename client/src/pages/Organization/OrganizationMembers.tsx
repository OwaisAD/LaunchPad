import { useAuth } from "@clerk/clerk-react";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "@/types/OrganizationOutletContextType";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // if you have a className utility
import { InviteMemberDialog } from "@/components/InviteMemberDialog";
import { useMutation } from "@tanstack/react-query";
import { changeRole } from "@/api/organizations";
import { toast } from "sonner";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  member: "Member",
};

const OrganizationMembers = () => {
  const { organization } = useOutletContext<OutletContextType>();
  const { userId } = useAuth();

  const {
    mutate: mutateChangeRole,
    isPending,
    // error,
  } = useMutation({
    mutationFn: changeRole,
    onSuccess: (data) => {
      // handle success
      console.log("Role changed successfully", data);
      toast.success("Role changed successfully");
    },
    onError: (error) => {
      // handle error
      console.error("Error changing role", error);
      toast.error("Error changing role");
    },
  });

  const isAdmin = organization.Membership.some((member) => member.userId === userId && member.role === "ADMIN");

  const handleRoleChange = (memberEmail: string) => {
    // implement role change logic
    const newRole = prompt("Enter new role (admin/member):", "member");
    if (newRole && (newRole === "admin" || newRole === "member")) {
      mutateChangeRole({ organizationId: organization.id, email: memberEmail, role: newRole.toUpperCase() });
    } else {
      toast.error("Invalid role");
    }
  };

  const handleRemoveMember = (memberId: string) => {
    // implement remove logic
    alert(`Remove member ${memberId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Members</h2>
        {isAdmin && <InviteMemberDialog organizationId={organization.id} />}
      </div>

      <div className="space-y-4">
        {organization.Membership.map((member) => {
          const isCurrentUser = member.userId === userId;

          return (
            <div
              key={member.id}
              className="flex items-center justify-between bg-white dark:bg-muted p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.user.imageUrl} />
                  <AvatarFallback>
                    {member.user.firstName?.[0]}
                    {member.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {member.user.firstName} {member.user.lastName}
                    {isCurrentUser && <span className="ml-1 text-xs text-muted-foreground">(You)</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-semibold", member.role === "admin" ? "text-blue-600" : "text-gray-500")}>
                  {isPending ? "Changing role..." : roleLabels[member.role] || member.role}
                </p>

                {isAdmin && !isCurrentUser && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleRoleChange(member.user.email)}>
                      Change Role
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(member.id)}>
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Separator />
    </div>
  );
};

export default OrganizationMembers;
