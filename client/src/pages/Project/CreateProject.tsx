import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PageHeading from "@/components/PageHeading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { techOptions } from "@/data/techOptions";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

// Replace this with your actual API mutation
const createProject = async () => {};

// Validation schema
const createProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  frontend: z.string().min(1, "Select a frontend"),
  backend: z.string().min(1, "Select a backend"),
  databases: z.array(z.string()).min(1, "Select a database"),
  deployment: z.string().min(1, "Select a deployment"),
  repo: z.string().min(1, "Select a repo"),
  dbConnector: z.array(z.string()).optional(),
  logging: z.array(z.string()).optional(),
  monitoring: z.array(z.string()).optional(),
  testing: z.array(z.string()).optional(),
  auth: z.array(z.string()).optional(),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

const ToggleButtonGroup = ({
  options,
  selected,
  setSelected,
  multi = false,
}: {
  options: { name: string; note?: string }[];
  selected: string | string[];
  setSelected: (value: string | string[]) => void;
  multi?: boolean;
}) => {
  const isSelected = (name: string) => (multi ? (selected as string[]).includes(name) : selected === name);

  const handleClick = (name: string) => {
    if (multi) {
      const selectedArray = selected as string[];
      const newValue = selectedArray.includes(name)
        ? selectedArray.filter((item) => item !== name)
        : [...selectedArray, name];
      setSelected(newValue);
    } else {
      setSelected(name);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map(({ name, note }) => (
        <button
          key={name}
          type="button"
          className={`border px-4 py-2 rounded-md text-sm transition ${
            isSelected(name) ? "bg-black text-white" : "bg-white text-black"
          }`}
          onClick={() => handleClick(name)}
        >
          <div className="flex flex-col items-center">
            <span>{name}</span>
            {note && <span className="text-xs text-gray-500">{note}</span>}
          </div>
        </button>
      ))}
    </div>
  );
};

const CreateProjectForm = () => {
  const [progress, setProgress] = useState(0);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      description: "",
      frontend: "",
      backend: "",
      databases: [],
      deployment: "",
      repo: "",
      dbConnector: [],
      logging: [],
      monitoring: [],
      testing: [],
      auth: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully");
      form.reset();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit = (values: CreateProjectFormValues) => {
    setTimeout(() => setProgress(100), 2000);
    console.log(values);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-sm space-y-6">
      <PageHeading title="Create Project" />
      <p className="text-sm text-gray-700">
        You can create <strong>X</strong> more projects in your current plan.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Textarea
                    {...field}
                    placeholder="Brief description"
                    className="resize-y-none max-h-[200px]"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(
            [
              ["frontend", "Select client (frontend) framework", techOptions.frontend, false],
              ["backend", "Select server (backend) framework", techOptions.backend, false],
              ["databases", "Select one or more databases", techOptions.databases, true],
              ["deployment", "Select where you want the deployment", techOptions.deployment, false],
              ["repo", "Select a place to store your code", techOptions.repo, false],
              ["dbConnector", "Select one or more database connectors (optional)", techOptions.dbConnector, true],
              ["logging", "Select one or more logging libraries (optional)", techOptions.logging, true],
              ["monitoring", "Select one or more monitoring libraries (optional)", techOptions.monitoring, true],
              ["testing", "Select one or more testing libraries (optional)", techOptions.testing, true],
              ["auth", "Select one or more authentication libraries (optional)", techOptions.auth, true],
            ] as const
          ).map(([key, label, options, multi]) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <ToggleButtonGroup
                      options={options}
                      selected={field.value || (multi ? [] : "")}
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

      <div className="mt-4">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default CreateProjectForm;
