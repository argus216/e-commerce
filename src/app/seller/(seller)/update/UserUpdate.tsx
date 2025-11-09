"use client";

import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { GoUnlock } from "react-icons/go";
import { MdMailOutline } from "react-icons/md";
import UserProfile from "./UserProfile";
import { FaRegAddressCard } from "react-icons/fa";
import EmailUpdate from "./EmailUpdate";
import UpdatePassword from "./UpdatePassword";
import UpdateAddress from "./UpdateAddress";

export default function UserUpdate({ user }: { user: any }) {
    const [activeForm, setActiveForm] = useState<
        "profile" | "email" | "password" | "address"
    >("profile");

    return (
        <div className="mt-6 grid w-full gap-6">
            <div className="p-2 bg-neutral-100 flex flex-row gap-2 border border-neutral-100/40 shadow rounded-xl">
                <button
                    onClick={() => setActiveForm("profile")}
                    className={
                        "font-semibold text-neutral-600 flex flex-row gap-2 items-center border-0! w-fit! py-4! flex-1 rounded-xl!" +
                        (activeForm === "profile" ? " bg-white" : "")
                    }
                >
                    <CiUser className="font-semibold text-[1rem]!" /> Profile
                </button>
                <button
                    onClick={() => setActiveForm("email")}
                    className={
                        "font-semibold text-neutral-600 flex flex-row gap-2 items-center border-0! w-fit! py-4! flex-1 rounded-xl!" +
                        (activeForm === "email" ? " bg-white" : "")
                    }
                >
                    <MdMailOutline className="font-semibold text-[1rem]!" />{" "}
                    Email Address
                </button>
                <button
                    onClick={() => setActiveForm("password")}
                    className={
                        "font-semibold text-neutral-600 flex flex-row gap-2 items-center border-0! w-fit! py-4! flex-1 rounded-xl!" +
                        (activeForm === "password" ? " bg-white" : "")
                    }
                >
                    <GoUnlock className="font-semibold text-[1rem]!" /> Password
                </button>
                <button
                    onClick={() => setActiveForm("address")}
                    className={
                        "font-semibold text-neutral-600 flex flex-row gap-2 items-center border-0! w-fit! py-4! flex-1 rounded-xl!" +
                        (activeForm === "address" ? " bg-white" : "")
                    }
                >
                    <FaRegAddressCard className="font-semibold text-[1rem]!" />{" "}
                    Address
                </button>
            </div>
            <div>
                {activeForm === "profile" ? <UserProfile user={user} /> : null}
                {activeForm === "email" ? <EmailUpdate /> : null}
                {activeForm === "password" ? <UpdatePassword /> : null}
                {activeForm === "address" ? (
                    <UpdateAddress user={user} />
                ) : null}
            </div>
        </div>
    );
}
