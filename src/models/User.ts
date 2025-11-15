import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export enum Role {
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
    SELLER = "SELLER",
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Role;
    image: string;
    otp: string;
    createdAt: Date;
    updatedAt: Date;
    oauth?: null | undefined | "GOOGLE";
    comparePassword(password: string): Promise<boolean>;

    orders: mongoose.Types.ObjectId[];
    cart: mongoose.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.CUSTOMER,
        },
        image: {
            type: String,
            default: "/assests/default_user.png",
        },
        otp: {
            type: String,
            default: "",
        },
        oauth: {
            type: String,
            default: null,
        },
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

userSchema.pre("validate", function (next) {
    if (this.isModified("password")) {
        const hash = bcrypt.hashSync(this.password, 10);
        this.password = hash;
    }
    next();
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export const User: mongoose.Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);
