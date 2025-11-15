import { Order } from "@/models/Order";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        const { status } = await req.json();
        if (!status) {
            return NextResponse.json(
                { message: "Missing fields", success: false },
                { status: 400 }
            );
        }

        if (
            ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].indexOf(status) ===
            -1
        ) {
            return NextResponse.json(
                { message: "Invalid status", success: false },
                { status: 400 }
            );
        }

        if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        await dbConn();

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json(
                { message: "Order not found", success: false },
                { status: 404 }
            );
        }

        if (order.user.toString() !== session.user._id) {
            return NextResponse.json(
                { message: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        if (order.status === status) {
            return NextResponse.json(
                { message: "Status already updated", success: false },
                { status: 400 }
            );
        }
        order.status = status;

        await order.save();

        return NextResponse.json(
            { message: "Status updated", success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
