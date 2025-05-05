import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { passwordRegex } from "@/utils/regex";
import { Link } from "react-router-dom";

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

const SignIn = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    console.log(values);
  };

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
      <div className="h-full flex flex-col justify-between px-6 py-10 lg:px-20 bg-slate-100 shadow-md">
        <div className="flex justify-center lg:justify-start mb-10">
          <img src="/logo.png" alt="LaunchPad logo" width={100} className="hover:scale-105 transition-transform" />
        </div>

        <div className="flex flex-col gap-8 w-full max-w-xl mx-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Sign In to LaunchPad</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      We'll send a confirmation to this email address.
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
                      Must be at least 8 characters with upper/lowercase, a number, and special character.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel htmlFor="rememberMe" className="mb-0">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-sm text-center space-y-2">
            <div>
              <span className="text-gray-600">Don't have an account?</span>{" "}
              <Link className="text-blue-500 hover:underline" to="/sign-up">
                Sign up now
              </Link>
            </div>
            <div>
              <span className="text-gray-600">Forgot your password?</span>{" "}
              <button className="text-blue-500 hover:underline" onClick={() => {}}>
                Reset it
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs md:text-sm flex justify-between pt-10 text-gray-500">
          <p>&copy; 2025 LaunchPad. All rights reserved.</p>
          <button className="text-blue-500 hover:underline" onClick={handleClick}>
            Report/feedback
          </button>
        </div>
      </div>

      {/* RIGHT SIDE (Image) */}
      <div className="hidden lg:block">
        <img
          src="/login.png"
          alt="Login Illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignIn;
