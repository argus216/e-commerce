import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
    name: string;
    image: string;
    products: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema: Schema<ICategory> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],
    },
    { timestamps: true }
);

export const Category: mongoose.Model<ICategory> =
    mongoose.models.Category ||
    mongoose.model<ICategory>("Category", categorySchema);
