import { CATEGORY_SELECT_NO_PARENT } from "@/lib/constants";
import { ProductImage } from "@/types";

export function createImageConncetions(data: FormData) {
  const formDataImages = data.get("productImages");
  const productImages = formDataImages
    ? (JSON.parse(formDataImages.toString()) as ProductImage[])
    : [];
  return productImages.length > 0
    ? {
        connect: productImages.map((productImages) => {
          return { id: productImages.id };
        }),
      }
    : {};
}

export function connectCategory(category: string | undefined) {
  if (category && category !== CATEGORY_SELECT_NO_PARENT) {
    return {
      connect: {
        id: category,
      },
    };
  }
  return {};
}
