import React from "react";
import { Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationMenu from "./NotificationMenu";

const Layout: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Pelayanan Publik Badung
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" onClick={() => navigate("/")}>
              Beranda
            </Button>
            <Button color="inherit" onClick={() => navigate("/services")}>
              Layanan
            </Button>
            <Button color="inherit" onClick={() => navigate("/track")}>
              Tracking
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/complaints/my")}
                >
                  Pengaduan Saya
                </Button>
                {isAdmin && (
                  <Button color="inherit" onClick={() => navigate("/admin")}>
                    Admin
                  </Button>
                )}
                <NotificationMenu />
                <Button color="inherit" onClick={handleLogout}>
                  Logout ({user?.name})
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate("/register")}>
                  Daftar
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      <Box sx={{ bgcolor: "primary.main", color: "white", p: 2, mt: "auto" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2025 Pemerintah Kabupaten Badung. Sistem Pengaduan Pelayanan
            Publik.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
