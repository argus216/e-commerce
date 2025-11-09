import { SessionProvider as SessionProviderAuth } from "next-auth/react";

export default function SessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SessionProviderAuth>{children}</SessionProviderAuth>;
}
