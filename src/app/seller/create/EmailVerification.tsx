"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function EmailVerification() {
    const inputRef = useRef<HTMLInputElement[]>([]);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        inputRef.current[value.length]?.focus();
    }, [value]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value.match(/[^0-9]/)) return;
        setValue(value + e.target.value);
    }

    function handleBackspace(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleVerification();
            return;
        }
        if (e.key !== "Backspace") return;
        setValue(value.slice(0, -1));
    }

    function handleFocus() {
        inputRef.current[value.length !== 4 ? value.length : 3]?.focus();
    }

    async function handleVerification() {
        if (loading) return;
        if (value.length !== 4) {
            toast.error("Please enter 4 digits.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/verify-otp", {
                method: "POST",
                body: JSON.stringify({ otp: value }),
            });

            const data = await res.json();
            if (!data.success) {
                toast.error(data.message);
                setLoading(false);
                return;
            }

            toast.success(data.message);
            setLoading(false);
            setTimeout(() => {
                router.refresh();
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
            setLoading(false);
        }
    }

    async function handleResend() {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch("/api/send-otp", { method: "POST" });

            const data = await res.json();
            if (!data.success) {
                toast.error(data.message);
                setLoading(false);
                return;
            }

            toast.success(data.message);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
            setLoading(false);
        }
    }

    return (
        <div className="w-[550px] bg-white border border-neutral-400/40 rounded-xl shadow p-8 grid gap-4">
            <h1 className="text-2xl font-semibold">Email Verification</h1>
            <div className="flex flex-col gap-2">
                <p className="text-sm!">
                    Click the link below to receive a verification code on your
                    email.
                </p>
                <button
                    onClick={handleResend}
                    className="text-blue-600 border-0! font-semibold w-fit! hover:text-blue-400"
                >
                    Send Code
                </button>
            </div>
            <div className="flex flex-row gap-8 mt-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <input
                        key={index}
                        ref={(e) => {
                            inputRef.current[index] = e as HTMLInputElement;
                        }}
                        maxLength={1}
                        type="text"
                        value={value[index] || ""}
                        onChange={handleChange}
                        onKeyDown={handleBackspace}
                        onFocus={handleFocus}
                        className="w-24 h-24 rounded text-6xl! text-center focus:ring-1"
                    />
                ))}
            </div>
            <button
                onClick={handleVerification}
                className="bg-neutral-800 text-white py-2 rounded"
            >
                Verify
            </button>
        </div>
    );
}
