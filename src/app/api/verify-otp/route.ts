import { Seller } from "@/models/Seller";
import { User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { otp } = await req.json();
        if (otp.length !== 4)
            return NextResponse.json(
                { message: "Otp not valid", success: false },
                { status: 400 }
            );

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        const user = await User.findById(session.user._id);
        const seller = await Seller.findOne({ user: session.user._id });
        if (!user || !seller) {
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
        user.otp = "";
        seller.emailVerified = true;

        await user.save();
        await seller.save();

        return NextResponse.json(
            { message: "Verified", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
