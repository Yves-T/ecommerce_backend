import { Product } from "@/types";
import { api } from "../api";

export const productApi = {
  getProducts: async () => {
    const { data } = await api.get<Product[]>("/products");
    return data;
  },

  getProduct: async (id: string) => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  updateProduct: async (id: string, product: FormData) => {
    const { data } = await api.patch(`/products/${id}`, product);
    return data;
  },

  createProduct: async (product: FormData) => {
    const { data } = await api.post("/products", product);
    return data;
  },

  deleteProduct: async (product: Product) => {
    const { data } = await api.delete(`/products/${product.id}`);
    return data;
  },
};
