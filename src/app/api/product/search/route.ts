import { Product } from "@/models/Product";
import { dbConn } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams;
        const name = params.get("name");

        if (!name) {
            return NextResponse.json(
                { message: "Product name is required", success: false },
                {
                    status: 400,
                }
            );
        }

        await dbConn();
        const product = await Product.find({
            name: { $regex: name, $options: "i" },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found", success: false },
                {
                    status: 404,
                }
            );
        }

        const data = product.map((item) => {
            return {
                _id: item._id,
                name: item.name,
                price: item.price,
                rating: item.rating,
                image: item.images[0],
            };
        });

        return NextResponse.json(
            { message: "Product fetched", data, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
