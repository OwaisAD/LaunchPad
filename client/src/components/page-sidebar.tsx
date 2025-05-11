import { NavLink } from "react-router-dom";

interface MenuItem {
  name: string;
  path: string;
}

interface PageSidebarProps {
  title?: string;
  menuItems: MenuItem[];
}

const PageSidebar = ({ title, menuItems }: PageSidebarProps) => {
  return (
    <aside className="w-64 bg-white border-r p-4 hidden md:block">
      {title && <h2 className="text-xl font-semibold mb-6">{title}</h2>}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.name === "Overview"}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md transition text-sm font-mono ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default PageSidebar;
