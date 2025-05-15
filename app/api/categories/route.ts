import { auth } from "@/auth";
import prisma from "@/lib/client";
import { CATEGORY_SELECT_NO_PARENT } from "@/lib/constants";
import { categorySchema } from "@/lib/schema";
import { Property } from "@/types";
import { NextResponse } from "next/server";
import { createProperties } from "./categoryUtils";

export async function POST(request: Request) {
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
  const {
    name,
    parent,
    properties: propertiesData,
  } = categorySchema.parse(body);

  const properties = createProperties(propertiesData as Property[]);

  let connect = {};
  if (parent && parent !== CATEGORY_SELECT_NO_PARENT) {
    connect = {
      connect: {
        id: parent,
      },
    };
  }

  const newCategory = await prisma.category.create({
    data: { name, parent: connect, properties },
    include: { parent: true, properties: true },
  });
  return Response.json(newCategory);
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    include: {
      properties: true,
      parent: true,
      _count: { select: { children: true } },
    },
  });

  return Response.json(categories);
}
