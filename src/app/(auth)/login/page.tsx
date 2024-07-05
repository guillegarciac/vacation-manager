"use client";

import React, { FormEvent, useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!response?.error) {
      router.push("/");
    } else {
      setError(response.error);
    }
  };

  if (status === "authenticated") {
    return null;
  }

  const isFormFilled = email && password;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      suppressHydrationWarning={true}
    >
      <Card sx={{ maxWidth: 400, padding: 3 }}>
        <CardContent>
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" gutterBottom>
              vacation-manager
            </Typography>
            <Typography variant="h5" gutterBottom>
              Login to your account
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} suppressHydrationWarning={true}>
            <TextField
              variant="outlined"
              label="Email"
              name="email_input"
              type="email"
              id="email"
              required
              fullWidth
              margin="normal"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning={true}
            />
            <TextField
              variant="outlined"
              label="Password"
              name="password_input"
              type="password"
              id="password"
              required
              fullWidth
              margin="normal"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suppressHydrationWarning={true}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                padding: "10px 20px",
                textTransform: "none",
                transition: "background-color 0.3s",
                backgroundColor: loading ? "primary" : undefined,
              }}
              disabled={loading || !isFormFilled}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Login"
              )}
            </Button>
          </form>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
