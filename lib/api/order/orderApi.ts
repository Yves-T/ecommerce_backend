import { Order } from "@/types";
import { api } from "../api";

export const orderApi = {
  getOrders: async () => {
    const { data } = await api.get<Order[]>("/orders");
    return data;
  },
};
