"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

export default function DesktopSignup() {
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSignup() {
        if (
            !firstNameRef.current ||
            !lastNameRef.current ||
            !emailRef.current ||
            !passwordRef.current
        )
            return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    first_name: firstNameRef.current.value,
                    last_name: lastNameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                }),
            });
            const response = await res.json();
            if (response.name === "ZodError") {
                const z = JSON.parse(response.message);
                toast.error(z[0].message || "Something went wrong.");
                setLoading(false);
                return;
            }
            if (!res.ok) {
                toast.error(response.message || "Something went wrong.");
                setLoading(false);
            } else {
                toast.success("Account created successfully.");
                const log = await signIn("credentials", {
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                    redirect: false,
                });
                if (log?.ok) {
                    setLoading(false);
                    router.replace("/");
                } else {
                    toast.error(log?.error || "Something went wrong...");
                    setLoading(false);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
            setLoading(false);
        }
    }

    return (
        <div className="w-[90%] md:w-3/4 md:min-w-[800px] max-w-[1000px] bg-white border border-neutral-400/40 rounded-xl shadow p-4 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-neutral-200 hidden sm:block"></div>
            <div className="grid gap-4 place-items-center p-6 xl:p-12">
                <h1 className="text-left w-full">Create Account</h1>
                <p className="text-left w-full">
                    Create a new Account Seamless Shopping Experience
                </p>
                <div className="flex flex-row gap-2 w-full">
                    <button
                        onClick={() => {
                            signIn("google", {
                                callbackUrl: "/",
                            });
                        }}
                    >
                        <FaGoogle />
                        <p>Google</p>
                    </button>
                    <button>
                        <FaGithub />
                        <p>Github</p>
                    </button>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center w-full">
                    <div className="flex-1 h-px bg-gray-300/80"></div>
                    <p>OR</p>
                    <div className="flex-1 h-px bg-gray-300/80"></div>
                </div>
                <div className="grid gap-2 w-full">
                    <div className="w-full grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="first-name"
                                className="text-sm font-semibold"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first-name"
                                ref={firstNameRef}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="last-name"
                                className="text-sm font-semibold"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="last-name"
                                ref={lastNameRef}
                            />
                        </div>
                    </div>
                    <label htmlFor="email" className="text-sm font-semibold">
                        Email
                    </label>
                    <input
                        type="text"
                        placeholder="Email"
                        id="email"
                        ref={emailRef}
                    />
                    <label htmlFor="password" className="text-sm font-semibold">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        ref={passwordRef}
                    />
                </div>
                <button
                    className={`w-full font-semibold text-white bg-red-400 border-0 ${
                        loading ? "bg-red-300" : ""
                    }`}
                    onClick={handleSignup}
                >
                    {loading ? <LuLoaderCircle className="spin" /> : "Sign Up"}
                </button>
                <div className="flex flex-row gap-2 items-center justify-center w-full">
                    <p>Already have an account?</p>
                    <Link
                        href="/login"
                        className="text-red-400 font-semibold text-sm"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
