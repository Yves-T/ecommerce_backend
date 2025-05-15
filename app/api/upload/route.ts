import { auth } from "@/auth";
import prisma from "@/lib/client";
import { uploadFiles } from "@/lib/imagekit/imagekit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const data = await request.formData();
  const uploadedFiles = data.getAll("fileToUpload[]") as File[];

  const imageKitResponses = await uploadFiles(uploadedFiles);
  const images = imageKitResponses.map((response) => {
    return {
      imageUrl: response.url,
      imageId: response.fileId,
      uploadedBy: session?.user?.id || "",
    };
  });

  await prisma.image.createMany({
    data: images,
  });

  return Response.json(
    await prisma.image.findMany({
      where: { imageId: { in: images.map((img) => img.imageId) } },
    }),
  );
}
