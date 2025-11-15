import { User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { cloudinary } from "@/utils/cloudinary";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get("image") as File;

        if (!image) {
            return NextResponse.json(
                { message: "Image is required", success: false },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 401 }
            );
        }

        await dbConn();

        const user = await User.findOne({ _id: session.user._id });
        if (!user) {
            return NextResponse.json(
                { message: "User not found!", success: false },
                { status: 404 }
            );
        }

        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const res = (await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "seller" }, function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })
                .end(buffer);
        })) as any;

        if (!res || res.error) {
            return NextResponse.json(
                {
                    message: res.error.message || "Error uploading image",
                    success: false,
                },
                { status: 500 }
            );
        }

        user.image = res.secure_url;
        await user.save();

        return NextResponse.json(
            {
                message: "Image uploaded successfully",
                data: { url: res.secure_url },
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
