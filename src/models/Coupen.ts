import mongoose, { Document, Schema } from "mongoose";

interface ICoupon extends Document {
    code: string;
    discount: number; // Percentage discount (0-100)
    minPurchase: number; // Minimum purchase amount to use coupon
    maxDiscount: number; // Maximum discount amount
    expiryDate: Date;
    isActive: boolean;
    usageLimit: number; // Maximum number of times coupon can be used
    usedCount: number; // Number of times coupon has been used
    createdAt: Date;
    updatedAt: Date;
}

const couponSchema: Schema<ICoupon> = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        minPurchase: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxDiscount: {
            type: Number,
            min: 0,
            default: 0,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        usageLimit: {
            type: Number,
            min: 1,
            default: 1,
        },
        usedCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

export const Coupon: mongoose.Model<ICoupon> =
    mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);
