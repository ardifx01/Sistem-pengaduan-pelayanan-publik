import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminServices from "./pages/admin/AdminServices";
import AdminDashboard from "./pages/admin/Dashboard";
import ComplaintDetail from "./pages/ComplaintDetail";
import CreateComplaint from "./pages/CreateComplaint";
import Login from "./pages/Login";
import MyComplaints from "./pages/MyComplaints";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Services from "./pages/Services";
import TrackComplaint from "./pages/TrackComplaint";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<TrackComplaint />} />

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />

              <Route element={<ProtectedRoute />}>
                <Route path="complaints/create" element={<CreateComplaint />} />
                <Route path="complaints/my" element={<MyComplaints />} />
                <Route path="complaints/:id" element={<ComplaintDetail />} />
              </Route>

              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/complaints" element={<AdminComplaints />} />
                <Route path="admin/services" element={<AdminServices />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
