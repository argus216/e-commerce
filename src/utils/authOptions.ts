import { AuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConn } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import z from "zod";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            async authorize(credential) {
                const credentialsSchema = z.object({
                    email: z.string().email("Invalid email address"),
                    password: z
                        .string()
                        .min(6, "Password must be at least 6 characters long"),
                });
                const validated = credentialsSchema.parse({
                    email: credential?.email,
                    password: credential?.password,
                });

                if (!validated.email || !validated.password)
                    throw new Error("Invalid credentials");

                await dbConn();
                const user = await User.findOne({ email: validated.email });
                if (!user) throw new Error("User not found");

                const isValid = await bcrypt.compare(
                    validated.password,
                    user.password
                );
                if (!isValid) throw new Error("Invalid Password");

                return {
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, session, trigger, account, profile }) {
            if (account?.provider === "google") {
                const user = await User.findOne({ email: profile?.email });
                if (user) {
                    token._id = user._id.toString();
                    token.email = user.email;
                    token.name = user.name;
                    token.image = user.image!;
                    token.role = user.role!;
                } else {
                    const newUser = new User({
                        name: token?.name,
                        email: token?.email,
                        image: token?.picture,
                        role: "CUSTOMER",
                        oauth: "GOOGLE",
                        password: "",
                    });
                    await newUser.save();
                    token._id = newUser._id.toString();
                    token.email = newUser.email;
                    token.name = newUser.name;
                    token.image = newUser.image!;
                    token.role = newUser.role!;
                }

                return token;
            }

            if (user) {
                token._id = user._id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image!;
                token.role = user.role!;
            }

            if (trigger === "update" && session?.user) {
                token.name = session.user.name;
                token.email = session.user.email;
                token.image = session.user.image!;
                token.role = session.user.role!;
            }
            return token;
        },
        session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.email = token.email!;
                session.user.name = token.name!;
                session.user.image = token.image!;
                session.user.role = token.role!;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "secret",
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
    },
};
