import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    await connectToDatabase();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment?.order_id },
        { razorpayPaymentId: payment?.id, status: "completed" }
      ).populate([
        { path: "userId", select: "email" },
        { path: "productId", select: "name" },
      ]);

      // Send email only after payment is confirmed
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: order?.userId?.email,
        subject: "Payment Confirmation - mediaStock Shop",
        text: `
        Thank you for your purchase!

        Order Details:
        - Order ID: ${order._id.toString().slice(-6)}
        - Product: ${order.productId.name}
        - Version: ${order.variant.type}
        - License: ${order.variant.license}
        - Price: Rs.${order.amount.toFixed(2)}

        Your image is now available in your orders page.
        Thank you for shopping with ImageKit Shop!
                  `.trim(),
      });
    }
    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.log("mail error -------", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
