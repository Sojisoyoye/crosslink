import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h2" gutterBottom>
          Welcome to CrossLink
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your one-stop solution for seamless cross-platform link.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/signup")}
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
