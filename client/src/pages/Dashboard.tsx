const Dashboard = () => {
  return (
    <div>
      <p className="text-2xl">Welcome to your dashboard!</p>
      <p className="text-gray-500">Here you can manage your projects, organizations, and settings.</p>
      <div className="mt-4">
        <p className="text-lg font-semibold">Quick Links:</p>
        <ul className="list-disc list-inside">
          <li>
            <a href="/projects" className="text-blue-500 hover:underline">
              View Projects
            </a>
          </li>
          <li>
            <a href="/organizations" className="text-blue-500 hover:underline">
              View Organizations
            </a>
          </li>
          <li>
            <a href="/settings" className="text-blue-500 hover:underline">
              Account Settings
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
