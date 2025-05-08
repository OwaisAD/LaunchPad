// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { passwordRegex } from "@/utils/regex";
// import { Link, useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import { signUp } from "@/api/auth";
// import { toast } from "sonner";
import { SignUp as SignUpClerk } from "@clerk/clerk-react";

// const signUpSchema = z
//   .object({
//     firstName: z.string().min(1, "First name is required").max(50),
//     lastName: z.string().min(1, "Last name is required").max(50),
//     dateOfBirth: z.string().refine(
//       (date) => {
//         console.log("DATE RECEIVED", date);
//         const today = new Date();
//         const birthDate = new Date(date);
//         const age = today.getFullYear() - birthDate.getFullYear();
//         const monthDiff = today.getMonth() - birthDate.getMonth();
//         return age > 18 || (age === 18 && monthDiff >= 0);
//       },
//       {
//         message: "You must be at least 18 years old",
//       }
//     ),
//     email: z.string().email("Invalid email").min(1, "Email is required").max(100),
//     password: z.string().regex(passwordRegex, { message: "Invalid password format" }).min(8).max(100),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

const SignUp = () => {
  // const navigate = useNavigate();

  // const mutation = useMutation({
  //   mutationFn: signUp,
  //   onSuccess: () => {
  //     toast.success("Sign up successful!");
  //     navigate("/sign-in");
  //   },
  //   onError: (error: unknown) => {
  //     toast.error(error instanceof Error ? error.message : "Failed to sign up. Please try again.");
  //   },
  // });

  // const form = useForm<z.infer<typeof signUpSchema>>({
  //   resolver: zodResolver(signUpSchema),
  //   defaultValues: {
  //     firstName: "",
  //     lastName: "",
  //     dateOfBirth: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //   },
  // });

  const handleClick = () => {
    const subject = encodeURIComponent("Report/feedback for LaunchPad");
    const body = encodeURIComponent(
      "Hello LaunchPad team,\n\n[Include your report or feedback details here]\n\nKind regards,\n[Your Name]"
    );
    window.location.href = `mailto:owais@live.dk?subject=${subject}&body=${body}`;
  };

  // function handleSignUp(values: z.infer<typeof signUpSchema>) {
  //   console.log("Form Submitted", values);
  //   const loadingToastId = toast.loading("Creating account...");
  //   mutation.mutate(
  //     {
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //       dateOfBirth: values.dateOfBirth,
  //       email: values.email,
  //       password: values.password,
  //     },
  //     {
  //       onSettled: () => toast.dismiss(loadingToastId),
  //     }
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl space-y-6 shadow-lg bg-white rounded-lg p-8 flex flex-col justify-center items-center">
        <div className="flex justify-center">
          <img src="/logo.png" alt="LaunchPad logo" width={100} className="hover:scale-105 duration-150" />
        </div>

        {/* <h1 className="text-3xl md:text-4xl font-semibold text-center">Create LaunchPad Account</h1> */}

        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignUp)} className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                      Password must be at least 8 characters and include upper/lowercase, number, and special character.
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
                    <FormDescription>&nbsp;</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </Form>

        <div className="text-sm text-center space-y-2">
          <p className="font-light">
            Already have an account?{" "}
            <Link className="text-blue-500" to="/sign-in">
              Sign In now
            </Link>
          </p>
        </div> */}

        <SignUpClerk signInUrl="/sign-in" />

        <div className="flex items-center justify-between text-[10px] md:text-sm font-light pt-4 border-t">
          <p>&copy; 2025 LaunchPad. All rights reserved.</p>
          <button className="text-blue-500 cursor-pointer" onClick={handleClick}>
            Report/feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
