import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { passwordRegex } from "@/utils/regex";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const SignUp = () => {
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

  const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
    dateOfBirth: z.string().refine(
      (date) => {
        const today = new Date();
        const birthDate = new Date(date);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        return age > 18 || (age === 18 && monthDiff >= 0);
      },
      {
        message: "You must be at least 18 years old",
      }
    ),
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
    confirmPassword: z
      .string()
      .regex(passwordRegex, {
        message: "Invalid password format",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be less than 100 characters"),
  });

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signUpSchema>) {
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
            <h1 className="text-4xl font-semibold ">Create LaunchPad account</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormDescription>Enter your first name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormDescription>Enter your last name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="Date of Birth" {...field} />
                    </FormControl>
                    <FormDescription>Enter your date of birth.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormDescription>Re-enter your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </Form>
          <div className="flex flex-col items-center w-full text-sm">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-light">Already have an account?</p>
              <Link className="text-blue-500 cursor-pointer" to="/sign-in">
                Sign In now
              </Link>
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

export default SignUp;
