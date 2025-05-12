import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { inviteMember } from "@/api/organizations";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type InviteMemberDialogProps = {
  organizationId: string;
};

export const InviteMemberDialog = ({ organizationId }: InviteMemberDialogProps) => {
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ email }: { email: string }) => inviteMember(organizationId, email),
    onSuccess: () => {
      toast.success("Invitation sent!");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to invite user");
    },
  });

  const onSubmit = async (data: z.infer<typeof inviteSchema>) => {
    mutation.mutate({ email: data.email });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">Invite Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a New Member</DialogTitle>
          <DialogDescription>Enter an email to invite a user to your organization.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="user@example.com"
                      disabled={mutation.status == "pending"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.status == "pending"} className="w-full bg-blue-600 text-white">
              {mutation.status == "pending" ? "Sending..." : "Send Invitation"}
            </Button>
          </form>
        </Form>

        <DialogFooter className="sm:justify-start mt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
