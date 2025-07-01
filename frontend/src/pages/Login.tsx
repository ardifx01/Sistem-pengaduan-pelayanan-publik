import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login gagal. Periksa email dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Sistem Pengaduan Pelayanan Publik Kabupaten Badung
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>

          <Box textAlign="center">
            <Link component={RouterLink} to="/register" variant="body2">
              Belum punya akun? Daftar di sini
            </Link>
          </Box>

          <Box textAlign="center" sx={{ mt: 1 }}>
            <Link component={RouterLink} to="/track" variant="body2">
              Tracking Pengaduan Tanpa Login
            </Link>
          </Box>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Demo Accounts:
          </Typography>
          <Typography variant="body2">
            Admin: admin@badung.go.id / admin123
          </Typography>
          <Typography variant="body2">
            Operator: operator@badung.go.id / operator123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
