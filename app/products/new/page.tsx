"use client";
import ProductForm from "@/components/ProductForm";
import { useCreateProduct } from "@/hooks/products/useProducts";
import { useRedirectAfterMutation } from "@/hooks/redirect-hook";
import { TNewProductSchema } from "@/lib/schema";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";

const NewProductPage = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    redirect("/sign-in");
  }

  const createProductMutation = useCreateProduct();
  const handleCreateProductSubmit: SubmitHandler<TNewProductSchema> = (
    data,
  ) => {
    const { description, name, price, images, category, productProperties } =
      data;
    const formData = new FormData();
    formData.append("properties", JSON.stringify(productProperties));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category ?? "");
    formData.append("productImages", JSON.stringify(images));
    createProductMutation.mutate(formData);
  };

  useRedirectAfterMutation({
    mutation: createProductMutation,
    navigateTo: "/products",
  });

  useEffect(() => {
    if (createProductMutation.isSuccess) {
      redirect("/products");
    }
  }, [createProductMutation.isSuccess]);

  return (
    <div className="max-w-xs">
      <ProductForm
        submitHandler={handleCreateProductSubmit}
        isPending={createProductMutation.isPending}
      />
    </div>
  );
};

export default NewProductPage;
