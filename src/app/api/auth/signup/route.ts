import { User } from "@/models/User";
import { dbConn } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const bodySchema = z.object({
            first_name: z
                .string()
                .min(2, "First name must be at least 2 characters long"),
            last_name: z
                .string()
                .min(2, "Last name must be at least 2 characters long")
                .optional(),
            email: z.string().email("Invalid email address"),
            password: z
                .string()
                .min(6, "Password must be at least 6 characters long"),
        });

        const { first_name, last_name, email, password } = bodySchema.parse(
            await req.json()
        );
        const name = last_name ? `${first_name} ${last_name}` : first_name;
        if (!first_name || !last_name || !email || !password) {
            return new NextResponse("Missing fields", { status: 400 });
        }
        await dbConn();

        const user = await User.findOne({ email });
        if (user) {
            return new NextResponse("User already exists", { status: 400 });
        }

        const createdUser = new User({ name, email, password });
        await createdUser.save();

        return new NextResponse(JSON.stringify(createdUser), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}
