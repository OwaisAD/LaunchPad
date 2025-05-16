// src/pages/CreateProject.tsx
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PageHeading from "@/components/PageHeading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getTechOptions } from "@/api/tech-options";
import Loader from "@/components/Loader";
import ToggleButtonGroup from "./ToggleButtonGroup";

// Schema & types
const createProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  frontend: z.string().min(1, "Select a frontend"),
  backend: z.string().min(1, "Select a backend"),
  databases: z.array(z.string()).min(1, "Select a database"),
  // deployment: z.string().min(1, "Select a deployment"),
  repo: z.string().min(1, "Select a repo"),
  dbConnector: z.array(z.string()).optional(),
  logging: z.array(z.string()).optional(),
  monitoring: z.array(z.string()).optional(),
  testing: z.array(z.string()).optional(),
  auth: z.string().optional(),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export type TechOptionType = {
  key: string;
  label: string;
  multi: boolean;
  isOptional: boolean;
  options: Array<{ name: string; note?: string }>;
};

const CreateProjectForm = () => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["techOptions"],
    queryFn: getTechOptions,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      description: "",
      frontend: "",
      backend: "",
      databases: [],
      repo: "",
      dbConnector: [],
      logging: [],
      monitoring: [],
      testing: [],
      auth: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateProjectFormValues) => {
      // send to API
      console.log("Creating project with data:", data);
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      form.reset();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit = (values: CreateProjectFormValues) => {
    console.log(values);
    const confirmation = window.confirm(
      `Are you sure you want to create a project with the name "${values.projectName}"?`
    );
    if (!confirmation) return;
    // mutation.mutate(values);
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-sm space-y-6">
      <PageHeading title="Create Project" />
      <p className="text-sm text-gray-700">
        You can create <strong>X</strong> more projects in your current plan.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Fields */}
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Customer Portal" />
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
                  <Textarea {...field} placeholder="Brief description" className="resize-y-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic Toggle Fields */}
          {data.map(({ key, label, multi, options }: TechOptionType) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof CreateProjectFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {label}{" "}
                    {data.find((d: { key: string }) => d.key === key)?.isOptional && (
                      <span className="text-sm text-gray-400">(optional)</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <ToggleButtonGroup
                      options={options}
                      selected={field.value ?? (multi ? [] : "")}
                      setSelected={field.onChange}
                      multi={multi}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-medium"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProjectForm;
