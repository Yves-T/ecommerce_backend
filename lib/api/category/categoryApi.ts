import { Category } from "@/types";
import { api } from "../api";

export const categoryApi = {
  getCategories: async () => {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },

  createCategory: async (category: { name: string; parent?: string }) => {
    const { data } = await api.post("/categories", category);
    return data;
  },

  updateCategory: async (categoryData: {
    id: string;
    name: string;
    parent: string;
    properties: { name: string; values: string }[];
  }) => {
    const { data } = await api.patch(
      `/categories/${categoryData.id}`,
      categoryData,
    );
    return data;
  },

  deleteCategory: async (category: Category) => {
    const { data } = await api.delete(`/categories/${category.id}`);
    return data;
  },
};
