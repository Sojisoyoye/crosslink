import { useMutation } from "@tanstack/react-query";
import { login } from "../api/authApi";
import { useSnackbar } from "../components/AlertSnackbar";
import { useNavigate } from "react-router-dom";

class Error {
  response?: {
    data: {
      message: string;
    };
  };
}

export const useLogin = () => {
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: login,
    onSuccess: () => {
      openSnackbar("Login successful!", "success");
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      openSnackbar(
        error.response?.data?.message || "Login failed. Please try again.",
        "error"
      );
    },
  });

  return {
    loginUser,
    isLoading: loginUser.status === "pending",
  };
};
