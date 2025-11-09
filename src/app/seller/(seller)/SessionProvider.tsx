"use client";

import { SessionProvider as SessionProviderAuth } from "next-auth/react";

type SessionProviderProps = {
    children: React.ReactNode;
    session: any;
};

export default function SessionProvider({
    children,
    session,
}: SessionProviderProps) {
    return (
        <SessionProviderAuth session={session}>{children}</SessionProviderAuth>
    );
}
