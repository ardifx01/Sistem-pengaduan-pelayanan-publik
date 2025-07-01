import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  nik: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  job?: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  nik: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  job?: string;
  role: "user" | "admin";
  is_active: boolean;
  email_verified_at?: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post("/login", data);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post("/register", data);
    return response.data;
  },

  async logout() {
    const response = await api.post("/logout");
    return response.data;
  },

  async verifyEmail(email: string, token: string) {
    const response = await api.post("/verify-email", { email, token });
    return response.data;
  },

  async resendVerification(email: string) {
    const response = await api.post("/resend-verification", { email });
    return response.data;
  },

  async updateProfile(data: Partial<User>) {
    const response = await api.put("/user/profile", data);
    return response.data;
  },

  async updatePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const response = await api.put("/user/password", {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
    return response.data;
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  setAuth(token: string, user: User) {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },
};
