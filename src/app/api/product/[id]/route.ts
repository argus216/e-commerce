import { Product } from "@/models/Product";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConn();
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Product ID is required" },
                { status: 400 }
            );
        }

        const product = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    description: 1,
                    rating: 1,
                    images: 1,
                    stock: 1,
                },
            },
        ]);

        if (!product || product.length === 0) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: product[0] },
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

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        await dbConn();

        const { id } = await params;

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found", success: false },
                { status: 404 }
            );
        }

        const data = await req.json();

        const dataSchema = z.object({
            name: z
                .string()
                .min(2, "Name must be at least 2 characters long")
                .optional(),
            price: z.string().min(2, "Price must be at least 1").optional(),
            description: z.string().optional(),
            stock: z.number().min(1, "Stock must be at least 1").optional(),
        });

        const validatedData = dataSchema.safeParse(data);
        if (!validatedData.success) {
            return NextResponse.json(
                { message: validatedData.error.message, success: false },
                { status: 400 }
            );
        }

        Object.keys(data).forEach((key) => {
            if (key === "_id") return;
            if ((product as any)[key] === data[key]) return;
            (product as any)[key] = data[key];
        });
        await product.save();

        return NextResponse.json(
            { message: "Product updated successfully", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error: error.message, success: false },
            { status: 500 }
        );
    }
}
