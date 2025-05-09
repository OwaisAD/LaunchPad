import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <p className="text-2xl">Welcome to your dashboard!</p>
      <p className="text-gray-500">Here you can manage your projects, organizations, and settings.</p>
      <div className="mt-4">
        <p className="text-lg font-semibold">Quick Links:</p>
        <ul className="list-disc list-inside">
          <li>
            <Link to="/projects" className="text-blue-500 hover:underline">
              View Projects
            </Link>
          </li>
          <li>
            <Link to="/organizations" className="text-blue-500 hover:underline">
              View Organizations
            </Link>
          </li>
          <li>
            <Link to="/settings" className="text-blue-500 hover:underline">
              Account Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
