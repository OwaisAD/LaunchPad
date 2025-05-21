import { OutletContextType } from "@/types/ProjectOutletContextType";
import { Link, useOutletContext } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-gray-700">{children}</span>
);

const Pill = ({ text }: { text: string }) => (
  <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">{text}</span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusColor =
    {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-200 text-gray-600",
      removed: "bg-red-100 text-red-800",
    }[status.toLowerCase()] || "bg-blue-100 text-blue-800";

  return <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${statusColor}`}>{status}</span>;
};

const ProjectOverview = () => {
  const { project } = useOutletContext<OutletContextType>();
  const stack = JSON.parse(project.stack);

  const isActive = project.status?.toLowerCase() === "active";
  const clientUrl = `https://${project.slug}.launchpad.sportia.dk`;
  const serverUrl = `${clientUrl}/api`;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Project Overview</h1>
        <p className="mt-1 text-gray-500">General information and technology stack for this project.</p>
      </div>

      {/* Basic Info */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <p>
            <Label>Name:</Label> {project.name}
          </p>
          <p>
            <Label>Slug:</Label> {project.slug}
          </p>
          <p>
            <Label>Description:</Label> {project.description || "No description"}
          </p>
          <p className="flex items-center gap-2">
            <Label>Status:</Label>
            {project.status ? <StatusBadge status={project.status} /> : <span>None</span>}
          </p>
          <p>
            <Label>Repository: </Label>{" "}
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {stack.repo}
              </a>
            ) : (
              "None"
            )}
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <p>
              <Label>Created At:</Label> {format(new Date(project.createdAt), "yyyy-MM-dd HH:mm")}
            </p>
            <p>
              <Label>Last updated:</Label> {format(new Date(project.updatedAt), "yyyy-MM-dd HH:mm")} (
              {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })})
            </p>
          </div>

          <p>
            <Label>Last Deployed:</Label>{" "}
            {project.updatedAt ? format(new Date(project.updatedAt), "yyyy-MM-dd HH:mm") : "Never"}
          </p>
          <p className="mt-4">
            <Label>Deployment Links</Label>:
            <ul className="mt-1 space-y-1">
              <li>
                CLIENT:{" "}
                {isActive ? (
                  <a
                    href={clientUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {clientUrl}
                  </a>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed" title="Deployment not available yet">
                    {clientUrl}
                  </span>
                )}
              </li>
              <li>
                SERVER:{" "}
                {isActive ? (
                  <a
                    href={serverUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {serverUrl}
                  </a>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed" title="Deployment not available yet">
                    {serverUrl}
                  </span>
                )}
              </li>
            </ul>
          </p>
        </div>
      </section>

      {/* Stack Info */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p>
              <Label>Frontend:</Label> {stack.frontend}
            </p>
            <p>
              <Label>Backend:</Label> {stack.backend}
            </p>
            <p>
              <Label>Authentication:</Label> {stack.auth || "None"}
            </p>
          </div>
          <div>
            <p>
              <Label>Database(s):</Label>
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {stack.databases?.map((db: string) => <Pill key={db} text={db} />)}
            </div>

            <p className="mt-4">
              <Label>DB Connector(s):</Label>
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {stack.dbConnector?.map((dbc: string) => <Pill key={dbc} text={dbc} />) || <span>None</span>}
            </div>

            <p className="mt-4">
              <Label>Logging:</Label>
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {stack.logging?.map((log: string) => <Pill key={log} text={log} />) || <span>None</span>}
            </div>

            <p className="mt-4">
              <Label>Monitoring:</Label>
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {stack.monitoring?.map((mon: string) => <Pill key={mon} text={mon} />) || <span>None</span>}
            </div>

            <p className="mt-4">
              <Label>Testing:</Label>
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {stack.testing?.map((test: string) => <Pill key={test} text={test} />) || <span>None</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Creator & Org Info */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p>
              <Label>Created By:</Label>
            </p>
            <div className="flex items-center gap-3 mt-1">
              <img
                src={project.createdBy.imageUrl || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {project.createdBy.firstName} {project.createdBy.lastName}
                </p>
                <p className="text-sm text-gray-500">User ID: {project.createdBy.id}</p>
              </div>
            </div>
          </div>
          <div>
            <p>
              <Label>Organization:</Label>
              <Link to={`/organizations/${project.organization.slug}`} className="text-blue-600 hover:underline">
                {project.organization.name} ({project.organization.slug})
              </Link>
            </p>
            <p>
              <Label>Org ID:</Label> {project.organization.id}
            </p>
            <p>
              <Label>Owner ID:</Label> {project.createdBy.id}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectOverview;
