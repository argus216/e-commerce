import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./utils/authOptions";

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (objectIdRegex.test(pathname)) {
        return NextResponse.next();
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        if (pathname.startsWith("/seller")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    } else {
        // signed in
        if (
            pathname.startsWith("/seller/admin") &&
            session.user.role !== "ADMIN"
        ) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (pathname === "/login" || pathname === "/signup") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/seller/:path*", "/login", "/signup"],
};
