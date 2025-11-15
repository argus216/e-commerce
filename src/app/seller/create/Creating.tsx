"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { SiTicktick } from "react-icons/si";
import { VscError } from "react-icons/vsc";

export default function Creating() {
    const [state, setstate] = useState<"LOADING" | "SUCCESS" | "ERROR">(
        "LOADING"
    );
    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        async function create() {
            try {
                const res = await fetch("/api/seller", {
                    method: "POST",
                    signal: abortController.signal,
                });
                if (!res.ok) {
                    setstate("ERROR");
                    toast.error("Something went wrong.");
                    return;
                }

                const data = await res.json();
                if (!data.success) {
                    setstate("ERROR");
                    toast.error(data.message);
                    return;
                }

                setstate("SUCCESS");
                setTimeout(() => {
                    router.refresh();
                }, 2000);
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong.");
                setstate("ERROR");
            }
        }
        create();

        return () => abortController.abort();
    }, [router]);
    return (
        <div className="bg-white rounded w-[500px] grid place-items-center border border-neutral-400/40 p-12 shadow gap-2">
            <div>
                {state === "LOADING" ? (
                    <LuLoader className="spin h-24 w-24" />
                ) : (
                    <></>
                )}
                {state === "SUCCESS" ? (
                    <SiTicktick className="h-24 w-24 text-emerald-600" />
                ) : (
                    <></>
                )}
                {state === "ERROR" ? (
                    <VscError className="h-24 w-24 text-red-600" />
                ) : (
                    <></>
                )}
            </div>
            <div>
                {state === "LOADING" && <h1>Creating Seller Account</h1>}
                {state === "SUCCESS" && <h1>Success</h1>}
                {state === "ERROR" && <h1>Error</h1>}
            </div>
            <div>
                {state === "LOADING" && (
                    <p className="text-[1rem]! text-neutral-600">
                        This may take only a few seconds...
                    </p>
                )}
                {state === "SUCCESS" && (
                    <p className="text-[1rem]! text-neutral-600">
                        Your Seller Account crated successfully. Now verify your
                        details...
                    </p>
                )}
                {state === "ERROR" && (
                    <p className="text-[1rem]! text-neutral-600">
                        An error has occured while creating your Seller Account.
                        Refresh...
                    </p>
                )}
            </div>
        </div>
    );
}
