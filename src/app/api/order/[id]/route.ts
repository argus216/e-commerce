import { Order, STATUS } from "@/models/Order";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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

        if (order.status === STATUS.CANCELLED) {
            return NextResponse.json(
                { message: "Order already cancelled", success: false },
                { status: 400 }
            );
        }

        order.status = STATUS.CANCELLED;
        await order.save();

        return NextResponse.json(
            { message: "Order cancelled", success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
