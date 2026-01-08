import apiClient from "./client";
import { Category } from "./categories";

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  type: "income" | "expense";
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface CreateTransactionDto {
  type: "income" | "expense";
  amount: number;
  date: string;
  categoryId: string;
  description?: string;
}

export interface UpdateTransactionDto {
  type?: "income" | "expense";
  amount?: number;
  date?: string;
  categoryId?: string;
  description?: string;
}

export interface FilterTransactionDto {
  type?: "income" | "expense";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const transactionsApi = {
  getAll: async (
    filters: FilterTransactionDto = {}
  ): Promise<TransactionListResponse> => {
    const response = await apiClient.get("/transactions", { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post("/transactions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateTransactionDto
  ): Promise<Transaction> => {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  exportCsv: async (filters: FilterTransactionDto = {}): Promise<string> => {
    const response = await apiClient.get("/transactions/export", {
      params: filters,
      responseType: "text",
    });
    return response.data;
  },
};
