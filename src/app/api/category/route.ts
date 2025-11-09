import { Category } from "@/models/Category";
import { cloudinary } from "@/utils/cloudinary";
import { dbConn } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConn();
        const categories = await Category.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                },
            },
        ]);

        return NextResponse.json(
            { success: true, data: categories },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get("image") as File;
        const name = formData.get("name");

        if (!image || !name) {
            return NextResponse.json(
                {
                    message: "Missing fields",
                    success: false,
                },
                {
                    status: 400,
                }
            );
        }

        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const res = (await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { folder: "category" },
                    function (error, result) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                )
                .end(buffer);
        })) as any;

        await dbConn();

        const url = res.secure_url;
        await Category.create({ name, image: url });

        return NextResponse.json(
            { message: "Category added successfully", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error, success: false, message: error.message },
            { status: 500 }
        );
    }
}
