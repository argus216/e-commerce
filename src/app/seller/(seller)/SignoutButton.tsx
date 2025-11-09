"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PiSignOut } from "react-icons/pi";

export default function SignoutButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                signOut().then(() => router.replace("/"));
            }}
            className="font-semibold flex flex-row gap-2 items-center border-0! w-fit! mx-6 my-8 text-neutral-400 text-[1rem]! hover:text-red-400"
        >
            <PiSignOut className="font-semibold text-xl!" /> Signout
        </button>
    );
}
