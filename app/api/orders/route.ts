import { auth } from "@/auth";
import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "asc" } });

  return Response.json(orders);
}
