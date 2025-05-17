import { OutletContextType } from "@/types/ProjectOutletContextType";
import { useOutletContext } from "react-router-dom";

const ProjectOverview = () => {
  const { project } = useOutletContext<OutletContextType>();

  return (
    <div>
      <h1 className="text-2xl font-bold">Project Overview</h1>
      <p className="mt-4 text-gray-600">
        This is the overview of your project. Here you can find all the details about your project.
      </p>
      {/* Add more content here as needed */}
      <p>
        <strong>Project Name:</strong> {project.name}
      </p>
      <p>
        <strong>Project Description:</strong> {project.description || "No description provided"}
      </p>

      <p>
        <strong>Created At:</strong> {new Date(project.createdAt).toLocaleDateString()}
      </p>

      <p>
        <strong>Last Updated At:</strong> {new Date(project.updatedAt).toLocaleDateString()}
      </p>

      <p>
        <strong>Created By:</strong> {project.createdBy.firstName} {project.createdBy.lastName}
      </p>

      <p>
        <strong>Organization:</strong> {project.organization.name}
      </p>

      <p>
        <strong>Stack:</strong> {project.stack || "No stack provided"}
      </p>

      <p>
        <strong>Status:</strong> {project.status || "No status provided"}
      </p>

      <p>
        <strong>Repository URL:</strong>{" "}
        {project.repositoryUrl ? (
          <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
            {project.repositoryUrl}
          </a>
        ) : (
          "No repository URL"
        )}
      </p>

      <p className="flex items-center gap-2">
        <strong>Created By ID:</strong> {project.createdBy.firstName} {project.createdBy.lastName}
        <img src={project.createdBy.imageUrl || "/default-avatar.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
      </p>

      <p>
        <strong>Project ID:</strong> {project.id}
      </p>

      <p>
        <strong>Project Slug:</strong> {project.slug}
      </p>

      <p>
        <strong>Organization ID:</strong> {project.organization.id}
      </p>

      <p>
        <strong>Organization Slug:</strong> {project.organization.slug}
      </p>

      <p>
        <strong>Organization Owner ID:</strong> {project.organization.ownerId}
      </p>

      <p>
        <strong>Organization Created At:</strong> {new Date(project.organization.createdAt).toLocaleDateString()}
      </p>

      

    </div>
  );
};

export default ProjectOverview;
