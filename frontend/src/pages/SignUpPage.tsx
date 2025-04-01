import React from "react";
import { Box, Typography, Container } from "@mui/material";
import SignUpForm from "../components/SignUpForm";

const SignUpPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <SignUpForm />
      </Box>
    </Container>
  );
};

export default SignUpPage;
