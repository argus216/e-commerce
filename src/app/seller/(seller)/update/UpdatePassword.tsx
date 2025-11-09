"use client";

import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";

export default function UpdatePassword() {
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const entries = new FormData(e.currentTarget);
        const data = Object.fromEntries(entries);

        if (!data.existingPassword || !data.password || !data.confirm) {
            toast.error("Empty fields");
            return;
        }
        if (data.password !== data.confirm) {
            toast.error("Passwords not matching");
            return;
        }
        if (data.existingPassword === data.password) {
            toast.error("Passwords must not be same");
            return;
        }
        await fetchClient("user/update-password", "POST", data);
    }
    return (
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-2 w-full items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="existingPassword"
                >
                    Existing Password
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        type="password"
                        name="existingPassword"
                        id="email"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 w-full items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="password"
                >
                    New Password
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 w-full items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="confirm"
                >
                    Confirm Password
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        type="password"
                        name="confirm"
                        id="confirm"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-4 w-full items-center justify-end">
                <button className="text-red-500 border-0! w-fit!">
                    Forgot Password
                </button>
                <button className="bg-neutral-800 text-white border-0! w-fit!">
                    Update
                </button>
            </div>
        </form>
    );
}
