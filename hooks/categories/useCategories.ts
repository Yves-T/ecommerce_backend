import { categoryApi } from "@/lib/api/category/categoryApi";
import { Category } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const CATEGORY_KEY = "categories";

export function useCategories() {
  return useQuery({
    queryKey: [CATEGORY_KEY],
    queryFn: () => categoryApi.getCategories(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: { name: string; parent?: string }) =>
      categoryApi.createCategory(category),
    onError: () => {
      toast.error("Error creating a category");
    },
    onSuccess: () => {
      toast("Category created successfully");
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error("Error while creating a category", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
      }
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Category) => categoryApi.deleteCategory(product),
    onError: () => {
      toast.error("Error deleting a category");
    },
    onSuccess: async () => {
      toast("Category deleted successfully");
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      parent: string;
      properties: { name: string; values: string }[];
    }) => categoryApi.updateCategory(data),
    onError: () => {
      toast.error("Error updating a category");
    },
    onSuccess: () => {
      toast("Category updated successfully");
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error("Error while updating a category", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
      }
    },
  });
}
