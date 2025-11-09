import { Product } from "@/models/Product";
import { Seller } from "@/models/Seller";
import { Category } from "@/models/Category";
import { authOptions } from "@/utils/authOptions";
import { cloudinary } from "@/utils/cloudinary";
import { dbConn } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET all products
export async function GET(req: NextRequest) {
    try {
        await dbConn();

        const products = await Product.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    images: 1,
                    price: 1,
                    rating: 1,
                },
            },
        ]);

        return NextResponse.json(
            {
                message: "Products fetched successfully",
                success: true,
                data: products,
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

// POST create product
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 401 }
            );
        }

        await dbConn();

        const seller = await Seller.findOne({ user: session.user._id });
        if (!seller) {
            return NextResponse.json(
                { message: "You are not a seller!", success: false },
                { status: 403 }
            );
        }

        if (!seller.emailVerified) {
            return NextResponse.json(
                { message: "Email not verified!", success: false },
                { status: 400 }
            );
        }

        const formData = await req.formData();

        const imageFiles: File[] = [];

        const imagesArray = formData.getAll("images[]");
        if (imagesArray.length > 0) {
            imagesArray.forEach((img) => {
                if (img instanceof File) {
                    imageFiles.push(img);
                }
            });
        }

        // Validate image count (1-4 images)
        if (imageFiles.length < 1) {
            return NextResponse.json(
                { message: "At least one image is required", success: false },
                { status: 400 }
            );
        }

        if (imageFiles.length > 4) {
            return NextResponse.json(
                { message: "Maximum 4 images allowed", success: false },
                { status: 400 }
            );
        }

        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const price = formData.get("price") as string;
        const stock = formData.get("stock") as string;
        const description = (formData.get("description") as string) || "";

        // Validate required fields
        if (!name || !category || !price || !stock) {
            return NextResponse.json(
                { message: "Missing required fields", success: false },
                { status: 400 }
            );
        }

        // Validate and parse numeric fields
        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock);

        if (isNaN(priceNum) || priceNum <= 0) {
            return NextResponse.json(
                { message: "Price must be a positive number", success: false },
                { status: 400 }
            );
        }

        if (isNaN(stockNum) || stockNum < 0) {
            return NextResponse.json(
                {
                    message: "Stock must be a non-negative integer",
                    success: false,
                },
                { status: 400 }
            );
        }

        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            return NextResponse.json(
                { message: "Category not found!", success: false },
                { status: 404 }
            );
        }

        const uploadedImages: string[] = [];

        for (const imageFile of imageFiles) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            const uploadResult = (await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder: "products" },
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

            uploadedImages.push(uploadResult.secure_url);
        }

        // Create product
        const product = await Product.create({
            name,
            category,
            price: `$ ${priceNum}`,
            stock: stockNum,
            description,
            images: uploadedImages,
            seller: seller._id,
        });

        seller.products.push(product._id as any);
        await seller.save();

        categoryDoc.products.push(product._id as any);
        await categoryDoc.save();

        return NextResponse.json(
            {
                message: "Product created successfully",
                success: true,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error: error.message, success: false },
            { status: 500 }
        );
    }
}
