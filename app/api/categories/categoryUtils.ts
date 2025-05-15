import prisma from "@/lib/client";
import { Property } from "@/types";

export function createProperties(properties: Property[]) {
  const collection = properties
    ? properties.map((item) => {
        return {
          name: item.name,
          values: item.values,
        };
      })
    : [];

  return collection.length === 0
    ? {}
    : {
        createMany: {
          data: collection,
        },
      };
}

export async function removeProperties(id: string) {
  const product = await prisma.category.findUnique({
    where: { id },
    include: { properties: true },
  });

  await bulkDeleteProperties(
    product?.properties.map((item) => item.id as string) || [],
  );
}

async function bulkDeleteProperties(ids: string[]) {
  return prisma.property.deleteMany({
    where: { id: { in: ids.map((id) => id.toString()) } },
  });
}
