import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  // const navigate = useNavigate();
  const [userId, setuserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userId === "" || password === "") {
      // return toast.error("Please fill in all fields!");
    }

    // toast.promise(setLogin({ variables: { userId, password } }), {
    //   loading: "Logging in...",
    //   success: (success) => {
    //     localStorage.setItem("metadata", JSON.stringify(success.data.login));
    //     setuserId("");
    //     setPassword("");
    //     navigate("/");
    //     return "Successfully logged in!";
    //   },
    //   error: (error) => error.message,
    // });
  };

  const handleClick = () => {
    const subject = encodeURIComponent("Report/feedback for LaunchPad");
    const body = encodeURIComponent(
      "Hello LaunchPad team,\n\n[Include your report or feedback details here]\n\nKind regards,\n[Your Name]"
    );

    // Construct the mailto: URL
    const mailtoUrl = `mailto:owais@live.dk?subject=${subject}&body=${body}`;

    // Open the user's default email client
    window.location.href = mailtoUrl;
  };

  return (
    <div className="h-screen w-full flex">
      {/* LEFT SIDE */}
      <div className=" h-full w-full flex flex-col justify-between py-10 shadow-lg bg-slate-100">
        <div className="pl-32">
          <img
            src="/logo.png"
            alt="LaunchPad logo"
            id="logo"
            width={110}
            className="hover:scale-105 duration-150 ease-in-out"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-6 w-full justify-center items-center px-20 sm:px-24 md:px-32"
          >
            <div className="w-full flex">
              <h1 className="text-4xl font-semibold ">Login to LaunchPad</h1>
            </div>

            <div className="w-full">
              <label htmlFor="">User ID</label>
              <input
                type="text"
                placeholder="User ID"
                className="border border-gray-200 rounded-md px-4 py-2 w-full"
                value={userId}
                onChange={(e) => setuserId(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label htmlFor="">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-200 rounded-md px-4 py-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-center items-center w-full">
              <button className="bg-[#009ADB] text-white rounded-md px-4 py-2 w-full">Login</button>
            </div>
          </form>
        </div>
        <div className="px-32 flex items-center justify-between text-sm font-light">
          <p>&copy; 2025 LaunchPad. All rights reserved.</p>
          <button className="text-blue-500 text-xs cursor-pointer" onClick={handleClick}>
            Report/feedback
          </button>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <img src="/login.png" alt="" className="w-full object-cover hidden lg:block" />
    </div>
  );
};

export default Login;
