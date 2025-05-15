import { orderApi } from "@/lib/api/order/orderApi";
import { useQuery } from "@tanstack/react-query";

export const ORDER_KEY = "orders";

export function useOrders() {
  return useQuery({
    queryKey: [ORDER_KEY],
    queryFn: () => orderApi.getOrders(),
  });
}
