import { auth } from "@/auth";
import prisma from "@/lib/client";
import { deleteUploads } from "@/lib/imagekit/imagekit";
import { newProductSchema } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";
import { connectCategory, createImageConncetions } from "../productUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
  return Response.json(product);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
  const id = (await params).id;
  const { description, name, price, category, productProperties } =
    newProductSchema.parse(body);

  const updatedProduct = await prisma.product.update({
    where: { id },
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

  return Response.json(updatedProduct);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const id = (await params).id;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (product) {
    await prisma.image.deleteMany({
      where: {
        imageId: {
          in: product.images.map((img) => img.imageId),
        },
      },
    });

    await deleteUploads(product.images.map((image) => image.imageId));
  }

  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  return Response.json(deletedProduct);
}
