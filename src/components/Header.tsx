import { IoCartOutline } from "react-icons/io5";
import Image from "next/image";
import { LuCircleUser } from "react-icons/lu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import HoverCard from "./HoverCard";

export default async function Header() {
    const session = await getServerSession(authOptions);
    return (
        <header className="flex flex-row items-center justify-between px-[100px]">
            <Image
                src="/assests/0.png"
                alt="App logo"
                width={150}
                height={100}
                priority
            />
            <div className="flex flex-row items-center gap-6">
                <nav className="flex flex-row items-center gap-6">
                    <a href="/">Home</a>
                    <a href="/products">Products</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                </nav>
                <input type="text" placeholder="Search Product" />
                <a href="/cart" className="flex flex-row items-center gap-2">
                    <IoCartOutline /> Cart
                </a>
                {!session || !session.user ? (
                    <a
                        href="/login"
                        className="flex flex-row items-center gap-2"
                    >
                        <LuCircleUser /> Login
                    </a>
                ) : (
                    <HoverCard
                        email={session.user.email}
                        image={session.user.image}
                        name={session.user.name}
                        role={session.user.role}
                    />
                )}
            </div>
        </header>
    );
}
