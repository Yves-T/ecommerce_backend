"use client";
import DeleteButton from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/categories/useCategories";
import { CATEGORY_SELECT_NO_PARENT } from "@/lib/constants";
import { categorySchema, TCategorySchema } from "@/lib/schema";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { columns } from "./colums";
import { CategoryDataTable } from "./data-table";

const CategoriesPage = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    redirect("/sign-in");
  }

  const [editCategory, setIsEditCategory] = useState<Category | null>(null);
  const form = useForm<TCategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parent: CATEGORY_SELECT_NO_PARENT,
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    name: "properties",
    control,
  });

  const createCategoryMutation = useCreateCategory();

  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    setIsEditCategory(null);
    form.reset();
    remove();
  }, [
    form,
    updateCategoryMutation.isSuccess,
    createCategoryMutation.isSuccess,
    remove,
  ]);

  const handleCreateCategorySubmit: SubmitHandler<{
    name: string;
    parent?: string;
    properties?: { name: string; values: string }[];
  }> = (data) => {
    createCategoryMutation.mutate(data);
  };

  const handleUpdateCategorySubmit: SubmitHandler<{
    name: string;
    parent?: string;
    properties?: { name: string; values: string }[];
  }> = (data) => {
    updateCategoryMutation.mutate({
      id: editCategory?.id ?? "",
      name: data.name ?? "",
      parent: data.parent ?? "",
      properties: data.properties ?? [],
    });
  };

  const editRow = (id: string) => {
    const category = data?.find((category) => category.id === id);
    if (category) {
      form.setValue("name", category?.name ?? "");
      const parent = category?.parent
        ? category.parent.id
        : CATEGORY_SELECT_NO_PARENT;
      form.setValue("parent", parent);
      form.setValue("properties", category.properties);
      setIsEditCategory(category);
    }
  };

  const deleteCategoryMutation = useDeleteCategory();

  const handleDeleteCategory = (index: number) => {
    if (data) {
      const category = data[index];
      deleteCategoryMutation.mutate(category);
    }
  };

  const { data } = useCategories();

  return (
    <div>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Categories</h1>
      </div>

      <div className="max-w-xl">
        <Form {...form}>
          <form className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent category</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue={field.value}
                      onValueChange={(parent) => field.onChange(parent)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Parent category"
                          className="h-8 w-full"
                        ></SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value={CATEGORY_SELECT_NO_PARENT}>
                          No parent catogory
                        </SelectItem>
                        {data?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category?.id?.toString() || ""}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select a parent category</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 space-y-2">
                <div>
                  <FormField
                    control={form.control}
                    name={`properties.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property name</FormLabel>
                        <FormControl>
                          <Input placeholder="Property name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name={`properties.${index}.values`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property values (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="Property values" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <DeleteButton label={""} onDelete={() => remove(index)} />
                </div>
              </div>
            ))}

            <div className="text-center">
              <Button
                variant={"outline"}
                type="button"
                className="ms-2 bg-white"
                onClick={() => append({ name: "", values: "" })}
              >
                <CirclePlus />
                Add property
              </Button>
            </div>
          </form>
        </Form>
        <Button
          disabled={createCategoryMutation.isPending}
          onClick={() => {
            if (!!editCategory) {
              form.handleSubmit(handleUpdateCategorySubmit)();
            } else {
              form.handleSubmit(handleCreateCategorySubmit)();
            }
          }}
          className="text mt-4"
        >
          {!!editCategory ? "Edit" : "Submit"}
          {createCategoryMutation.isPending && (
            <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </div>
      {!editCategory && (
        <div className="max-w-2xl pt-4">
          <CategoryDataTable
            columns={columns}
            data={data ?? []}
            editRow={editRow}
            removeRow={handleDeleteCategory}
          />
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
