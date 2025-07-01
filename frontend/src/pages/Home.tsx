import React from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: "Daftar Layanan",
      description:
        "Lihat semua layanan yang tersedia dari Pemerintah Kabupaten Badung",
      action: () => navigate("/services"),
      buttonText: "Lihat Layanan",
    },
    {
      title: "Buat Pengaduan",
      description: "Ajukan pengaduan atau permohonan layanan publik",
      action: () => navigate(isAuthenticated ? "/complaints/create" : "/login"),
      buttonText: "Buat Pengaduan",
    },
    {
      title: "Tracking Pengaduan",
      description: "Lacak status pengaduan Anda dengan nomor registrasi",
      action: () => navigate("/track"),
      buttonText: "Tracking",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          backgroundImage: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
          color: "white",
          p: 6,
          mb: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Sistem Pengaduan Pelayanan Publik
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Pemerintah Kabupaten Badung
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, fontSize: "1.1rem" }}>
          Platform digital untuk mengajukan pengaduan dan mengakses layanan
          publik dengan mudah, transparan, dan akuntabel
        </Typography>
        {!isAuthenticated && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/register")}
            >
              Daftar Sekarang
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
        )}
      </Paper>

      {/* Features Section */}
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Layanan Kami
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
          mb: 6,
        }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={feature.action}
                fullWidth
              >
                {feature.buttonText}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Information Section */}
      <Paper sx={{ p: 4, bgcolor: "grey.50" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Tentang Sistem Ini
        </Typography>
        <Typography variant="body1" paragraph>
          Sistem Pengaduan Pelayanan Publik Kabupaten Badung merupakan platform
          digital yang memungkinkan masyarakat untuk:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1">
            Mengajukan berbagai jenis layanan publik secara online
          </Typography>
          <Typography component="li" variant="body1">
            Memantau status dan progres pengaduan secara real-time
          </Typography>
          <Typography component="li" variant="body1">
            Mendapatkan notifikasi melalui email untuk setiap perubahan status
          </Typography>
          <Typography component="li" variant="body1">
            Mengunduh hasil layanan yang telah selesai diproses
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Dengan sistem ini, kami berkomitmen untuk meningkatkan kualitas
          pelayanan publik yang lebih efisien, transparan, dan akuntabel.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;
