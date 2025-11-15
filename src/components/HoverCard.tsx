"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RxArchive } from "react-icons/rx";
import { IoLogOutOutline, IoSettingsSharp } from "react-icons/io5";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { LuUserRoundPlus } from "react-icons/lu";
import Link from "next/link";

type HoverCardProps = {
    name: string;
    email: string;
    image: string;
    role: string;
};

export default function HoverCard({
    email,
    image,
    name,
    role,
}: HoverCardProps) {
    const [show, setShow] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const menuRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (e.target === menuRef.current) return;
            setShow(false);
        }
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <div>
            <div
                className="cursor-pointer w-max"
                onClick={(e) => {
                    e.stopPropagation();
                    setShow(!show);
                }}
            >
                <p style={{ writingMode: "horizontal-tb" }}>Hi, {name}</p>
            </div>
            {show && (
                <div
                    className={
                        "absolute shadow border border-neutral-200/40 bg-white p-6 right-24 z-10"
                    }
                >
                    <div className="flex flex-row gap-4">
                        <Image
                            src={image}
                            alt={name}
                            width={50}
                            height={30}
                            className="rounded-full"
                        />
                        <div>
                            <h2 className="font-semibold">{name}</h2>
                            <p>{email}</p>
                        </div>
                    </div>
                    <div className="w-full border border-neutral-400/40 h-px mx-auto my-4"></div>
                    <div className="flex flex-col gap-4">
                        {role !== "CUSTOMER" ? (
                            <div className="flex flex-row items-center gap-4">
                                <IoSettingsSharp />
                                <Link
                                    href="/seller"
                                    className="text-sm cursor-pointer hover:font-semibold"
                                >
                                    Seller Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center gap-4">
                                <LuUserRoundPlus />
                                <Link
                                    href="/seller/create"
                                    className="text-sm cursor-pointer hover:font-semibold"
                                >
                                    Create Seller Dashboard
                                </Link>
                            </div>
                        )}
                        <div className="flex flex-row items-center gap-4">
                            <RxArchive />
                            <Link
                                href="/orders"
                                className="text-sm cursor-pointer hover:font-semibold"
                            >
                                My Orders
                            </Link>
                        </div>
                        <div className="flex flex-row items-center gap-4">
                            <IoLogOutOutline className="h-6 w-6" />
                            <h2
                                className="text-sm cursor-pointer hover:font-semibold"
                                onClick={async () => {
                                    await signOut();
                                    if (pathname !== "/") {
                                        router.replace("/");
                                    }
                                }}
                            >
                                Logout
                            </h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
