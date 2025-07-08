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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Pagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  FileUpload as UploadIcon,
} from "@mui/icons-material";
import { complaintService } from "../../services/complaintService";

interface Complaint {
  id: number;
  registration_number: string;
  applicant_name: string;
  description: string;
  status: string;
  notes: string;
  user: {
    name: string;
    email: string;
  };
  service: {
    name: string;
  };
  created_at: string;
  updated_at: string;
}

const statusColors: Record<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  pending: "warning",
  reviewing: "info",
  approved: "primary",
  revision: "warning",
  completed: "success",
  rejected: "error",
};

const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  // Dialog states
  const [detailDialog, setDetailDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page };
      if (statusFilter) params.status = statusFilter;

      const response = await complaintService.getAll(params);

      console.log("API Response:", response); // Debug log

      // Handle Laravel pagination response structure
      if (response.data && response.data.data) {
        // Laravel pagination: { data: { data: [...], current_page, last_page, ... } }
        setComplaints(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        setTotalPages(response.data.last_page || 1);
      } else if (response.data && Array.isArray(response.data)) {
        // Direct array response: { data: [...] }
        setComplaints(response.data);
        setTotalPages(1);
      } else if (Array.isArray(response)) {
        // Direct array response
        setComplaints(response);
        setTotalPages(1);
      } else {
        console.warn("Unexpected response format:", response);
        setComplaints([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Fetch complaints error:", err);
      setError(err.response?.data?.message || "Failed to fetch complaints");
      setComplaints([]); // Ensure complaints is always an array
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !newStatus) {
      setError("Status harus dipilih");
      return;
    }

    try {
      console.log("Updating status:", {
        id: selectedComplaint.id,
        status: newStatus,
        note: statusNote,
      });

      // ✅ Perbaiki parameter sesuai dengan API backend
      const payload = {
        status: newStatus,
        message: statusNote || undefined,
      };

      console.log("Payload being sent:", payload);

      await complaintService.updateStatus(selectedComplaint.id, payload);

      setSuccess("Status updated successfully");
      setStatusDialog(false);
      setNewStatus("");
      setStatusNote("");
      fetchComplaints();
    } catch (err: any) {
      console.error("Update status error:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedComplaint || !uploadFile) {
      setError("File harus dipilih");
      return;
    }

    try {
      console.log("Uploading file:", {
        complaintId: selectedComplaint.id,
        fileName: uploadFile.name,
        currentStatus: selectedComplaint.status,
      });

      // ✅ Gunakan format object yang konsisten dengan handleStatusUpdate
      const payload = {
        status: selectedComplaint.status, // Keep current status
        message: undefined, // No message change for file upload
      };

      console.log("File upload payload:", payload);

      await complaintService.updateStatus(
        selectedComplaint.id,
        payload,
        undefined, // No notes parameter
        uploadFile // Upload file
      );

      setSuccess("Document uploaded successfully");
      setUploadDialog(false);
      setUploadFile(null);
      fetchComplaints();
    } catch (err: any) {
      console.error("File upload error:", err);
      setError(err.response?.data?.message || "Failed to upload document");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <Typography variant="h4" gutterBottom>
        Kelola Pengaduan
      </Typography>

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
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Semua</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reviewing">Reviewing</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="revision">Revision</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setStatusFilter("");
              setPage(1);
            }}
          >
            Reset Filter
          </Button>
        </Box>
      </Paper>

      {/* Complaints Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No. Registrasi</TableCell>
              <TableCell>Nama Pemohon</TableCell>
              <TableCell>Layanan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(complaints) && complaints.length > 0 ? (
              complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {complaint.registration_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {complaint.applicant_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{complaint.service?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.status.replace("_", " ").toUpperCase()}
                      color={statusColors[complaint.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(complaint.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Lihat Detail">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setDetailDialog(true);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Update Status">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setNewStatus(complaint.status);
                            setStatusNote(complaint.notes || "");
                            setStatusDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Upload Dokumen Hasil">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setUploadDialog(true);
                          }}
                        >
                          <UploadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {Array.isArray(complaints)
                      ? "Tidak ada pengaduan ditemukan"
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
        <DialogTitle>Detail Pengaduan</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedComplaint.applicant_name}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>No. Registrasi:</strong>{" "}
                {selectedComplaint.registration_number}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Layanan:</strong> {selectedComplaint.service?.name}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Deskripsi:</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedComplaint.description}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Status:</strong>{" "}
                <Chip
                  label={selectedComplaint.status
                    .replace("_", " ")
                    .toUpperCase()}
                  color={statusColors[selectedComplaint.status]}
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

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Update Status Pengaduan</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Box mb={2}>
              <Typography variant="body2">
                <strong>Pengaduan:</strong>{" "}
                {selectedComplaint.registration_number} -{" "}
                {selectedComplaint.applicant_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Status saat ini:</strong>{" "}
                <Chip
                  label={selectedComplaint.status
                    .replace("_", " ")
                    .toUpperCase()}
                  color={statusColors[selectedComplaint.status]}
                  size="small"
                />
              </Typography>
            </Box>
          )}

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status Baru</InputLabel>
            <Select
              value={newStatus}
              label="Status Baru"
              onChange={(e) => setNewStatus(e.target.value)}
              error={!newStatus}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reviewing">Reviewing</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="revision">Revision</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
            {!newStatus && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                Status harus dipilih
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Catatan (opsional)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            margin="normal"
            placeholder="Tambahkan catatan untuk pemohon..."
          />

          {/* Debug info */}
          <Box mt={2} p={1} bgcolor="#f5f5f5" borderRadius={1}>
            <Typography variant="caption" color="textSecondary">
              Debug: Status = "{newStatus}", Note length = {statusNote.length}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Batal</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={!newStatus}
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Dokumen Hasil</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Box mb={2}>
              <Typography variant="body2">
                <strong>Pengaduan:</strong>{" "}
                {selectedComplaint.registration_number} -{" "}
                {selectedComplaint.applicant_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Status:</strong>{" "}
                <Chip
                  label={selectedComplaint.status
                    .replace("_", " ")
                    .toUpperCase()}
                  color={statusColors[selectedComplaint.status]}
                  size="small"
                />
              </Typography>
            </Box>
          )}

          <Box mt={2}>
            <Typography variant="body2" gutterBottom>
              Pilih dokumen hasil yang akan diunggah:
            </Typography>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Typography
              variant="caption"
              display="block"
              mt={1}
              color="textSecondary"
            >
              Format yang didukung: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 2MB)
            </Typography>

            {uploadFile && (
              <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography variant="body2">
                  <strong>File dipilih:</strong> {uploadFile.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Ukuran: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            )}

            {/* Debug info */}
            <Box mt={2} p={1} bgcolor="#f0f0f0" borderRadius={1}>
              <Typography variant="caption" color="textSecondary">
                Debug: File selected = {uploadFile ? "Yes" : "No"}, Status = "
                {selectedComplaint?.status}"
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Batal</Button>
          <Button
            onClick={handleFileUpload}
            variant="contained"
            disabled={!uploadFile}
            color="primary"
          >
            Upload Dokumen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminComplaints;
