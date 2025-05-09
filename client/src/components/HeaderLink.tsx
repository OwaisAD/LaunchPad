import { Link } from "react-router-dom";

const HeaderLink = ({ to, title, active }: { to: string; title: string; active: boolean }) => {
  return (
    <Link
      to={to}
      className={`text-gray-700 hover:text-blue-500 
    ${active ? "text-blue-500 font-semibold" : ""} transition-colors duration-200`}
    >
      {title}
    </Link>
  );
};

export default HeaderLink;
