import { Seller } from "@/models/Seller";
import { Role, User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!" },
                { status: 400 }
            );
        }

        await dbConn();

        const seller = await Seller.findOne({ user: session.user._id });
        if (!seller) {
            return NextResponse.json(
                {
                    message: "You are not a seller!",
                    success: false,
                    type: "not_existing",
                },
                { status: 400 }
            );
        }
        return NextResponse.json(
            {
                message: "Success",
                success: true,
                user: {
                    emailVerified: seller.emailVerified,
                    filledDetails: seller.filledDetails,
                    description: seller.description,
                    rating: seller.rating,
                    address: seller.address,
                    phone: seller.phone,
                    ...session.user,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error: error.message, success: false },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!" },
                { status: 400 }
            );
        }

        await dbConn();

        const seller = await Seller.findOne({ user: session.user._id });
        if (seller) {
            return NextResponse.json(
                {
                    message: "You are already a seller!",
                    success: false,
                },
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

        user.role = Role.SELLER;
        await user.save();

        await Seller.create({ user: session.user._id });
        return NextResponse.json(
            { message: "Success", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const zschema = z.object({
            address: z.object({
                landmark: z.string(),
                street: z.string(),
                city: z.string(),
                state: z.string(),
                country: z.string(),
                pincode: z.string().length(6, "Pincode must be 6 digits"),
            }),
            phone: z
                .string()
                .length(10, "Phone number must be 10 digits")
                .regex(/^[0-9]+$/, "Phone number must be a number"),
            description: z.string(),
        });

        const data = zschema.parse(body);

        await dbConn();

        const seller = await Seller.findOne({ user: session.user._id });
        if (!seller) {
            return NextResponse.json(
                {
                    message: "Seller Account not found!",
                    success: false,
                },
                { status: 404 }
            );
        }

        if (!seller.emailVerified) {
            return NextResponse.json(
                {
                    message: "Email not verified!",
                    success: false,
                },
                { status: 400 }
            );
        }

        seller.address = data.address;
        seller.phone = data.phone;
        seller.description = data.description;
        seller.filledDetails = true;
        await seller.save();

        return NextResponse.json(
            { message: "Success", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
