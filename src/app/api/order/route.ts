import { Cart } from "@/models/Cart";
import { Coupon } from "@/models/Coupen";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        await dbConn();

        const orders = await Order.find({
            user: session.user._id,
        }).sort({ createdAt: -1 });

        return NextResponse.json(
            {
                data: orders,
                message: "Orders fetched successfully.",
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong", success: false },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        await dbConn();

        const body = await req.json();
        const { shippingAddress, paymentMethod, coupen, totalPrice } = body;

        if (!paymentMethod) {
            return NextResponse.json(
                { message: "Payment method is required", success: false },
                { status: 400 }
            );
        }

        if (!totalPrice) {
            return NextResponse.json(
                { message: "Total price is required", success: false },
                { status: 400 }
            );
        }

        if (!shippingAddress) {
            return NextResponse.json(
                { message: "Shipping address is required", success: false },
                { status: 400 }
            );
        }

        const cart = await Cart.findOne({ user: session.user._id });
        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found", success: false },
                { status: 404 }
            );
        }

        if (cart.items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty", success: false },
                { status: 400 }
            );
        }

        if (coupen !== null) {
            const coupenObj = await Coupon.findOne({ code: coupen });
            if (!coupenObj) {
                return NextResponse.json(
                    { message: "Coupon not found", success: false },
                    { status: 404 }
                );
            }
            if (
                coupenObj.usageLimit !== 0 &&
                coupenObj.usedCount >= coupenObj.usageLimit
            ) {
                return NextResponse.json(
                    { message: "Coupon limit reached", success: false },
                    { status: 400 }
                );
            }

            if (coupenObj.expiryDate < new Date()) {
                return NextResponse.json(
                    { message: "Coupon expired", success: false },
                    { status: 400 }
                );
            }

            if (coupenObj.minPurchase > totalPrice) {
                return NextResponse.json(
                    { message: "Minimum purchase not met", success: false },
                    { status: 400 }
                );
            }

            coupenObj.usedCount += 1;
            await coupenObj.save();
        }

        cart.items.forEach(async (item) => {
            const product = await Product.aggregate([
                {
                    $match: {
                        _id: item.product._id,
                    },
                },
                {
                    $lookup: {
                        from: "sellers",
                        localField: "seller",
                        foreignField: "_id",
                        as: "res",
                    },
                },
                {
                    $addFields: {
                        seller: {
                            $first: "$res",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "seller.user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $addFields: {
                        user: {
                            $first: "$user",
                        },
                    },
                },
            ]);
            if (!product) {
                return NextResponse.json(
                    { message: "Product not found", success: false },
                    { status: 404 }
                );
            }

            await Order.create({
                user: session.user._id,
                seller: product[0].user._id,
                product: item.product._id,
                quantity: item.quantity || 1,
                shippingAddress,
                paymentMethod,
                coupen,
            });
        });

        cart.items = [];
        await cart.save();

        return NextResponse.json(
            { message: "Order Placed Successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
