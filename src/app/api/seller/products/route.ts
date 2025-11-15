import { Seller } from "@/models/Seller";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        await dbConn();

        const seller = await Seller.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(session.user._id),
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
                                image: 1,
                                price: 1,
                                rating: 1,
                                stock: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    products: 1,
                },
            },
        ]);
        if (!seller) {
            return NextResponse.json(
                { message: "You are not a seller!", success: false },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: "Products fetched successfully.",
                data: seller[0],
                success: true,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Server error", error, success: false },
            { status: 500 }
        );
    }
}
