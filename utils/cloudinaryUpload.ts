"use server";

import cloudinary from "./cloudinary";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};
const cloudinaryUpload = async (
  base64File: string,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    cloudinary.uploader.upload(
      base64File,
      {
        resource_type: "image",
        folder: folder,
      },
      (error: any, result: any) => {
        if (error) {
          console.log(error);
          return reject("Error while uploading image to Cloudinary");
        }
        resolve(result as CloudinaryUploadResult);
      }
    );
  });
};

export default cloudinaryUpload;
