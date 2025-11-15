import DesktopLogin from "@/components/DesktopLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
};

export default function LoginPage() {
    return (
        <main className="w-full h-svh grid place-items-center bg-neutral-100">
            <DesktopLogin />
        </main>
    );
}
