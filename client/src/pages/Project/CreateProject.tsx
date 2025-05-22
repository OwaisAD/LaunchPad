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
import { createProject } from "@/api/projects";
import { useNavigate, useParams } from "react-router-dom";
import { DNA } from "react-loader-spinner";
import { useState } from "react";
import { X } from "lucide-react";
import { SiCcleaner } from "react-icons/si";
import ToolTip from "@/components/ToolTip";

// Schema & types
const createProjectSchema = z.object({
  orgSlug: z.string().min(1, "Organization is required"),
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
  options: Array<{ name: string; note?: string; documentation?: string }>;
};

const CreateProjectForm = () => {
  const [docs, setDocs] = useState<Array<{ name: string; documentation: string }>>([]);
  const { orgId } = useParams();
  const navigate = useNavigate();

  const updateDocs = (groupKey: string, selected: string[] | string, options: TechOptionType["options"]) => {
    const selectedArray = Array.isArray(selected) ? selected : [selected];
    const filtered = options
      .filter((opt) => selectedArray.includes(opt.name) && opt.documentation)
      .map((opt) => ({ name: opt.name, documentation: opt.documentation! }));

    setDocs((prev) => {
      const otherDocs = prev.filter((doc) => !options.some((opt) => opt.name === doc.name));
      return [...otherDocs, ...filtered];
    });
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["techOptions"],
    queryFn: getTechOptions,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      orgSlug: orgId,
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
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully");
      form.reset();
      navigate("/projects");
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
    mutation.mutate(values);
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-sm space-y-6 relative">
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
                      setSelected={(value) => {
                        field.onChange(value);
                        if (typeof value !== "function") {
                          updateDocs(key, value, options); //
                        }
                      }}
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

          {mutation.isPending && (
            <div className="flex justify-center items-center">
              <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" wrapperClass="dna-wrapper" />
            </div>
          )}

          {mutation.isError && (
            <p className="text-red-500 text-sm">{mutation.error.message || "Something went wrong"}</p>
          )}

          {/* clear form icon */}
          {form.formState.isDirty && (
            <ToolTip tooltipText="Clear form">
              <button
                type="button"
                className="absolute top-10 right-10 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => {
                  form.reset();
                  setDocs([]);
                  toast.success("Form cleared");
                }}
                aria-label="Clear form"
              >
                <SiCcleaner className="h-5 w-5" />
              </button>
            </ToolTip>
          )}
        </form>
      </Form>

      {docs.length > 0 && (
        <div className="fixed bottom-6 right-6 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-sm font-semibold text-gray-800 mb-2"> Docs for selected stack</h3>
          <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
            {docs.map((doc) => (
              <li key={doc.name}>
                <a href={doc.documentation} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setDocs([])}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateProjectForm;
