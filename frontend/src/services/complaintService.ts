import api from "./api";

export interface Complaint {
  id: number;
  registration_number: string;
  user_id: number;
  service_id: number;
  applicant_name: string;
  applicant_nik: string;
  applicant_address: string;
  applicant_phone?: string;
  applicant_job?: string;
  applicant_birth_date?: string;
  description?: string;
  status:
    | "pending"
    | "reviewing"
    | "approved"
    | "revision"
    | "completed"
    | "rejected";
  notes?: string;
  result_document?: string;
  created_at: string;
  updated_at: string;
  service?: any;
  user?: any;
  documents?: ComplaintDocument[];
  statusHistories?: ComplaintStatusHistory[];
}

export interface ComplaintDocument {
  id: number;
  complaint_id: number;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size?: string;
  created_at: string;
}

export interface ComplaintStatusHistory {
  id: number;
  complaint_id: number;
  status: string;
  notes?: string;
  user_id: number;
  created_at: string;
  user?: any;
}

export interface CreateComplaintData {
  service_id: number;
  applicant_name: string;
  applicant_nik: string;
  applicant_address: string;
  applicant_phone?: string;
  applicant_job?: string;
  applicant_birth_date?: string;
  description?: string;
  documents?: File[];
}

export const complaintService = {
  async getAll(params?: {
    status?: string;
    service_id?: number;
    search?: string;
    page?: number;
  }) {
    const response = await api.get("/complaints", { params });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  async create(data: CreateComplaintData) {
    const formData = new FormData();

    // Add basic fields
    Object.keys(data).forEach((key) => {
      if (key !== "documents" && data[key as keyof CreateComplaintData]) {
        formData.append(key, data[key as keyof CreateComplaintData] as string);
      }
    });

    // Add documents
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach((file, index) => {
        formData.append(`documents[${index}]`, file);
      });
    }

    const response = await api.post("/complaints", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateStatus(
    id: number,
    status: string,
    notes?: string,
    resultDocument?: File
  ) {
    const formData = new FormData();
    formData.append("status", status);
    if (notes) formData.append("notes", notes);
    if (resultDocument) formData.append("result_document", resultDocument);

    const response = await api.put(`/complaints/${id}/status`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async track(registrationNumber: string) {
    const response = await api.post("/complaints/track", {
      registration_number: registrationNumber,
    });
    return response.data;
  },

  async getStatistics() {
    const response = await api.get("/complaints-statistics");
    return response.data;
  },

  async downloadDocument(complaintId: number, documentId: number) {
    const response = await api.get(
      `/complaints/${complaintId}/documents/${documentId}/download`,
      {
        responseType: "blob",
      }
    );
    return response;
  },

  async downloadResult(complaintId: number) {
    const response = await api.get(
      `/complaints/${complaintId}/result/download`,
      {
        responseType: "blob",
      }
    );
    return response;
  },
};
