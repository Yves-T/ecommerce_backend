import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    deleteCategory?: (rowIndex: number) => void;
    removeRow?: (rowIndex: number) => void;
    editRow?: (id: string) => void;
  }
}
