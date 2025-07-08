import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Pagination,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { serviceService } from "../../services/serviceService";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  requirements: string;
  processing_time: string;
  cost: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");

  // Dialog states
  const [detailDialog, setDetailDialog] = useState(false);
  const [formDialog, setFormDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    requirements: "",
    processing_time: "",
    cost: 0,
    is_active: true,
  });

  const categories = [
    "Administrasi Kependudukan",
    "Perizinan",
    "Kesehatan",
    "Pendidikan",
    "Sosial",
    "Ekonomi",
    "Lingkungan",
    "Infrastruktur",
    "Lainnya",
  ];

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { page };
      if (categoryFilter) params.category = categoryFilter;

      const response = await serviceService.getAll(params);
      console.log("Services API Response:", response); // Debug log

      // Handle Laravel pagination response
      if (response.data && response.data.data) {
        setServices(response.data.data);
        setTotalPages(response.data.last_page || 1);
      } else if (Array.isArray(response.data)) {
        setServices(response.data);
        setTotalPages(1);
      } else {
        setServices([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Services API Error:", err);
      setError(err.response?.data?.message || "Failed to fetch services");
      setServices([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpenForm = (service?: Service) => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        category: service.category,
        requirements: service.requirements,
        processing_time: service.processing_time,
        cost: service.cost,
        is_active: service.is_active,
      });
      setSelectedService(service);
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        requirements: "",
        processing_time: "",
        cost: 0,
        is_active: true,
      });
      setSelectedService(null);
      setIsEditing(false);
    }
    setFormDialog(true);
  };

  const handleSubmitForm = async () => {
    try {
      if (isEditing && selectedService) {
        await serviceService.update(selectedService.id, formData);
        setSuccess("Service updated successfully");
      } else {
        await serviceService.create(formData);
        setSuccess("Service created successfully");
      }
      setFormDialog(false);
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save service");
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      await serviceService.delete(selectedService.id);
      setSuccess("Service deleted successfully");
      setDeleteDialog(false);
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete service");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Kelola Layanan</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Tambah Layanan
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess(null)}
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={categoryFilter}
              label="Kategori"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">Semua Kategori</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setCategoryFilter("");
              setPage(1);
            }}
          >
            Reset Filter
          </Button>
        </Box>
      </Paper>

      {/* Services Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Layanan</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Waktu Proses</TableCell>
              <TableCell>Biaya</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tanggal Dibuat</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {service.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {service.description.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.processing_time}</TableCell>
                  <TableCell>{formatCurrency(service.cost)}</TableCell>
                  <TableCell>
                    <Chip
                      label={service.is_active ? "Aktif" : "Tidak Aktif"}
                      color={service.is_active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(service.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Lihat Detail">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedService(service);
                            setDetailDialog(true);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenForm(service)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Hapus">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedService(service);
                            setDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {Array.isArray(services)
                      ? "Tidak ada layanan ditemukan"
                      : "Memuat data..."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detail Layanan</DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedService.name}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Kategori:</strong> {selectedService.category}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Deskripsi:</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedService.description}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Persyaratan:</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedService.requirements}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Waktu Proses:</strong> {selectedService.processing_time}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Biaya:</strong> {formatCurrency(selectedService.cost)}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Status:</strong>{" "}
                <Chip
                  label={selectedService.is_active ? "Aktif" : "Tidak Aktif"}
                  color={selectedService.is_active ? "success" : "default"}
                  size="small"
                />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>

      {/* Form Dialog */}
      <Dialog
        open={formDialog}
        onClose={() => setFormDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Edit Layanan" : "Tambah Layanan Baru"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nama Layanan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={formData.category}
              label="Kategori"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Deskripsi"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Persyaratan"
            value={formData.requirements}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Waktu Proses"
            value={formData.processing_time}
            onChange={(e) =>
              setFormData({ ...formData, processing_time: e.target.value })
            }
            margin="normal"
            placeholder="Contoh: 3 hari kerja"
            required
          />

          <TextField
            fullWidth
            type="number"
            label="Biaya (Rupiah)"
            value={formData.cost}
            onChange={(e) =>
              setFormData({ ...formData, cost: Number(e.target.value) })
            }
            margin="normal"
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
            }
            label="Layanan Aktif"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialog(false)}>Batal</Button>
          <Button onClick={handleSubmitForm} variant="contained">
            {isEditing ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus layanan "{selectedService?.name}"?
            Tindakan ini tidak dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Batal</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminServices;
