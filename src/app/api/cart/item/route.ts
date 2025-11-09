import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// PUT update item quantity in cart
export async function PUT(req: NextRequest) {
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
        const { productId, quantity } = body;

        if (!productId || quantity === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product ID and quantity are required",
                },
                { status: 400 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { success: false, message: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

        const cart = await Cart.findOne({ user: session.user._id });
        if (!cart) {
            return NextResponse.json(
                { success: false, message: "Cart not found" },
                { status: 404 }
            );
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, message: "Item not found in cart" },
                { status: 404 }
            );
        }

        // Verify product exists and check stock
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        if (product.stock < quantity) {
            return NextResponse.json(
                { success: false, message: "Insufficient stock" },
                { status: 400 }
            );
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate("items.product", "name price images rating stock");

        return NextResponse.json(
            {
                success: true,
                message: "Cart item updated",
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

// DELETE remove item from cart
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Login first!" },
                { status: 401 }
            );
        }

        await dbConn();

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { success: false, message: "Product ID is required" },
                { status: 400 }
            );
        }

        const cart = await Cart.findOne({ user: session.user._id });
        if (!cart) {
            return NextResponse.json(
                { success: false, message: "Cart not found" },
                { status: 404 }
            );
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate("items.product", "name price images rating stock");

        return NextResponse.json(
            {
                success: true,
                message: "Item removed from cart",
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
