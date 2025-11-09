"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

export default function DesktopLogin() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin() {
        if (!emailRef.current || !passwordRef.current) return;
        setLoading(true);
        const res = await signIn("credentials", {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            redirect: false,
        });
        if (res?.ok) {
            setLoading(false);
            router.replace("/");
            toast.success("Logged in successfully.");
            return;
        }
        toast.error(res?.error || "Something went wrong.");
        setLoading(false);
        console.log(res);
    }

    return (
        <div className="w-3/4 min-w-[400px] max-w-[1000px] bg-white border border-neutral-400/40 rounded-xl shadow p-4 grid grid-cols-2 gap-4">
            <div className="grid gap-4 place-items-center p-12">
                <h1 className="text-left w-full">Welcome</h1>
                <p className="text-left w-full">
                    Get Started for a Seamless Shopping Experience
                </p>
                <div className="flex flex-row gap-2 w-full">
                    <button>
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
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <LuLoaderCircle className="spin" /> : "Login"}
                </button>
                <div className="flex flex-row gap-2 items-center justify-center w-full">
                    <p>Don&apos;t have an account?</p>
                    <a
                        href="/signup"
                        className="text-red-400 font-semibold text-sm"
                    >
                        Register
                    </a>
                </div>
            </div>
            <div className="rounded-xl bg-neutral-200"></div>
        </div>
    );
}
