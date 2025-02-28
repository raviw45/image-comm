import { IUser } from "@/models/User";
import { registerApi } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

export const useRegister = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: IUser) => registerApi(data),
    onSuccess: () => {
      toast("User registered successfully!!", {
        closeButton: true,
        style: {
          background: "green",
          color: "#fff",
          fontSize: "16px",
          textTransform: "capitalize",
        },
        position: "top-right",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast(
        error?.response?.data?.error ||
          "Failed to register user. Please try again.",
        {
          closeButton: true,
          style: {
            background: "red",
            color: "#fff",
            fontSize: "16px",
            textTransform: "capitalize",
          },
          position: "top-right",
        }
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
      toast("Login Successful!!", {
        closeButton: true,
        style: {
          background: "green",
          color: "#fff",
          fontSize: "16px",
          textTransform: "capitalize",
        },
        position: "top-right",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log("Login error:", error?.message);
      toast(error?.message || "Failed to login. Please try again...", {
        closeButton: true,
        style: {
          background: "red",
          color: "#fff",
          fontSize: "16px",
          textTransform: "capitalize",
        },
        position: "top-right",
      });
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
      toast("Logged Out Successfully!!", {
        closeButton: true,
        style: {
          background: "green",
          color: "#fff",
          fontSize: "16px",
          textTransform: "capitalize",
        },
        position: "top-right",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast(
        error?.response?.data?.error || "Failed to logout. Please try again...",
        {
          closeButton: true,
          style: {
            background: "red",
            color: "#fff",
            fontSize: "16px",
            textTransform: "capitalize",
          },
          position: "top-right",
        }
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
    onSuccess: () => {
      toast("Login Successful!!", {
        closeButton: true,
        style: {
          background: "green",
          color: "#fff",
          fontSize: "16px",
          textTransform: "capitalize",
        },
        position: "top-right",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error?.response?.data?.error);
      toast(
        error?.response?.data?.error || "Failed to login. Please try again...",
        {
          closeButton: true,
          style: {
            background: "red",
            color: "#fff",
            fontSize: "16px",
            textTransform: "capitalize",
          },
          position: "top-right",
        }
      );
    },
  });
  return {
    authLogin: mutate,
    isAuthLoginPending: isPending,
    isAuthLoginError: isError,
  };
};
