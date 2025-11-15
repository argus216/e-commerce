import { Seller } from "@/models/Seller";
import { dbConn } from "@/utils/db";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await dbConn();

        const seller = await Seller.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                image: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$user",
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
                                name: 1,
                                price: 1,
                                image: 1,
                                rating: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    products: 1,
                    createdAt: 1,
                    phone: 1,
                    address: 1,
                    rating: 1,
                },
            },
        ]);

        if (!seller || seller.length === 0) {
            return NextResponse.json(
                { message: "Seller not found", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Seller found", data: seller[0], success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
