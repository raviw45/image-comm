import { IUser } from "@/models/User";
import { registerApi } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

export const useRegister = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: IUser) => registerApi(data),
    onSuccess: () => toast("User registered successfully!!"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast(
        error?.response?.data?.error ||
          "Failed to register user. Please try again."
      );
    },
  });

  return {
    register: mutate,
    isRegisterPending: isPending,
    isRegisterError: isError,
  };
};

export const useLogin = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (credentials: Record<"email" | "password", string>) =>
      signIn("credentials", { ...credentials, redirect: false }),
    onSuccess: () => toast("Login Successful!!"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast(
        error?.response?.data?.error || "Failed to login. Please try again..."
      );
    },
  });
  return {
    login: mutate,
    isLoginPending: isPending,
    isLoginError: isError,
  };
};

export const useLogout = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => toast("Logged Out Successfully!!"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast(
        error?.response?.data?.error || "Failed to logout. Please try again..."
      );
    },
  });
  return {
    logout: mutate,
    isLogoutPending: isPending,
    isLogoutError: isError,
  };
};

export const useAuthLogin = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (provider: string) => signIn(provider, { callbackUrl: "/" }),
    onSuccess: () => toast("Login Successful!!"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast(
        error?.response?.data?.error || "Failed to login. Please try again..."
      );
    },
  });
  return {
    authLogin: mutate,
    isAuthLoginPending: isPending,
    isAuthLoginError: isError,
  };
};
