import { productApi } from "@/lib/api/product/productApi";
import { Product } from "@/types";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const PRODUCT_KEY = "products";

export function useProducs() {
  return useQuery({
    queryKey: [PRODUCT_KEY],
    queryFn: () => productApi.getProducts(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [PRODUCT_KEY, id],
    queryFn: id ? () => productApi.getProduct(id) : skipToken,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: FormData) => productApi.createProduct(product),
    onError: () => {
      toast.error("Error creating a product");
    },
    onSuccess: () => {
      toast("Product created successfully");
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error("Error while creating a product", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
      }
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Product) => productApi.deleteProduct(product),
    onError: () => {
      toast.error("Error deleting a product");
    },
    onSuccess: async () => {
      toast("Product deleted successfully");
      await queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      productApi.updateProduct(id, data),
    onError: () => {
      toast.error("Error updating a product");
    },
    onSuccess: (data) => {
      toast("Product updated successfully");
      const product = data as Product;
      queryClient.setQueryData([PRODUCT_KEY, product.id], data);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error("Error while updating a product", error);
      }
    },
  });
}
