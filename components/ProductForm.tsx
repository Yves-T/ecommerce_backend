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
import { Textarea } from "@/components/ui/textarea";
import {
  newProductSchema,
  TNewProductSchema,
  uploadSchema,
} from "@/lib/schema";

import { Progress } from "@/components/ui/progress";
import { Product, ProductImage } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/categories/useCategories";
import { CATEGORY_SELECT_NO_PARENT } from "@/lib/constants";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Dropzone from "shadcn-dropzone";
import { SortableItem } from "./SortableItem";

type Props = {
  product?: Product;
  isPending: boolean;
  submitHandler: SubmitHandler<TNewProductSchema>;
};

const ProductForm = ({ isPending, submitHandler, product }: Props) => {
  const [productProperties, setProductProperties] = useState<{
    [key: string]: string;
  }>(product?.properties || {});
  const [zodErros, setZodErrors] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(new Date().getTime());
  const [uploadedImages, setUploadedImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setUploadedImages((items) => {
        const oldIndex = uploadedImages.findIndex(
          (img) => img.id === active.id,
        );
        const newIndex = uploadedImages.findIndex((img) => img.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const form = useForm<TNewProductSchema>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
    },
  });

  const { reset, setValue } = form;

  useEffect(() => {
    if (product) {
      reset();
      setValue("name", product.name!);
      setValue("description", product.description!);
      setValue("price", product.price!);
      setValue("category", product.category?.id);
      if (product.properties) {
        setProductProperties(product.properties);
      }
      setRefresh(new Date().getTime());
      if (product.images) {
        setUploadedImages(product.images);
      }
    }
  }, [product, reset, setValue]);

  const { data: categoryData, isFetched } = useCategories();

  function setProductProp(propName: string, value: string) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (
    isFetched &&
    form.getValues("category") &&
    categoryData &&
    categoryData.length > 0
  ) {
    let selectedCatInfo = categoryData.find(
      ({ id }) => id === form.watch("category"),
    );
    if (selectedCatInfo?.properties) {
      propertiesToFill.push(...selectedCatInfo?.properties);
      while (selectedCatInfo?.parent?.id) {
        const parentCategory = categoryData.find(
          ({ id }) => id === selectedCatInfo?.parent?.id,
        );
        if (parentCategory?.properties) {
          propertiesToFill.push(...parentCategory?.properties);
          selectedCatInfo = parentCategory;
        }
      }
    }
  }

  return (
    <div>
      <div className="max-w-xs">
        <Form {...form}>
          <form className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      key={refresh}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      {/* <Select
                    {...field}
                    defaultValue={field.value}
                    onValueChange={(parent) => field.onChange(parent)}
                    > */}
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Product category"
                          className="h-8 w-full"
                        ></SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value={CATEGORY_SELECT_NO_PARENT}>
                          No product catogory
                        </SelectItem>
                        {categoryData?.map((category) => (
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
                  <FormDescription>Select a product category</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Product description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Dropzone
              onDrop={async (acceptedFiles: File[]) => {
                const result = uploadSchema.safeParse({
                  images: acceptedFiles,
                });
                if (result.success) {
                  setZodErrors([]);
                  const formData = new FormData();
                  acceptedFiles?.forEach((file) => {
                    formData.append("fileToUpload[]", file as unknown as File);
                  });
                  setIsUploading(true);
                  const response = await axios.post("/api/upload", formData, {
                    onUploadProgress: (progressEvent) => {
                      if (progressEvent && progressEvent.total) {
                        setProgress(
                          Math.round(progressEvent.loaded * 100) /
                            progressEvent.total,
                        );
                      }
                    },
                  });
                  setUploadedImages((oldImages) => {
                    return [...oldImages, ...response.data];
                  });

                  setIsUploading(false);
                } else {
                  const errors: string[] = [];
                  result.error.issues.forEach((issue) => {
                    errors.push(issue.message);
                  });
                  setZodErrors(errors);
                }
              }}
            />

            {zodErros && zodErros.length > 0 && (
              <ul>
                {zodErros.map((error, index) => (
                  <li key={index} className="text-sm text-red-500">
                    {error}
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-2 flex flex-wrap gap-1">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={uploadedImages}
                  strategy={horizontalListSortingStrategy}
                >
                  {!!uploadedImages?.length &&
                    uploadedImages.map((image) => (
                      <SortableItem
                        key={image.id}
                        id={image.id!}
                        imageUrl={image.imageUrl}
                      />
                    ))}
                </SortableContext>
              </DndContext>

              {isUploading && (
                <div className="flex h-24 items-center justify-center">
                  <ReloadIcon className="ml-2 animate-spin" />
                </div>
              )}

              {isUploading && <Progress value={progress} className="my-2" />}
            </div>

            {propertiesToFill.length > 0 &&
              propertiesToFill.map((p, index) => (
                <div key={p.name} className="flex flex-col gap-1">
                  <div key={index}>{p.name}</div>
                  <Select
                    key={refresh}
                    onValueChange={(ev) => {
                      setProductProp(p.name, ev);
                    }}
                    value={productProperties[p.name]}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={p.name}
                        className="h-8 w-full capitalize"
                      ></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {p.values.split(",").map((v, index) => (
                        <SelectItem value={v} key={index}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button
          disabled={isPending}
          onClick={form.handleSubmit((data) => {
            submitHandler({
              ...data,
              images: uploadedImages,
              productProperties,
            });
          })}
          className="text mt-4"
        >
          {product ? "Edit product" : "Save product"}
          {isPending && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
