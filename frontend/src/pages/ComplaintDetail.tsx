import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  AttachFile as AttachFileIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { complaintService, Complaint } from "../services/complaintService";

const ComplaintDetail: React.FC = () => {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchComplaint(parseInt(id));
    }
  }, [id]);

  const fetchComplaint = async (complaintId: number) => {
    try {
      setLoading(true);
      const response = await complaintService.getById(complaintId);
      setComplaint(response.data);
    } catch (err: any) {
      setError("Gagal memuat detail pengaduan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

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

  const formatFileSize = (bytes: string | number) => {
    const size = typeof bytes === "string" ? parseInt(bytes) : bytes;
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownloadDocument = async (
    documentId: number,
    fileName: string
  ) => {
    try {
      const response = await complaintService.downloadDocument(
        complaint!.id,
        documentId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleDownloadResult = async () => {
    try {
      const response = await complaintService.downloadResult(complaint!.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Result_${complaint!.registration_number}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading result:", error);
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

  if (error || !complaint) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Pengaduan tidak ditemukan"}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/complaints/my")}>
          Kembali ke Daftar Pengaduan
        </Button>
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
          Detail Pengaduan
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/complaints/my")}>
          Kembali
        </Button>
      </Box>

      {/* Main Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Typography variant="h5" gutterBottom>
              {complaint.service?.name || "Layanan tidak diketahui"}
            </Typography>
            <Chip
              label={getStatusText(complaint.status)}
              color={getStatusColor(complaint.status) as any}
              variant="filled"
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nomor Registrasi
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.registration_number}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Nama Pemohon
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.applicant_name}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                NIK
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.applicant_nik}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Nomor HP
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.applicant_phone || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Kategori Layanan
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.service?.category || "-"}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Tanggal Pengajuan
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(complaint.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Pekerjaan
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.applicant_job || "-"}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Tanggal Lahir
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.applicant_birth_date
                  ? new Date(complaint.applicant_birth_date).toLocaleDateString(
                      "id-ID"
                    )
                  : "-"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Alamat
            </Typography>
            <Typography variant="body1" gutterBottom>
              {complaint.applicant_address}
            </Typography>
          </Box>

          {complaint.description && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Deskripsi Pengaduan
              </Typography>
              <Typography variant="body1" gutterBottom>
                {complaint.description}
              </Typography>
            </Box>
          )}

          {complaint.notes && (
            <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Catatan dari Admin
              </Typography>
              <Typography variant="body1">{complaint.notes}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      {complaint.documents && complaint.documents.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dokumen Pendukung
            </Typography>
            <List>
              {complaint.documents.map((doc) => (
                <ListItem key={doc.id}>
                  <ListItemIcon>
                    <AttachFileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.document_name}
                    secondary={`${doc.document_type} - ${
                      doc.file_size
                        ? formatFileSize(doc.file_size)
                        : "Unknown size"
                    }`}
                  />
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadDocument(doc.id, doc.document_name)
                    }
                  >
                    Download
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Result Document */}
      {complaint.result_document && (
        <Card sx={{ mb: 3, bgcolor: "success.light" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dokumen Hasil
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Dokumen hasil telah tersedia untuk diunduh
            </Typography>
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadResult}
            >
              Download Dokumen Hasil
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status History */}
      {complaint.statusHistories && complaint.statusHistories.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Riwayat Status
            </Typography>

            <Timeline>
              {complaint.statusHistories.map((history, index) => (
                <TimelineItem key={history.id}>
                  <TimelineOppositeContent
                    color="text.secondary"
                    sx={{ flex: 0.3 }}
                  >
                    {new Date(history.created_at).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={getStatusColor(history.status) as any}
                    />
                    {index < complaint.statusHistories!.length - 1 && (
                      <TimelineConnector />
                    )}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle1" component="h6">
                      {getStatusText(history.status)}
                    </Typography>
                    {history.notes && (
                      <Typography variant="body2" color="text.secondary">
                        {history.notes}
                      </Typography>
                    )}
                    {history.user && (
                      <Typography variant="caption" color="text.secondary">
                        oleh: {history.user.name}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ComplaintDetail;
