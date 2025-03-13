import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    const { productId, variant } = await req.json();
    const { type, price, license } = variant;

    await connectToDatabase();

    const existingCartItem = await Cart.findOne({
      userId: session?.user?.id,
      productId,
      variant: { type, price, license },
    });

    if (existingCartItem) {
      return NextResponse.json(
        { error: "Product with this variant already exists in the cart" },
        { status: 400 }
      );
    }
    console.log(session);

    const newCartItem = await Cart.create({
      userId: session?.user?.id,
      productId,
      variant,
    });

    return NextResponse.json(
      { message: "Item added to cart", newCartItem },
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    let cartItems = await Cart.find({ userId: session?.user?.id })
      .populate({
        path: "productId",
        select: "name image description ",
        options: { strictPopulate: false },
        model: Product,
      })
      .lean();
    // Filter out cart items where productId is null (product was deleted)
    cartItems = cartItems.filter((item) => item.productId !== null);
    return NextResponse.json(cartItems, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }
    const productId = req.nextUrl.searchParams.get("id");
    const existingProduct = await Cart.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found in cart" },
        { status: 404 }
      );
    }
    await Cart.findByIdAndDelete(productId);
    return NextResponse.json(
      { message: "Product removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
