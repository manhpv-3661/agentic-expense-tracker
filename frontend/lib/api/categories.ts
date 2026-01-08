import apiClient from "./client";

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: "income" | "expense";
  color?: string;
  icon?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: "income" | "expense";
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  type?: "income" | "expense";
  color?: string;
  icon?: string;
}

export const categoriesApi = {
  getAll: async (type?: "income" | "expense"): Promise<Category[]> => {
    const params = type ? { type } : {};
    const response = await apiClient.get("/categories", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
