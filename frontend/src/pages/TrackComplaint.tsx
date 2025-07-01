import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Chip,
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
import { complaintService, Complaint } from "../services/complaintService";

const TrackComplaint: React.FC = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationNumber.trim()) {
      setError("Nomor registrasi tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await complaintService.track(registrationNumber.trim());
      setComplaint(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Pengaduan tidak ditemukan");
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Tracking Pengaduan
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Masukkan nomor registrasi untuk melacak status pengaduan Anda
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleTrack} sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Nomor Registrasi"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="REG-20250701-ABC123"
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Mencari..." : "Lacak"}
            </Button>
          </Box>
        </Box>

        {complaint && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Detail Pengaduan
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
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nomor Registrasi
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {complaint.registration_number}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Jenis Layanan
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {complaint.service?.name || "-"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nama Pemohon
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {complaint.applicant_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tanggal Pengajuan
                    </Typography>
                    <Typography variant="body1" gutterBottom>
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
                </Box>

                {complaint.description && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Deskripsi
                    </Typography>
                    <Typography variant="body1">
                      {complaint.description}
                    </Typography>
                  </Box>
                )}

                {complaint.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Catatan
                    </Typography>
                    <Typography variant="body1">{complaint.notes}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {complaint.statusHistories &&
              complaint.statusHistories.length > 0 && (
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
                            {new Date(history.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {history.notes}
                              </Typography>
                            )}
                            {history.user && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
        )}
      </Paper>
    </Container>
  );
};

export default TrackComplaint;
