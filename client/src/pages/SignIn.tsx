import { useLocation } from "react-router-dom";
import { SignIn as SignInClerk } from "@clerk/clerk-react";

const SignIn = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleClick = () => {
    const subject = encodeURIComponent("Report/feedback for LaunchPad");
    const body = encodeURIComponent(
      "Hello LaunchPad team,\n\n[Include your report or feedback details here]\n\nKind regards,\n[Your Name]"
    );
    window.location.href = `mailto:owais@live.dk?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE (Form) */}
      <div className="min-h-screen flex flex-col justify-between px-6 py-10 lg:px-20 bg-slate-100 shadow-md">
        <div></div>

        <div className="flex flex-col gap-8 w-full items-center">
          <SignInClerk signUpUrl="/sign-up" fallbackRedirectUrl={from || "/dashboard"} path="/sign-in" />
        </div>

        <div className="text-xs md:text-sm flex justify-between pt-10 text-gray-500">
          <p>&copy; 2025 LaunchPad. All rights reserved.</p>
          <button className="text-blue-500 hover:underline" onClick={handleClick}>
            Report/feedback
          </button>
        </div>
      </div>

      {/* RIGHT SIDE (Image) */}
      <div className="hidden lg:block h-screen overflow-hidden">
        <img src="/login.png" alt="Login Illustration" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default SignIn;
