import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { complaintService, Complaint } from "../services/complaintService";

const MyComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (statusFilter) params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;

        const response = await complaintService.getAll(params);
        setComplaints(response.data.data || response.data);
      } catch (err: any) {
        setError("Gagal memuat data pengaduan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "reviewing":
        return "info";
      case "approved":
        return "primary";
      case "completed":
        return "success";
      case "rejected":
        return "error";
      case "revision":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "reviewing":
        return "Sedang Ditinjau";
      case "approved":
        return "Disetujui";
      case "completed":
        return "Selesai";
      case "rejected":
        return "Ditolak";
      case "revision":
        return "Perlu Revisi";
      default:
        return status;
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Pengaduan Saya
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/complaints/create")}
        >
          Buat Pengaduan Baru
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Cari nomor registrasi..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Semua Status</MenuItem>
            <MenuItem value="pending">Menunggu</MenuItem>
            <MenuItem value="reviewing">Sedang Ditinjau</MenuItem>
            <MenuItem value="approved">Disetujui</MenuItem>
            <MenuItem value="completed">Selesai</MenuItem>
            <MenuItem value="rejected">Ditolak</MenuItem>
            <MenuItem value="revision">Perlu Revisi</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Belum ada pengaduan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Anda belum mengajukan pengaduan apapun
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/complaints/create")}
          >
            Buat Pengaduan Pertama
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 3 }}>
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {complaint.service?.name || "Layanan tidak diketahui"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      No. Registrasi: {complaint.registration_number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Diajukan:{" "}
                      {new Date(complaint.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusText(complaint.status)}
                    color={getStatusColor(complaint.status) as any}
                    variant="filled"
                  />
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Nama Pemohon
                    </Typography>
                    <Typography variant="body2">
                      {complaint.applicant_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      NIK
                    </Typography>
                    <Typography variant="body2">
                      {complaint.applicant_nik}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Kategori
                    </Typography>
                    <Typography variant="body2">
                      {complaint.service?.category || "-"}
                    </Typography>
                  </Box>
                </Box>

                {complaint.description && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Deskripsi
                    </Typography>
                    <Typography variant="body2">
                      {complaint.description.length > 150
                        ? `${complaint.description.substring(0, 150)}...`
                        : complaint.description}
                    </Typography>
                  </Box>
                )}

                {complaint.notes && (
                  <Box
                    sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Catatan dari Admin
                    </Typography>
                    <Typography variant="body2">{complaint.notes}</Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  Lihat Detail
                </Button>
                {complaint.result_document && (
                  <Button
                    size="small"
                    variant="outlined"
                    href={`${
                      process.env.REACT_APP_API_URL || "http://localhost:8000"
                    }/storage/${complaint.result_document}`}
                    target="_blank"
                  >
                    Download Hasil
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyComplaints;
