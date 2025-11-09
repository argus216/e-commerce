"use client";

import { fetchClient } from "@/utils/fetchClient";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function EmailUpdate() {
    const [otp, setotp] = useState("");
    const otpRef = useRef<HTMLInputElement[]>([]);
    const emailRef = useRef<HTMLInputElement>(null);
    const conEmailRef = useRef<HTMLInputElement>(null);

    async function handleVerify() {
        if (!emailRef.current || !conEmailRef.current) return;

        const email = emailRef.current.value;
        const conEmail = conEmailRef.current.value;

        if (email !== conEmail) {
            toast.error("Emails do not match.");
            return;
        }
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            toast.error("Invalid email address.");
            return;
        }

        await fetchClient("user/update-email", "POST", { email, otp });
    }

    async function handleSendCode() {
        if (!emailRef.current || !conEmailRef.current) return;

        const email = emailRef.current.value;
        const conEmail = conEmailRef.current.value;

        if (email !== conEmail) {
            toast.error("Emails do not match.");
            return;
        }
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            toast.error("Invalid email address.");
            return;
        }

        await fetchClient("send-otp", "POST", { email });
    }

    useEffect(() => {
        if (otp.length === 4) return;
        otpRef.current[otp.length]?.focus();
    }, [otp]);

    return (
        <div className="grid gap-4 mt-6">
            <div className="flex flex-row gap-2 w-full items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="email"
                >
                    Email Address
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        ref={emailRef}
                        type="email"
                        name="email"
                        id="email"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 w-full items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="confirm_email"
                >
                    Confirm Email Address
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0 items-center">
                    <input
                        ref={conEmailRef}
                        type="email"
                        name="confirm_email"
                        id="confirm_email"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl flex-1"
                    />
                    <button
                        onClick={handleSendCode}
                        className="w-fit! text-white bg-neutral-800 text-sm!"
                    >
                        Send Code
                    </button>
                </div>
            </div>

            <div>
                <h1 className="text-sm! font-semibold! mt-6">Verify Email</h1>
                <div className="flex flex-col items-end w-fit gap-4">
                    <div className="flex flex-row gap-2 mt-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <input
                                maxLength={1}
                                key={index}
                                type="text"
                                onFocus={() => {
                                    otpRef.current[otp.length]?.focus();
                                }}
                                onChange={(e) => {
                                    if (e.target.value.match(/[^0-9]/)) return;
                                    setotp(otp + e.target.value);
                                }}
                                ref={(e) => {
                                    otpRef.current[index] =
                                        e as HTMLInputElement;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Backspace")
                                        setotp(otp.slice(0, -1));
                                }}
                                className="w-16! h-16! p-2 border border-neutral-400/40 rounded-xl text-xl! text-center! font-semibold! text-neutral-600!"
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleVerify}
                        className="w-fit! bg-neutral-800 text-white text-sm! hover:text-neutral-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
