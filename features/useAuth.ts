import { IUser } from "@/models/User";
import { registerApi } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

export const useRegister = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: IUser) => registerApi(data),
    onSuccess: () => {
      toast.success("User registered successfully!!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast.error(
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
    mutationFn: async (credentials: Record<"email" | "password", string>) => {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Login Successful!!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to login. Please try again...");
      } else {
        toast.error("Unexpected error occurred. Please try again...");
      }
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
    onSuccess: () => {
      toast.success("Logged Out Successfully!!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast.error(
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
    mutationFn: async (provider: string) => {
      const result = await signIn(provider, {
        callbackUrl: "/",
        redirect: false,
      });

      if (!result || result?.error || result?.ok === false) {
        throw new Error(
          result?.error || "Google login failed. Please try again later."
        );
      }

      return result;
    },

    onSuccess: () => {
      toast.success("Login Successful!! 🎉");
    },

    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to login. Please try again...");
      } else {
        toast.error("Unexpected error occurred. Please try again...");
      }
    },
  });

  return {
    authLogin: mutate,
    isAuthLoginPending: isPending,
    isAuthLoginError: isError,
  };
};
