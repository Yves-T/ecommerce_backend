import Imagekit from "imagekit";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import IKResponse from "imagekit/dist/libs/interfaces/IKResponse";
import uniqid from "uniqid";

export function getImageKit() {
  return new Imagekit({
    publicKey: process.env.IK_PUBLIC_KEY!,
    privateKey: process.env.IK_PRIVATE_KEY!,
    urlEndpoint: process.env.IK_URL_ENDPOINT!,
  });
}

export async function uploadFiles(files: File[]) {
  const promises: Promise<IKResponse<UploadResponse>>[] = files.map(
    async (file) => {
      const imagekit = getImageKit();
      const extension = file.name.split(".").slice(-11)[0];
      const newFileName = uniqid() + "." + extension;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return imagekit.upload({
        file: buffer,
        fileName: newFileName,
        folder: "ecommerce/products",
      });
    },
  );

  return await Promise.all(promises);
}

export async function deleteUploads(ids: string[]) {
  const imagekit = getImageKit();
  const promises = ids.map(async (id) => imagekit.deleteFile(id));

  const result = await Promise.all(promises);
  return result;
}
