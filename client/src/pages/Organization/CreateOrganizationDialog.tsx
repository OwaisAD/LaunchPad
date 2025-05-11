import { createOrganization } from "@/api/organizations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { IoAddCircleOutline } from "react-icons/io5";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(300).optional(),
  website: z.string().optional(),
  location: z.string().max(100).optional(),
});

type CreateOrganizationDialogProps = {
  refetch: () => void;
};

const CreateOrganizationDialog = ({ refetch }: CreateOrganizationDialogProps) => {
  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: async (data) => {
      toast.success("Organization created successfully");
      refetch();
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      location: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createOrganizationSchema>) => {
    try {
      // toast here...
      await mutation.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="flex items-center justify-center bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
          <IoAddCircleOutline />
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Creating a new organization</DialogTitle>
          <DialogDescription>
            You can add members to the organization after it is created.
            <br />
            You can create <span className="font-bold"> X </span> more organizations in your current plan.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Organization Name" className="input" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Description" className="input h-32 resize-y max-h-[250px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Website URL" className="input" type="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded mb-4 cursor-pointer">
              Create
            </Button>
          </form>
        </Form>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="mr-2 cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
