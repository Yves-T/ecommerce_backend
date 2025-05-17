import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ColumnFiltersState } from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  columFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const Filters = ({ columFilters, setColumnFilters }: Props) => {
  const [columnId, setColumnId] = useState("recipient");
  const searchTerm =
    (columFilters.find((f) => f.id === columnId)?.value as string) || "";
  const onFilterChange = (id: string, value: string) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value }),
    );

  const switchPayStatus = (paidType: "paid" | "unpaid") => {
    setColumnFilters((prev) => {
      const paidStatuses = prev.find((filter) => filter.id === "paid");
      if (!paidStatuses) {
        return prev.concat({
          id: "paid",
          value: paidType,
        });
      }

      let condition = true;
      let value = "";
      switch (paidType) {
        case "paid":
          condition =
            paidStatuses.value === "unpaid" || paidStatuses.value === "both";
          value = paidStatuses.value === "unpaid" ? "both" : "unpaid";
          break;

        case "unpaid":
          condition =
            paidStatuses.value === "paid" || paidStatuses.value === "both";
          value = paidStatuses.value === "paid" ? "both" : "paid";
      }

      if (condition) {
        return prev.map((f) =>
          f.id === "paid"
            ? {
                ...f,
                value,
              }
            : f,
        );
      }

      return prev.filter((f) => f.id !== "paid");
    });
  };

  return (
    <div className="relative ml-2 flex items-center py-4">
      <Input
        placeholder={`Filter ${columnId}...`}
        value={searchTerm}
        onChange={(event) => {
          onFilterChange(columnId, event.target.value);
        }}
        className="max-w-sm rounded-md border border-gray-300 pr-4 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
      <Search
        className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
        size={20}
      />
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto capitalize">
              {
                columFilters.find((filter) => filter.id === "paid")
                  ?.value as string
              }
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={
                !!columFilters.find(
                  (filter) =>
                    filter.id === "paid" &&
                    (filter.value === "both" || filter.value === "paid"),
                )
              }
              onCheckedChange={() => switchPayStatus("paid")}
            >
              Paid
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={
                !!columFilters.find(
                  (filter) =>
                    filter.id === "paid" &&
                    (filter.value === "both" || filter.value === "unpaid"),
                )
              }
              onCheckedChange={() => switchPayStatus("unpaid")}
            >
              Unpaid
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mr-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={columnId === "recipient"}
              onCheckedChange={() => {
                setColumnFilters([]);
                setColumnId("recipient");
              }}
            >
              Recipient
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={columnId === "order"}
              onCheckedChange={() => {
                setColumnFilters([]);
                setColumnId("order");
              }}
            >
              Orders
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Filters;
