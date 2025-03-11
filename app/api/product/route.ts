import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { productSchema } from "@/schema/product.schema";
import cloudinaryDelete from "@/utils/cloudinaryDelete";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    const body = await req.json();
    const parseResult = productSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult?.error.issues[0].message },
        { status: 403 }
      );
    }
    const newProduct = await Product.create({ ...parseResult.data });
    return NextResponse.json(
      { message: "Product Added!!", newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const productId = req?.nextUrl?.searchParams?.get("id");
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    }
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }
    await connectToDatabase();
    const productId = req?.nextUrl?.searchParams?.get("id");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // Delete Image from cloudinary
    if (product.image) {
      await cloudinaryDelete(product?.image);
    }

    await Product.findByIdAndDelete(productId);

    // Remove product from all carts
    await Cart.deleteMany({ productId });
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const variants = body.variants;
    const productId = req?.nextUrl?.searchParams?.get("id");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // update product
    if (product.variants.length <= 1) {
      return NextResponse.json(
        { error: "At least one variant is required" },
        { status: 403 }
      );
    }
    product.variants = variants;
    await product.save();

    return NextResponse.json(
      { error: "Image variant deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
