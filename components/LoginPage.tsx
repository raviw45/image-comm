"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuthLogin, useLogin } from "@/features/useAuth";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address!!",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long!!",
  }),
});
const LoginPage = ({ setOpen }: { setOpen: () => void }) => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login, isLoginPending } = useLogin();
  const { authLogin, isAuthLoginPending } = useAuthLogin();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    login(values, {
      onSuccess: () => {
        router.push("/");
        form.reset();
        setOpen();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email Address" {...field} />
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
          {isLoginPending ? <Spinner /> : "Login"}
        </Button>

        {/* Google Login */}
        <Button
          type="button"
          onClick={() => authLogin("google")}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-2"
        >
          <FcGoogle size={25} />
          {isAuthLoginPending ? <Spinner /> : "Continue with Google"}
        </Button>

        {/* Signup Link */}
        <p className="text-sm text-center mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default LoginPage;
