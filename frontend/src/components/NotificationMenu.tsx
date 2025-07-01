import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  notificationService,
  Notification,
} from "../services/notificationService";

const NotificationMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Fetch unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (!open) {
      fetchNotifications();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatNotificationMessage = (notification: Notification) => {
    const { type, data } = notification;

    if (type.includes("ComplaintCreated")) {
      return `Pengaduan Anda dengan nomor ${data.registration_number} telah berhasil diterima untuk layanan ${data.service_name}.`;
    }

    if (type.includes("ComplaintStatusChanged")) {
      return `Status pengaduan ${data.registration_number} telah diubah dari "${data.old_status}" menjadi "${data.new_status}".`;
    }

    return "Notifikasi baru";
  };

  const getStatusColor = (status: string) => {
    const colors: {
      [key: string]:
        | "default"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning";
    } = {
      pending: "warning",
      reviewing: "info",
      approved: "success",
      completed: "success",
      rejected: "error",
      revision: "warning",
    };
    return colors[status] || "default";
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: "auto",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Notifikasi</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              Tandai Semua Dibaca
            </Button>
          )}
        </Box>
        <Divider />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">Tidak ada notifikasi</Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                if (!notification.read_at) {
                  handleMarkAsRead(notification.id);
                }
              }}
              sx={{
                backgroundColor: notification.read_at
                  ? "transparent"
                  : "action.hover",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                whiteSpace: "normal",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mb: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.created_at).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Typography>
                {!notification.read_at && (
                  <Chip label="Baru" size="small" color="primary" />
                )}
              </Box>

              <Typography variant="body2" sx={{ mb: 1 }}>
                {formatNotificationMessage(notification)}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={notification.data.registration_number}
                  size="small"
                  variant="outlined"
                />
                {notification.data.new_status && (
                  <Chip
                    label={notification.data.new_status.toUpperCase()}
                    size="small"
                    color={getStatusColor(notification.data.new_status)}
                  />
                )}
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
