import { Order } from "@/models/Order";
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

        const orders = await Order.aggregate([
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(session.user._id),
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
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                image: 1,
                                price: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    user: {
                        $first: "$user",
                    },
                    product: {
                        $first: "$product",
                    },
                },
            },
            {
                $project: {
                    user: 1,
                    createdAt: 1,
                    product: 1,
                    coupen: 1,
                    quantity: 1,
                    status: 1,
                    paymentMethod: 1,
                },
            },
        ]);

        return NextResponse.json(
            {
                message: "Orders fetched successfully",
                data: orders,
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
