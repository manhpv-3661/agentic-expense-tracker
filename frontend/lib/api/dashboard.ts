import apiClient from "./client";

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface TrendData {
  period: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export const dashboardApi = {
  getSummary: async (
    startDate?: string,
    endDate?: string
  ): Promise<DashboardSummary> => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get("/dashboard/summary", { params });
    return response.data;
  },

  getTrends: async (
    period: "daily" | "weekly" | "monthly" = "monthly"
  ): Promise<TrendData[]> => {
    const response = await apiClient.get("/dashboard/trends", {
      params: { period },
    });
    return response.data;
  },

  getCategoryBreakdown: async (
    type?: "income" | "expense"
  ): Promise<CategoryBreakdown[]> => {
    const params = type ? { type } : {};
    const response = await apiClient.get("/dashboard/category-breakdown", {
      params,
    });
    return response.data;
  },
};
