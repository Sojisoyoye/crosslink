import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { useSignUp } from "../hooks/useSignUp";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { signUpUser, isLoading } = useSignUp();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    signUpUser.mutate(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        label="Name"
        {...register("name", { required: "Name is required" })}
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Signing Up..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignUpForm;
