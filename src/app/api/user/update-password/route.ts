import { User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        const { existingPassword, password } = await req.json();

        if (!existingPassword || !password) {
            return NextResponse.json(
                { message: "Missing fields", success: false },
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

        const passwordMatch = await bcrypt.compare(
            existingPassword,
            user.password
        );
        if (!passwordMatch) {
            return NextResponse.json(
                { message: "Incorrect password", success: false },
                { status: 400 }
            );
        }

        user.password = password;
        await user.save();

        return NextResponse.json(
            { message: "Password updated", success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
