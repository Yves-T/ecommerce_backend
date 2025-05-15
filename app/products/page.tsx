"use client";
import { Button } from "@/components/ui/button";
import { useDeleteProduct, useProducs } from "@/hooks/products/useProducts";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const ProductsPage = () => {
  const { data } = useProducs();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    redirect("/sign-in");
  }

  const deleteProductMutation = useDeleteProduct();
  const handleDeleteCategory = (index: number) => {
    if (data) {
      const product = data[index];
      deleteProductMutation.mutate(product);
    }
  };

  return (
    <div>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/products/new">Add new product</Link>
        </Button>
      </div>

      <div className="mt-8 max-w-xl">
        <DataTable
          columns={columns}
          data={data ?? []}
          deleteCategory={handleDeleteCategory}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
