import { Category } from "@/models/Category";
import { dbConn } from "@/utils/db";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Category ID is required" },
                { status: 400 }
            );
        }

        await dbConn();

        const products = await Category.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    _id: 1,
                    products: 1,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "_id",
                    as: "products",
                    pipeline: [
                        {
                            $addFields: {
                                image: {
                                    $first: "$images",
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                price: 1,
                                rating: 1,
                                image: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json(
            { success: true, data: products[0] },
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
