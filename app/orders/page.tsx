"use client";
import { useOrders } from "@/hooks/orders/useOrders";
import { columns } from "./colums";
import { OrderDataTable } from "./data-table";

const OrderPage = () => {
  const { data } = useOrders();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>

      <div className="max-w-2xl pt-4">
        <OrderDataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
};

export default OrderPage;
