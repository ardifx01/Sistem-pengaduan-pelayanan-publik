import api from "./api";

export interface Service {
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

export const serviceService = {
  async getAll(params?: { category?: string; search?: string; page?: number }) {
    const response = await api.get("/services", { params });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async create(data: Omit<Service, "id" | "created_at" | "updated_at">) {
    const response = await api.post("/services", data);
    return response.data;
  },

  async update(id: number, data: Partial<Service>) {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get("/services-categories");
    return response.data;
  },
};
