import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET cart for logged-in user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Login first!" },
                { status: 401 }
            );
        }

        await dbConn();

        let cart: any = await Cart.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(session.user._id),
                },
            },
            {
                $unwind: {
                    path: "$items",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    items: 1,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "items.productDetails",
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
                                rating: 1,
                                image: 1,
                                stock: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$items.productDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    items: {
                        $push: {
                            $cond: [
                                { $gt: ["$items.productDetails", null] }, // only push if productDetails exists
                                {
                                    product: "$items.productDetails",
                                    quantity: "$items.quantity",
                                },
                                "$$REMOVE", // remove null/empty objects
                            ],
                        },
                    },
                },
            },
        ]);

        if (!cart || cart.length === 0) {
            cart = await Cart.create({
                user: session.user._id,
                items: [],
            });
        }

        return NextResponse.json(
            {
                success: true,
                data: cart[0],
                message: "Cart fetched successfully",
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

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Login first!" },
                { status: 401 }
            );
        }

        await dbConn();

        const body = await req.json();
        const { productId, quantity = 1 } = body;

        if (!productId) {
            return NextResponse.json(
                { success: false, message: "Product ID is required" },
                { status: 400 }
            );
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        // Check if product is in stock
        if (product.stock < quantity) {
            return NextResponse.json(
                { success: false, message: "Insufficient stock" },
                { status: 400 }
            );
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: session.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: session.user._id,
                items: [],
            });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            const newQuantity =
                cart.items[existingItemIndex].quantity + quantity;
            if (newQuantity > product.stock) {
                return NextResponse.json(
                    { success: false, message: "Insufficient stock" },
                    { status: 400 }
                );
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            cart.items.push({
                product: productId as any,
                quantity,
            });
        }

        await cart.save();

        return NextResponse.json(
            {
                success: true,
                message: "Item added to cart",
                data: cart,
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
