"use client";

import { useState, useEffect } from "react";
import {
  dashboardApi,
  DashboardSummary,
  TrendData,
  CategoryBreakdown,
} from "@/lib/api/dashboard";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, trendsData, breakdownData] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getTrends(period),
        dashboardApi.getCategoryBreakdown("expense"),
      ]);

      setSummary(summaryData);
      setTrends(trendsData);
      setCategoryBreakdown(breakdownData);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ${summary.totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">
              ${summary.totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Net Balance</p>
            <p
              className={`text-2xl font-bold ${
                summary.netBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${summary.netBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Transactions</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary.transactionCount}
            </p>
          </div>
        </div>
      )}

      {/* Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trends</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              name="Expense"
            />
            <Line type="monotone" dataKey="net" stroke="#3b82f6" name="Net" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Expense by Category</h2>
        {categoryBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) =>
                    `${entry.categoryName}: ${entry.percentage.toFixed(1)}%`
                  }
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {categoryBreakdown.map((item, index) => (
                <div
                  key={item.categoryId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{item.categoryName}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${item.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No expense data available
          </p>
        )}
      </div>
    </div>
  );
}
