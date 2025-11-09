import mongoose, { Schema, Document } from "mongoose";

interface ISeller extends Document {
    user: mongoose.Types.ObjectId;
    address?: Address;
    phone?: string;
    company?: string;
    emailVerified: boolean;
    description?: string;
    rating: number;
    filledDetails: boolean;
    products: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    orders: mongoose.Types.ObjectId[];
    cart: mongoose.Types.ObjectId[];
}

type Address = {
    landmark: string;
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
};

const sellerSchema: Schema<ISeller> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        address: {
            type: {
                landmark: String,
                street: String,
                city: String,
                state: String,
                country: String,
                pincode: String,
            },
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        company: {
            type: String,
            required: false,
        },
        filledDetails: {
            type: Boolean,
            default: false,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default: "",
        },
        rating: {
            type: Number,
            default: 0,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        orders: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        cart: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

export const Seller: mongoose.Model<ISeller> =
    mongoose.models.Seller || mongoose.model<ISeller>("Seller", sellerSchema);
