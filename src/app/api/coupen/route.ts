import { Coupon } from "@/models/Coupen";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/models/User";

// GET all coupons
export async function GET() {
    try {
        await dbConn();

        const coupons = await Coupon.find()
            .sort({ createdAt: -1 })
            .select("-__v");

        return NextResponse.json(
            {
                success: true,
                data: coupons,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: error?.message || "Server error" },
            { status: 500 }
        );
    }
}

// POST create coupon (Admin only)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Login first!" },
                { status: 401 }
            );
        }

        // Check if user is admin
        if (session.user.role !== Role.ADMIN) {
            return NextResponse.json(
                { success: false, message: "Admin access required!" },
                { status: 403 }
            );
        }

        await dbConn();

        const body = await req.json();
        const {
            code,
            discount,
            minPurchase,
            maxDiscount,
            expiryDate,
            isActive = true,
            usageLimit,
        } = body;

        // Validate required fields
        if (!code || !discount || !expiryDate) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Code, discount, and expiry date are required",
                },
                { status: 400 }
            );
        }

        // Validate discount range
        if (discount < 0 || discount > 100) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Discount must be between 0 and 100",
                },
                { status: 400 }
            );
        }

        // Validate expiry date
        const expiry = new Date(expiryDate);
        if (expiry < new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Expiry date must be in the future",
                },
                { status: 400 }
            );
        }

        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase().trim(),
        });
        if (existingCoupon) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon code already exists",
                },
                { status: 400 }
            );
        }

        // Create coupon
        const coupon = await Coupon.create({
            code: code.toUpperCase().trim(),
            discount,
            minPurchase: minPurchase || 0,
            maxDiscount: maxDiscount || undefined,
            expiryDate: expiry,
            isActive,
            usageLimit: usageLimit || undefined,
            usedCount: 0,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Coupon created successfully",
                data: coupon,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);
        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Coupon code already exists",
                },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error?.message || "Server error" },
            { status: 500 }
        );
    }
}
