import connectToDatabase from "@/lib/db";
import Voucher from "@/models/Voucher";
import { IVoucher } from "@/types/product.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const code = req?.nextUrl?.searchParams?.get("code");
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    await connectToDatabase();

    const voucher: IVoucher | null = await Voucher.findOne(
      { code },
      "isActive name discountAmount _id voucherCount"
    );

    if (!voucher) {
      return NextResponse.json(
        { error: "Voucher does not exist, try another one" },
        { status: 404 }
      );
    }

    if (!voucher.isActive) {
      return NextResponse.json(
        { error: "Voucher is expired, try another one" },
        { status: 410 }
      );
    }

    if (new Date(voucher.expiryDate) < new Date(Date.now())) {
      return NextResponse.json(
        { error: "Voucher is expired, try another one" },
        { status: 410 }
      );
    }

    if (voucher.voucherCount === 0) {
      return NextResponse.json(
        { error: "Voucher is not available. Please try another one.." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Voucher is valid and active", voucher },
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
