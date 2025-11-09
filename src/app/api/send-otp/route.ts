import { User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { resend } from "@/utils/resend";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ _id: session.user._id });
        if (!user) {
            return NextResponse.json(
                { message: "User not found!", success: false },
                { status: 400 }
            );
        }

        const { email } = await req.json();

        const otp = Math.floor(1000 + Math.random() * 8999).toString();
        user.otp = otp;
        await user.save();

        const res = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email ?? user.email,
            subject: "Hello from Resend",
            html: "<h1>OTP: " + otp + "</h1>",
        });
        if (!res.data) {
            return NextResponse.json(
                { message: res.error.message, success: false },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "OTP sent successfully", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message, status: false },
            { status: 500 }
        );
    }
}
