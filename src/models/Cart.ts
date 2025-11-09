import mongoose, { Document, Schema } from "mongoose";

interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    { _id: false }
);

const cartSchema: Schema<ICart> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

export const Cart: mongoose.Model<ICart> =
    mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);
