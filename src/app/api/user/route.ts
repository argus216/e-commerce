import { User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        const data = await req.json();

        const user = await User.findById(session.user._id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found!", success: false },
                { status: 404 }
            );
        }

        Object.keys(data).forEach((key) => {
            (user as any)[key] = data[key];
        });
        await user.save();

        return NextResponse.json(
            { message: "Data updated.", success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
