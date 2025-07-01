import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { complaintService } from "../services/complaintService";
import { serviceService, Service } from "../services/serviceService";
import { useAuth } from "../contexts/AuthContext";

const CreateComplaint: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    service_id: "",
    applicant_name: "",
    applicant_nik: "",
    applicant_address: "",
    applicant_phone: "",
    applicant_job: "",
    applicant_birth_date: "",
    description: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();

    // Pre-fill user data
    if (user) {
      setFormData((prev) => ({
        ...prev,
        applicant_name: user.name || "",
        applicant_nik: user.nik || "",
        applicant_address: user.address || "",
        applicant_phone: user.phone || "",
        applicant_job: user.job || "",
        applicant_birth_date: user.birth_date || "",
      }));
    }

    // Pre-select service from query params
    const serviceId = searchParams.get("service");
    if (serviceId) {
      setFormData((prev) => ({ ...prev, service_id: serviceId }));
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (formData.service_id) {
      const service = services.find(
        (s) => s.id.toString() === formData.service_id
      );
      setSelectedService(service || null);
    }
  }, [formData.service_id, services]);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getAll();
      setServices(response.data.data || response.data);
    } catch (err: any) {
      setError("Gagal memuat layanan. Silakan refresh halaman.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.applicant_nik.length !== 16) {
      setError("NIK harus 16 digit");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        service_id: parseInt(formData.service_id),
        documents: documents,
      };

      const response = await complaintService.create(submitData);
      setSuccess(
        `Pengaduan berhasil dibuat dengan nomor registrasi: ${response.data.registration_number}`
      );

      setTimeout(() => {
        navigate("/complaints/my");
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Gagal membuat pengaduan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Buat Pengaduan Baru
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Isi form di bawah ini untuk membuat pengaduan atau permohonan layanan
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Service Selection */}
          <FormControl fullWidth sx={{ mb: 3 }} required>
            <InputLabel>Pilih Layanan</InputLabel>
            <Select
              name="service_id"
              value={formData.service_id}
              label="Pilih Layanan"
              onChange={(e) =>
                setFormData({ ...formData, service_id: e.target.value })
              }
            >
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id.toString()}>
                  {service.name} - {service.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedService && (
            <Card
              sx={{ mb: 3, bgcolor: "info.light", color: "info.contrastText" }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedService.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedService.description}
                </Typography>
                {selectedService.requirements && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Persyaratan:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {selectedService.requirements}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Applicant Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Data Pemohon
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { sm: "1fr 1fr" },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              label="Nama Lengkap"
              name="applicant_name"
              value={formData.applicant_name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="NIK (16 digit)"
              name="applicant_nik"
              value={formData.applicant_nik}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 16 }}
            />
            <TextField
              fullWidth
              label="Nomor HP"
              name="applicant_phone"
              value={formData.applicant_phone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Pekerjaan"
              name="applicant_job"
              value={formData.applicant_job}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Tanggal Lahir"
              name="applicant_birth_date"
              type="date"
              value={formData.applicant_birth_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            fullWidth
            label="Alamat"
            name="applicant_address"
            multiline
            rows={3}
            value={formData.applicant_address}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Deskripsi Pengaduan (Opsional)"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="Jelaskan detail pengaduan atau hal-hal yang perlu diperhatikan..."
          />

          {/* Document Upload */}
          <Typography variant="h6" gutterBottom>
            Upload Dokumen Pendukung
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Pilih File
              <input
                type="file"
                hidden
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </Button>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              Format yang didukung: PDF, JPG, PNG (Max 2MB per file)
            </Typography>
          </Box>

          {documents.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  File yang dipilih:
                </Typography>
                <List>
                  {documents.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton onClick={() => removeDocument(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={file.name}
                        secondary={formatFileSize(file.size)}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? "Mengirim..." : "Kirim Pengaduan"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateComplaint;
