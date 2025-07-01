import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { serviceService, Service } from "../services/serviceService";
import { useAuth } from "../contexts/AuthContext";

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (selectedCategory) params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;

        const response = await serviceService.getAll(params);
        setServices(response.data.data || response.data);
      } catch (err: any) {
        setError("Gagal memuat layanan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await serviceService.getCategories();
        setCategories(response.data || []);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategoriesData();
  }, []);

  const handleCreateComplaint = (serviceId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/complaints/create?service=${serviceId}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
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

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Daftar Layanan Publik
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Pilih layanan yang Anda butuhkan dan buat pengaduan atau permohonan
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Cari layanan..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={selectedCategory}
            label="Kategori"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">Semua Kategori</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            Tidak ada layanan ditemukan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Coba ubah filter pencarian Anda
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {services.map((service) => (
            <Card
              key={service.id}
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="h3" gutterBottom>
                    {service.name}
                  </Typography>
                  {service.category && (
                    <Chip
                      label={service.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>

                {service.requirements && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Persyaratan:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {service.requirements}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleCreateComplaint(service.id)}
                >
                  {isAuthenticated
                    ? "Buat Pengaduan"
                    : "Login untuk Menggunakan"}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Services;
