import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineItem, Order } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "datetime",
    cell: ({ row }) => {
      const createdAt: string = row.getValue("createdAt");
      const orderDate = new Date(createdAt).toLocaleString();

      return <div>{orderDate}</div>;
    },
  },
  {
    accessorKey: "paid",
    header: "Paid",
    id: "paid",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) {
        return true;
      }
      if (filterValue === "both") {
        return true;
      }
      const paid: boolean = row.getValue("paid") as boolean;
      return filterValue === "paid" ? paid : !paid;
    },
    cell: ({ row }) => {
      const paid: boolean = row.getValue("paid") as boolean;
      return (
        <div className="text-center">
          {paid && <Badge className="bg-green-600">YES</Badge>}
          {!paid && <Badge variant="destructive">NO</Badge>}
        </div>
      );
    },
  },
  {
    header: "Recipient",
    id: "recipient",
    filterFn: (row, columnId, filterValue) => {
      const order: Order = row.original;
      const columnData = `${order.name} ${order.email} ${order.city} ${order.postalCode} ${order.country} ${order.streetAddress}`;
      return columnData.includes(filterValue);
    },
    cell: ({ row }) => {
      const order: Order = row.original;

      return (
        <div>
          {order.name} {order.email}
          <br />
          {order.city} {order.postalCode} {order.country} <br />
          {order.streetAddress}
        </div>
      );
    },
  },
  {
    header: "Order",
    id: "order",
    accessorKey: "line_items",
    filterFn: (row, columnId, filterValue) => {
      const orders: LineItem[] = row.getValue("order");
      const searchableData = orders
        ? orders
            .map((order) => `${order.price_data.product_data.name}`)
            .join("")
        : "";
      return searchableData.includes(filterValue);
    },
    cell: ({ row }) => {
      const orders: LineItem[] = row.getValue("order");

      return (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              {`${order?.price_data?.product_data?.name} x ${order?.quantity}`}
            </li>
          ))}
        </ul>
      );
    },
  },
];
