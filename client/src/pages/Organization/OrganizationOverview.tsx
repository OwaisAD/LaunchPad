import { useOutletContext } from "react-router-dom";

type OutletContextType = {
  organization: {
    id: string;
    name: string;
    description: string;
    website: string;
    location: string;
    slug: string;
    ownerId: string;
  };
};

const OrganizationOverview = () => {
  const { organization } = useOutletContext<OutletContextType>();

  return (
    <div>
      <h1 className="text-2xl font-bold">{organization.name}</h1>
      <p className="text-gray-600 mt-1">{organization.description}</p>

      {/* Add more details about the organization here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-gray-600 mt-1">
          This is where you can add more details about the organization, such as its mission, vision, and values.
        </p>
      </div>

      {/* id */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Organization ID</h2>
        <p className="text-gray-600 mt-1">{organization.id}</p>
      </div>

      {/* ownerId */}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Website</h2>
        <p className="text-gray-600 mt-1">
          <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {organization.website}
          </a>
        </p>
        <h2 className="text-xl font-semibold mt-4">Location</h2>
        <p className="text-gray-600 mt-1">{organization.location}</p>
      </div>
    </div>
  );
};

export default OrganizationOverview;
