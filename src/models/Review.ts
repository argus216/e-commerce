import mongoose, { Document, Schema } from "mongoose";

interface IReview extends Document {
    rating: number;
    comment: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema: Schema<IReview> = new Schema(
    {
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Review: mongoose.Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
