"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useAuthLogin, useRegister } from "@/features/useAuth";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!!" }),
  email: z.string().email({
    message: "Please enter a valid email address!!",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long!!",
  }),
});
const SignupPage = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const { register, isRegisterPending } = useRegister();
  const { authLogin, isAuthLoginPending } = useAuthLogin();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  function onSubmit(values: z.infer<typeof signUpSchema>) {
    register(values, {
      onSuccess: () => {
        router.push("/login");
        form.reset();
      },
    });
  }
  return (
    <section className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white w-[420px] shadow-lg p-8 rounded-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="username"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Login Button */}
            <Button type="submit" className="w-full uppercase mt-2">
              {isRegisterPending ? <Spinner /> : "SignUp"}
            </Button>
            {/* Google Login */}
            <Button
              onClick={() => authLogin("google")}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mt-2"
            >
              <FcGoogle size={25} />
              {isAuthLoginPending ? <Spinner /> : "Continue with Google"}
            </Button>
            {/* Signup Link */}
            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default SignupPage;
