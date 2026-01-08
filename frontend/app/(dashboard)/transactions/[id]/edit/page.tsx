"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  transactionsApi,
  UpdateTransactionDto,
  Transaction,
} from "@/lib/api/transactions";
import { categoriesApi, Category } from "@/lib/api/categories";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { format } from "date-fns";

export default function EditTransactionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const loadTransaction = async () => {
    try {
      const data = await transactionsApi.getById(id);
      setTransaction(data);
      setType(data.type);
      setAmount(data.amount.toString());
      setDate(format(new Date(data.date), "yyyy-MM-dd"));
      setCategoryId(data.categoryId);
      setDescription(data.description || "");
    } catch (error: any) {
      toast.error("Failed to load transaction");
      console.error("Load transaction error:", error);
      router.push("/transactions");
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll(type);
      setCategories(data);
    } catch (error: any) {
      toast.error("Failed to load categories");
      console.error("Load categories error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: UpdateTransactionDto = {
        type,
        amount: parseFloat(amount),
        date,
        categoryId,
        description: description || undefined,
      };

      await transactionsApi.update(id, data);
      toast.success("Transaction updated successfully");
      router.push("/transactions");
    } catch (error: any) {
      toast.error("Failed to update transaction");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const typeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            options={typeOptions}
            required
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categoryOptions}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/transactions")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
