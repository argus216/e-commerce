"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SiTicktick } from "react-icons/si";

export default function NotVerified() {
    const router = useRouter();
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.replace("/seller");
        }, 4000);

        return () => {
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <div className="rounded border grid place-items-center bg-white border-neutral-400/40 p-12 shadow gap-6">
            <SiTicktick className="h-24 w-24 text-emerald-600" />
            <h1>Data Submitted Successfully!</h1>
            <p className="text-center text-[1rem]!">
                You can start selling your products. Redirecting
            </p>
        </div>
    );
}
