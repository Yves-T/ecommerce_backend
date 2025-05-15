import DeleteButton from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

const DeleteCell = ({
  getValue,
  row,
  table,
}: CellContext<Category, unknown>) => {
  const meta = table.options.meta;
  const initialValue = (getValue() as { children: number }) || [];

  const removeRow = () => {
    if (meta?.removeRow) {
      meta?.removeRow(row.index);
    }
  };

  return (
    <DeleteButton
      label={""}
      onDelete={removeRow}
      disabled={initialValue.children > 0}
    />
  );
};

const EditCell = ({ cell, table }: CellContext<Category, unknown>) => {
  const meta = table.options.meta;

  return (
    <div
      onClick={() => {
        const id = (cell.row.original as Category).id;
        if (meta && meta.editRow && id) {
          meta?.editRow(id);
        }
      }}
    >
      <Button size={"icon"} variant={"outline"}>
        <Pencil />
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (cell) => {
      const meta = cell.table.options.meta;

      return (
        <div
          onClick={() => {
            const id = (cell.row.original as Category).id;
            if (meta && meta.editRow && id) {
              meta?.editRow(id);
            }
          }}
        >
          {cell.getValue() as string}
        </div>
      );
    },
  },
  {
    accessorKey: "parent",
    header: "Parent category",
    cell: ({ row }) => {
      const parent: Category = row.getValue("parent");

      return <div>{parent?.name}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "Edit",
    cell: EditCell,
  },
  {
    accessorKey: "_count",
    header: "Delete",
    cell: DeleteCell,
  },
];
