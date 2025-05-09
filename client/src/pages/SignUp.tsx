import { SignUp as SignUpClerk } from "@clerk/clerk-react";

const SignUp = () => {
  const handleClick = () => {
    const subject = encodeURIComponent("Report/feedback for LaunchPad");
    const body = encodeURIComponent(
      "Hello LaunchPad team,\n\n[Include your report or feedback details here]\n\nKind regards,\n[Your Name]"
    );
    window.location.href = `mailto:owais@live.dk?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 px-4 py-10 ">
      <SignUpClerk signInUrl="/sign-in" />

      <div className="flex flex-col items-center justify-between text-[10px] md:text-sm font-light pt-4 border-t">
        <p>&copy; 2025 LaunchPad. All rights reserved.</p>
        <button className="text-blue-500 cursor-pointer" onClick={handleClick}>
          Report/feedback
        </button>
      </div>
    </div>
  );
};

export default SignUp;
