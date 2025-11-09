import { Cart } from "@/models/Cart";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

        const cart = await Cart.findOne({ user: session.user._id });
        if (!cart) {
            return NextResponse.json(
                { success: false, message: "Cart not found" },
                { status: 404 }
            );
        }

        cart.items = [];
        await cart.save();

        return NextResponse.json(
            {
                success: true,
                message: "Cart cleared",
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
