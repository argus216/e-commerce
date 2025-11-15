import mongoose, { Document, Schema } from "mongoose";

interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    coupen: string;
    quantity: number;
    status: STATUS;
    shippingAddress: {
        landmark: string;
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    paymentMethod: PAYMENT_METHOD;
    createdAt: Date;
    updatedAt: Date;
}

enum PAYMENT_METHOD {
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
    ONLINE_PAYMENT = "ONLINE_PAYMENT",
}

export enum STATUS {
    PENDING = "PENDING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

const orderSchema: Schema<IOrder> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        coupen: {
            type: String,
            required: false,
            default: "",
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        status: {
            type: String,
            enum: Object.values(STATUS),
            default: STATUS.PENDING,
        },
        shippingAddress: {
            type: {
                landmark: String,
                street: String,
                city: String,
                state: String,
                country: String,
                pincode: String,
            },
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PAYMENT_METHOD),
            required: true,
        },
    },
    { timestamps: true }
);

export const Order: mongoose.Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
