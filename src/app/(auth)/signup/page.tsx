import DesktopSignup from "@/components/DesktopSignup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Signup",
    description: "Signup to your account",
};

export default function SignupPage() {
    return (
        <main className="w-full h-svh grid place-items-center bg-neutral-100">
            <DesktopSignup />
        </main>
    );
}
