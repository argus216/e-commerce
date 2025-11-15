"use client";

import { SessionProvider as SessionProviderAuth } from "next-auth/react";

type SessionProviderProps = {
    children: React.ReactNode;
};

export default function SessionProvider({ children }: SessionProviderProps) {
    return <SessionProviderAuth>{children}</SessionProviderAuth>;
}
