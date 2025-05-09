import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import HeaderLink from "./HeaderLink";
import { Search } from "./Search";
import { OrganizationSwitcherComboBox } from "./OrganizationSwitcherComboBox";

const Header = () => {
  const location = useLocation();
  const { isSignedIn } = useUser();

  return (
    <header className="relative w-full max-w-full z-10 h-[80px] px-6 flex justify-between items-center bg-[#F1F5F9] backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-4 h-full">
        <Link to={isSignedIn ? "/dashboard" : "/"} className="flex justify-center lg:justify-start">
          <img src="/logo.png" alt="LaunchPad logo" width={80} className="hover:scale-105 transition-transform" />
        </Link>

        <SignedIn>
          <Search placeholder="Search by resource name or public IP" className="w-[400px] bg-[#F1F5F9]" />
        </SignedIn>
      </div>

      <nav className="space-x-6 font-medium flex items-center">
        <SignedOut>
          <HeaderLink to="/sign-in" title="Sign In" active={location.pathname === "/sign-in"} />

          <HeaderLink to="/sign-up" title="Sign Up" active={location.pathname === "/sign-up"} />
        </SignedOut>

        <SignedIn>
          <HeaderLink to="/organizations" title="Organizations" active={location.pathname === "/organizations"} />
          <HeaderLink to="/projects" title="Projects" active={location.pathname === "/projects"} />
          <OrganizationSwitcherComboBox />
        </SignedIn>
      </nav>
    </header>
  );
};

export default Header;
