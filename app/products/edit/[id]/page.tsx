"use client";
import ProductForm from "@/components/ProductForm";
import { useProduct, useUpdateProduct } from "@/hooks/products/useProducts";
import { useRedirectAfterMutation } from "@/hooks/redirect-hook";
import { TNewProductSchema } from "@/lib/schema";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    redirect("/sign-in");
  }

  const { data } = useProduct(id);

  const updateMutation = useUpdateProduct();

  useRedirectAfterMutation({
    mutation: updateMutation,
    navigateTo: "/products",
  });

  const handleCreateProductSubmit: SubmitHandler<TNewProductSchema> = (
    submittedData,
  ) => {
    const { description, name, price, images, category, productProperties } =
      submittedData;
    const formData = new FormData();
    formData.append("properties", JSON.stringify(productProperties));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category ?? "");
    formData.append("productImages", JSON.stringify(images));
    updateMutation.mutate({ data: formData, id });
  };

  return (
    <div>
      <ProductForm
        submitHandler={handleCreateProductSubmit}
        isPending={updateMutation.isPending}
        product={data}
      />
    </div>
  );
};

export default EditProductPage;
