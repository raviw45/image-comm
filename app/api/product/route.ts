import { ProductFormData } from "@/components/admin/CreateProductForm";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/schema/product.schema";
import { IProduct } from "@/types/product.types";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await req.formData();

    const bodyData = {
      name: body.get("name") as string,
      description: body.get("description") as string,
      image: body.get("image") as File,
      variants: body.get("variants"),
    };

    const parseResult = productSchema.safeParse(bodyData);

    if (!parseResult.success) {
      console.log(parseResult?.error.issues[0]);
      return NextResponse.json(
        { error: parseResult?.error.issues[0].message },
        { status: 403 }
      );
    }

    const imageBuffer = await fileToBuffer(parseResult?.data?.image as File);

    // // upload the image on the cloudinary
    const url = await cloudinaryUpload(imageBuffer, "image-comm");
    const cloudinary_url = url?.secure_url;

    const newProduct = await Product.create({
      ...parseResult.data,
      image: cloudinary_url,
    });
    console.log(newProduct);
    return NextResponse.json({ message: "Product Added!!" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
