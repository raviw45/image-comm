import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Voucher from "@/models/Voucher";
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

    const { name, voucherCount, code, discountAmount, expiryDate, isActive } =
      await req.json();

    if (!name || !voucherCount || !code || !discountAmount || !expiryDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const existingVoucher = await Voucher.findOne({ code });
    if (existingVoucher) {
      return NextResponse.json(
        { error: "Voucher already exists" },
        { status: 400 }
      );
    }

    const voucher = await Voucher.create({
      name,
      code,
      discountAmount,
      voucherCount,
      expiryDate,
      isActive,
    });

    return NextResponse.json(
      { message: "voucher created", voucher },
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
    await connectToDatabase();
    const vouchers = await Voucher.find({});
    return NextResponse.json(vouchers, { status: 200 });
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
    const voucherId = req.nextUrl?.searchParams?.get("id");
    if (!voucherId) {
      return NextResponse.json(
        { error: "voucher ID is required" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const existingVoucher = await Voucher.find({ id: voucherId });
    if (!existingVoucher) {
      return NextResponse.json({ error: "voucher not found" }, { status: 404 });
    }
    await Voucher.findByIdAndDelete(voucherId);
    return NextResponse.json(
      { message: "voucher deleted successfully" },
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
    const voucherId = req.nextUrl?.searchParams?.get("id");
    if (!voucherId) {
      return NextResponse.json(
        { error: "voucher ID is required" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const existingVoucher = await Voucher.findById(voucherId);
    if (!existingVoucher) {
      return NextResponse.json({ error: "voucher not found" }, { status: 404 });
    }
    const { name, voucherCount, code, discountAmount, expiryDate, isActive } =
      await req.json();
    existingVoucher.name = name;
    existingVoucher.voucherCount = voucherCount;
    existingVoucher.code = code;
    existingVoucher.discountAmount = discountAmount;
    existingVoucher.expiryDate = expiryDate;
    existingVoucher.isActive = isActive;
    await existingVoucher.save();
    return NextResponse.json(
      { message: "voucher updated successfully", voucher: existingVoucher },
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
