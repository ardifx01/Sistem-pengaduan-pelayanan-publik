import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  PeopleAlt as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  Timeline as ReviewingIcon,
  ManageAccounts as ManageComplaintsIcon,
  RoomService as ManageServicesIcon,
} from "@mui/icons-material";
import { complaintService } from "../../services/complaintService";
import { useNavigate } from "react-router-dom";

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getStatistics();
      setStats(response.data);
    } catch (err: any) {
      setError("Gagal memuat statistik. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  const statCards: StatCard[] = [
    {
      title: "Total Pengaduan",
      value: stats?.total || 0,
      icon: <AssignmentIcon fontSize="large" />,
      color: "#1976d2",
    },
    {
      title: "Menunggu",
      value: stats?.pending || 0,
      icon: <PendingIcon fontSize="large" />,
      color: "#ed6c02",
    },
    {
      title: "Sedang Ditinjau",
      value: stats?.reviewing || 0,
      icon: <ReviewingIcon fontSize="large" />,
      color: "#0288d1",
    },
    {
      title: "Disetujui",
      value: stats?.approved || 0,
      icon: <PeopleIcon fontSize="large" />,
      color: "#1976d2",
    },
    {
      title: "Selesai",
      value: stats?.completed || 0,
      icon: <CompletedIcon fontSize="large" />,
      color: "#2e7d32",
    },
    {
      title: "Ditolak",
      value: stats?.rejected || 0,
      icon: <RejectedIcon fontSize="large" />,
      color: "#d32f2f",
    },
  ];

  // Add quick navigation section before statistics
  const quickNavigation = (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Menu Utama Admin
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        <Card
          sx={{
            cursor: "pointer",
            "&:hover": { boxShadow: 6 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => navigate("/admin/complaints")}
        >
          <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
            <ManageComplaintsIcon
              sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h6" component="h2" gutterBottom>
              Kelola Pengaduan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lihat, edit status, dan kelola pengaduan masyarakat
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/complaints");
              }}
            >
              Kelola Pengaduan
            </Button>
          </CardContent>
        </Card>

        <Card
          sx={{
            cursor: "pointer",
            "&:hover": { boxShadow: 6 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => navigate("/admin/services")}
        >
          <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
            <ManageServicesIcon
              sx={{ fontSize: 60, color: "secondary.main", mb: 2 }}
            />
            <Typography variant="h6" component="h2" gutterBottom>
              Kelola Layanan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tambah, edit, dan kelola layanan publik
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/services");
              }}
            >
              Kelola Layanan
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Admin
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selamat datang di panel administrasi sistem pengaduan pelayanan publik
      </Typography>

      {/* Quick Navigation */}
      {quickNavigation}

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            lg: "repeat(6, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {statCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "visible",
            }}
          >
            <CardContent sx={{ textAlign: "center", pb: 2 }}>
              <Box
                sx={{
                  color: stat.color,
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ color: stat.color, fontWeight: "bold" }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ringkasan Bulanan
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Pengaduan bulan ini
              </Typography>
              <Typography variant="h5" color="primary">
                {stats?.this_month || 0}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ringkasan Tahunan
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Pengaduan tahun ini
              </Typography>
              <Typography variant="h5" color="primary">
                {stats?.this_year || 0}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Aksi Cepat
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          <Card
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              textAlign: "center",
              p: 2,
            }}
            onClick={() =>
              (window.location.href = "/admin/complaints?status=pending")
            }
          >
            <Typography variant="subtitle1" gutterBottom>
              Pengaduan Baru
            </Typography>
            <Typography variant="h4" color="warning.main">
              {stats?.pending || 0}
            </Typography>
          </Card>

          <Card
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              textAlign: "center",
              p: 2,
            }}
            onClick={() =>
              (window.location.href = "/admin/complaints?status=reviewing")
            }
          >
            <Typography variant="subtitle1" gutterBottom>
              Perlu Review
            </Typography>
            <Typography variant="h4" color="info.main">
              {stats?.reviewing || 0}
            </Typography>
          </Card>

          <Card
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              textAlign: "center",
              p: 2,
            }}
            onClick={() => (window.location.href = "/admin/services")}
          >
            <Typography variant="subtitle1" gutterBottom>
              Kelola Layanan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Klik untuk mengelola
            </Typography>
          </Card>

          <Card
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              textAlign: "center",
              p: 2,
            }}
            onClick={() => (window.location.href = "/admin/complaints")}
          >
            <Typography variant="subtitle1" gutterBottom>
              Semua Pengaduan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lihat semua pengaduan
            </Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
