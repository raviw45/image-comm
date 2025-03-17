import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Voucher from "@/models/Voucher"; // ✅ Import Voucher model
import { IVoucher } from "@/types/product.types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

let razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    const {
      productId,
      variant,
      voucherAmount = 0,
      voucherId,
    } = await req.json();

    await connectToDatabase();

    // Ensure discount is not greater than the original price
    const discountedAmount = Math.max(variant?.price - voucherAmount, 0);

    // Check and update voucher usage
    if (voucherId) {
      const voucher = await Voucher.findById(voucherId);
      if (!voucher || voucher.voucherCount <= 0) {
        return NextResponse.json(
          { error: "Voucher has expired or is invalid." },
          { status: 400 }
        );
      }

      // Reduce voucher count
      voucher.voucherCount -= 1;
      await voucher.save();
    }

    // Create order with the correct discounted amount
    const order = await razorpay.orders.create({
      amount: Math.round(discountedAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId: productId.toString(),
      },
    });

    // Store order in database with correct amount
    const newOrder = await Order.create({
      userId: session.user.id,
      productId,
      variant,
      razorpayOrderId: order.id,
      amount: discountedAmount,
      voucherAmount,
      voucherId,
      status: "pending",
    });

    return NextResponse.json({
      orderId: order.id,
      finalPrice: discountedAmount,
      currency: order.currency,
      dbOrderId: newOrder._id,
    });
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
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
        },
        { status: 401 }
      );
    }
    await connectToDatabase();
    const orders = await Order.find({})
      .populate({
        path: "userId",
        select: "username email",
        options: { strictPopulate: false },
      })
      .populate({
        path: "productId",
        select: "name image",
        options: { strictPopulate: false },
      })
      .lean();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
