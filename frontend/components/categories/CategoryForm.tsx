"use client";

import { useState, useEffect } from "react";
import {
  categoriesApi,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/lib/api/categories";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [color, setColor] = useState("#3b82f6");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setColor(category.color || "#3b82f6");
      setIcon(category.icon || "");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: CreateCategoryDto | UpdateCategoryDto = {
        name,
        type,
        color,
        icon: icon || undefined,
      };

      if (category) {
        await categoriesApi.update(category.id, data);
        toast.success("Category updated successfully");
      } else {
        await categoriesApi.create(data as CreateCategoryDto);
        toast.success("Category created successfully");
      }

      onSuccess();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-md shadow"
    >
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
        options={typeOptions}
        required
        className="relative"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-20"
        />
      </div>

      <Input
        label="Icon (Emoji)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        placeholder="💰"
      />

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
