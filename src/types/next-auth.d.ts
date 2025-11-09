import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: NewUser & DefaultSession["user"];
    }

    interface User extends NewUser {}
}

declare module "next-auth/jwt" {
    interface JWT extends NewUser {}
}

interface NewUser {
    _id: string;
    email: string;
    name: string;
    image: string;
    role: "ADMIN" | "SELLER" | "CUSTOMER";
}
