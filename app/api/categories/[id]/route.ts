import { auth } from "@/auth";
import prisma from "@/lib/client";
import { CATEGORY_SELECT_NO_PARENT } from "@/lib/constants";
import { categorySchema } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";

import { Property } from "@/types";
import { createProperties, removeProperties } from "../categoryUtils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const body: unknown = await request.json();
  const result = categorySchema.safeParse(body);
  if (!result.success) {
    let zodErrors = {};
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return NextResponse.json({ errors: zodErrors }, { status: 400 });
  }
  const id = (await params).id;
  const {
    name,
    parent,
    properties: propertiesData,
  } = categorySchema.parse(body);
  await removeProperties(id);
  const properties = createProperties(propertiesData as Property[]);
  await prisma.category.update({
    where: { id },
    data: { parent: { disconnect: true } },
  });
  let connect = {};
  if (parent && parent !== CATEGORY_SELECT_NO_PARENT) {
    connect = {
      connect: {
        id: parent,
      },
    };
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name, parent: connect, properties },
    include: { parent: true },
  });

  return NextResponse.json(updatedCategory);
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

  const category = await prisma.category.findUnique({ where: { id } });
  const count = await prisma.category.count({
    where: { parentId: category?.id },
  });

  if (count > 0) {
    return NextResponse.json(
      { message: "Can not delete a parent category with children" },
      { status: 400 },
    );
  }
  await removeProperties(id);
  const result = await prisma.category.delete({ where: { id } });

  return NextResponse.json(result);
}
