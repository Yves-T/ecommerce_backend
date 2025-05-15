import { auth } from "@/auth";
import prisma from "@/lib/client";
import { deleteUploads } from "@/lib/imagekit/imagekit";
import { newProductSchema } from "@/lib/schema";
import { NextResponse } from "next/server";
import { connectCategory, createImageConncetions } from "./productUtils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const data = await request.formData();
  const body = {
    name: data.get("name"),
    description: data.get("description"),
    price: data.get("price"),
    category: data.get("category"),
    productProperties: JSON.parse(data.get("properties") as string),
  };

  const result = newProductSchema.safeParse(body);

  if (!result.success) {
    let zodErrors = {};
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return NextResponse.json({ errors: zodErrors }, { status: 400 });
  }
  const { description, name, price, category, productProperties } =
    newProductSchema.parse(body);

  const newProduct = await prisma.product.create({
    data: {
      description,
      name,
      price,
      images: createImageConncetions(data),
      category: connectCategory(category),
      properties: productProperties,
    },
    include: { images: true, category: true },
  });

  const imagesWithoutRelation = await prisma.image.findMany({
    where: {
      uploadedBy: session.user?.id,
      productId: { not: { isSet: true } },
    },
  });

  await deleteUploads(imagesWithoutRelation.map((image) => image.imageId));

  await prisma.image.deleteMany({
    where: {
      uploadedBy: session.user?.id,
      productId: { not: { isSet: true } },
    },
  });
  return Response.json(newProduct);
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { images: true, category: true },
  });

  return Response.json(products);
}
