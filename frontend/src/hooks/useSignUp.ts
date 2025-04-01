import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/authApi";
import { useSnackbar } from "../components/AlertSnackbar";

class Error {
  response?: {
    data: {
      message: string;
    };
  };
}

export const useSignUp = () => {
  const { openSnackbar } = useSnackbar();

  const signUpUser = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      openSnackbar(
        "Sign-up successful! Please check your email for verification.",
        "success"
      );
    },
    onError: (error: Error) => {
      openSnackbar(
        error.response?.data?.message || "Sign-up failed. Please try again.",
        "error"
      );
    },
  });

  return {
    signUpUser,
    isLoading: signUpUser.status === "pending",
  };
};
