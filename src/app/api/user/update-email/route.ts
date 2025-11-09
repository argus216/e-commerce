import { User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        const { email, otp } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Missing fields", success: false },
                { status: 400 }
            );
        }

        if (session.user.email === email) {
            return NextResponse.json(
                { message: "Matching Email", success: false },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with Email already exists", success: false },
                { status: 400 }
            );
        }

        const user = await User.findById(session.user._id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found!", success: false },
                { status: 400 }
            );
        }

        if (user.otp !== otp) {
            return NextResponse.json(
                { message: "Otp not valid", success: false },
                { status: 400 }
            );
        }

        user.email = email;
        await user.save();

        return NextResponse.json(
            { message: "", success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
