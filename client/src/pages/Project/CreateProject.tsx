import { useState } from "react";
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

// Replace this with your actual API mutation
const createProject = async (data: any) => {
  await new Promise((res) => setTimeout(res, 1000));
  return { success: true, data };
};

// Validation schema
const createProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  frontend: z.string().min(1, "Select a frontend"),
  backend: z.string().min(1, "Select a backend"),
  database: z.string().min(1, "Select a database"),
  deployment: z.string().min(1, "Select a deployment"),
  repo: z.string().min(1, "Select a repo"),
  dbConnector: z.string().min(1, "Select a DB connector"),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

// Options
const techOptions = {
  frontend: ["ReactJS", "Vue", "Angular"],
  backend: [
    { name: "ExpressJS", note: "Runs on Node.js 22.4.0 LTS" },
    { name: "NestJS", note: "Runs on Node.js 22.4.0 LTS" },
  ],
  databases: ["PostgreSQL", "Redis", "MongoDB", "Neo4j"],
  deployment: ["DigitalOcean", "AWS", "Azure"],
  repo: ["GitHub", "GitLab", "ADO"],
  dbConnector: ["Kysely", "Prisma ORM", "PG", "TypeORM", "Sequelize", "Mongoose", "neo4j-driver", "Redis Client"],
};

const ToggleButtonGroup = ({
  options,
  selected,
  setSelected,
  labelKey = "name",
  subLabelKey = "note",
}: {
  options: any[];
  selected: string;
  setSelected: (value: string) => void;
  labelKey?: string;
  subLabelKey?: string;
}) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {options.map((opt) => {
      const name = typeof opt === "string" ? opt : opt[labelKey];
      const subLabel = typeof opt === "string" ? null : opt[subLabelKey];
      return (
        <button
          key={name}
          type="button"
          className={`border px-4 py-2 rounded-md text-sm transition ${
            selected === name ? "bg-black text-white" : "bg-white text-black"
          }`}
          onClick={() => setSelected(name)}
        >
          <div className="flex flex-col items-center">
            <span>{name}</span>
            {subLabel && <span className="text-xs text-gray-500">{subLabel}</span>}
          </div>
        </button>
      );
    })}
  </div>
);

const CreateProjectForm = () => {
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      description: "",
      frontend: "",
      backend: "",
      database: "",
      deployment: "",
      repo: "",
      dbConnector: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully");
      form.reset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit = (values: CreateProjectFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-sm space-y-6">
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
                  <Textarea {...field} placeholder="Brief description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(
            [
              ["frontend", "Select client (frontend) framework", techOptions.frontend],
              ["backend", "Select server (backend) framework", techOptions.backend],
              ["database", "Select one or more databases", techOptions.databases],
              ["deployment", "Select where you want the deployment", techOptions.deployment],
              ["repo", "Select a place to store your code", techOptions.repo],
              ["dbConnector", "Select one or more database connectors (optional)", techOptions.dbConnector],
            ] as const
          ).map(([key, label, options]) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <ToggleButtonGroup options={options} selected={field.value} setSelected={field.onChange} />
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
