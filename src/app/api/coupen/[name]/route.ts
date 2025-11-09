import { Coupon } from "@/models/Coupen";
import { dbConn } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;
        await dbConn();

        const coupen = await Coupon.findOne({ code: name.toUpperCase() });
        if (!coupen) {
            return NextResponse.json(
                { message: "Coupon not found", success: false },
                { status: 404 }
            );
        }

        if (coupen.usedCount >= coupen.usageLimit && coupen.usageLimit !== 0) {
            return NextResponse.json(
                { message: "Coupon limit reached", success: false },
                { status: 400 }
            );
        }

        if (coupen.expiryDate < new Date()) {
            return NextResponse.json(
                { message: "Coupon expired", success: false },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: "Coupen applied.",
                data: {
                    code: coupen.code,
                    discount: coupen.discount,
                    minPurchase: coupen.minPurchase,
                    maxDiscount: coupen.maxDiscount,
                },
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
