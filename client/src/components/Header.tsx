import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="z-[9999] absolute h-[80px] top-0 left-0 w-full p-6 flex justify-between items-center bg-[#F1F5F9]  backdrop-blur-sm">
      <Link to={isSignedIn ? "/dashboard" : "/"} className="flex justify-center lg:justify-start">
        <img src="/logo.png" alt="LaunchPad logo" width={80} className="hover:scale-105 transition-transform" />
      </Link>
      <nav className="space-x-6 font-medium flex items-center">
        <SignedOut>
          <Link to="/sign-in" className="hover:underline">
            Sign In
          </Link>
          <Link to="/sign-up" className="hover:underline">
            Sign Up
          </Link>
        </SignedOut>

        <SignedIn>
          <Link to="/organizations" className="hover:underline">
            Organizations
          </Link>
          <Link to="/projects" className="hover:underline">
            Projects
          </Link>

          <Link to="/settings" className="hover:underline">
            Settings
          </Link>

          <div className="z-[9999]">
            <UserButton userProfileMode="modal" showName />
          </div>
        </SignedIn>
      </nav>
    </header>
  );
};

export default Header;
