import { Badge } from "@/components/ui/badge";
import { LineItem, Order } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const createdAt: string = row.getValue("createdAt");
      const orderDate = new Date(createdAt).toLocaleString();

      return <div>{orderDate}</div>;
    },
  },
  {
    accessorKey: "paid",
    header: "Paid",
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
    accessorKey: "line_items",
    cell: ({ row }) => {
      const orders: LineItem[] = row.getValue("line_items");

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
