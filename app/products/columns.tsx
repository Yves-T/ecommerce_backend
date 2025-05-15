import DeleteButton from "@/components/DeleteButton";
import { Product } from "@/types";
import { CellContext, ColumnDef } from "@tanstack/react-table";

const DeleteCell = ({
  getValue,
  row,
  table,
}: CellContext<Product, unknown>) => {
  const meta = table.options.meta;
  const initialValue = (getValue() as Product[]) || [];

  const removeRow = () => {
    if (meta?.removeRow) {
      meta?.removeRow(row.index);
    }
  };

  return (
    <DeleteButton
      label={""}
      onDelete={removeRow}
      disabled={initialValue.length > 0}
    />
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (cell) => {
      const meta = cell.table.options.meta;

      return (
        <div
          onClick={() => {
            const id = (cell.row.original as Product).id;
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
    accessorKey: "menuItems",
    header: "Delete",
    cell: DeleteCell,
  },
];
