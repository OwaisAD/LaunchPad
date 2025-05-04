import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { passwordRegex } from "@/utils/regex";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const SignIn = () => {
  // const navigate = useNavigate();

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

  const signInSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .regex(passwordRegex, {
        message: "Invalid password format",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be less than 100 characters"),
    rememberMe: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signInSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="h-screen w-full flex">
      {/* LEFT SIDE */}
      <div className=" h-full w-full flex flex-col justify-between p-6 lg:p-10 shadow-lg bg-slate-100">
        <div className="flex flex-col items-center w-full md:w-fit hover:scale-105 duration-150 ease-in-out cursor-pointer">
          <img src="/logo.png" alt="LaunchPad logo" id="logo" width={100} />
        </div>

        <div className="flex justify-center items-center flex-col gap-6 w-full px-0 2xl:px-56">
          <div className="w-full flex">
            <h1 className="text-4xl font-semibold ">Sign In to LaunchPad</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your email address. We will send you a confirmation email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters long and include an uppercase letter, lowercase letter,
                      number, and special character (e.g., !, @, #). Brackets, braces, and parentheses are not allowed
                      as special characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel htmlFor="rememberMe">Remember me</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
          <div className="flex flex-col items-center w-full text-sm">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-light">Don't have an account?</p>
              <Link className="text-blue-500 cursor-pointer" to="/sign-up">
                Sign Up now
              </Link>
            </div>

            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-light">Forgot your password?</p>
              <button
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  // navigate("/forgot-password");
                }}
              >
                Reset password
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] md:text-sm font-light">
          <p>&copy; 2025 LaunchPad. All rights reserved.</p>
          <button className="text-blue-500 cursor-pointer" onClick={handleClick}>
            Report/feedback
          </button>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <img src="/login.png" alt="" className="w-full object-cover hidden lg:block" />
    </div>
  );
};

export default SignIn;
