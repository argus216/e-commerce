import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
    seller: mongoose.Types.ObjectId;
    images: string[];
    name: string;
    category: mongoose.Types.ObjectId;
    brand: string;
    price: string;
    stock: number;
    description: string;
    rating: number;
    reviews: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        brand: {
            type: String,
            required: false,
        },
        price: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        seller: {
            type: Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

export const Product: mongoose.Model<IProduct> =
    mongoose.models.Product ||
    mongoose.model<IProduct>("Product", productSchema);
