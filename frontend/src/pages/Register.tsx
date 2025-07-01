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
import { authService } from "../services/authService";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    email: "",
    phone: "",
    address: "",
    birth_date: "",
    job: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak sama");
      setLoading(false);
      return;
    }

    if (formData.nik.length !== 16) {
      setError("NIK harus 16 digit");
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      setSuccess("Registrasi berhasil! Akun Anda sudah aktif. Silakan login.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Daftar Akun
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

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="NIK (16 digit)"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 16 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Nomor HP"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
              <TextField
                fullWidth
                label="Alamat"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Box>
            <TextField
              fullWidth
              label="Tanggal Lahir"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Pekerjaan"
              name="job"
              value={formData.job}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Konfirmasi Password"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Daftar"}
          </Button>

          <Box textAlign="center">
            <Link component={RouterLink} to="/login" variant="body2">
              Sudah punya akun? Login di sini
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
