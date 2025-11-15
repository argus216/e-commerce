"use client";

import { IoCartOutline, IoLogOutOutline } from "react-icons/io5";
import Image from "next/image";
import { LuCircleUser } from "react-icons/lu";
import HoverCard from "./HoverCard";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { RiMenu4Line } from "react-icons/ri";
import { MdKeyboardBackspace, MdOutlineDashboard } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { RxArchive, RxDashboard } from "react-icons/rx";

type Products = {
    _id: string;
    name: string;
    price: string;
    image: string;
};

export default function Header() {
    const { data: session } = useSession();
    const [search, setsearch] = useState("");
    const [products, setProducts] = useState<Products[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSearchRes, setShowSearchRes] = useState(false);
    const [showMenu, setshowMenu] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        window.addEventListener("click", () => {
            setShowSearchRes(false);
        });
    }, []);

    useEffect(() => {
        if (search === "") {
            setProducts(null);
            return;
        }
        const controller = new AbortController();
        const fetchData = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    "/api/product/search?name=" + encodeURIComponent(search),
                    { signal: controller.signal }
                );
                const data = await res.json();
                if (data.success) setProducts(data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }, 2000);

        return () => {
            clearTimeout(fetchData);
            controller.abort();
        };
    }, [search]);

    return (
        <header className="flex flex-row items-center justify-between mx-auto sm:w-4/5">
            <div className="relative h-24 w-32 md:h-32 md:w-48">
                <Image
                    fill
                    src="/assests/0.png"
                    alt="App logo"
                    className="object-contain"
                />
            </div>
            <div className="flex flex-row flex-1 items-center gap-4 sm:gap-6 md:gap-8">
                <nav className="hidden lg:flex flex-row items-center gap-2 sm:gap-4">
                    <Link
                        href="/"
                        className="text-neutral-600 font-semibold text-sm hover:text-red-400"
                    >
                        Home
                    </Link>
                    <Link
                        href="/products"
                        className="text-neutral-600 font-semibold text-sm hover:text-red-400"
                    >
                        Products
                    </Link>
                    <Link
                        href="/about"
                        className="text-neutral-600 font-semibold text-sm hover:text-red-400"
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className="text-neutral-600 font-semibold text-sm hover:text-red-400"
                    >
                        Contact
                    </Link>
                </nav>
                <div
                    className="relative flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowSearchRes(true);
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search Product"
                        value={search}
                        onChange={(e) => setsearch(e.target.value)}
                    />
                    <div
                        className={
                            "w-64 absolute border border-neutral-400/40 shadow bg-white rounded-2xl px-4 py-4 top-12 -left-4" +
                            (showSearchRes ? "" : " hidden")
                        }
                    >
                        {loading ? (
                            <BiLoader className="animate-spin mx-auto" />
                        ) : products === null || products.length === 0 ? (
                            <p className="text-center text-neutral-600 text-sm!">
                                No products found
                            </p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {products.map((product) => (
                                    <Link
                                        href={`/products/${product._id}`}
                                        key={product._id}
                                        className="flex flex-row gap-2"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-neutral-600 text-[0.8rem]! font-semibold">
                                                {product.name}
                                            </p>
                                            <p className="text-neutral-600 text-[0.8rem]!">
                                                {product.price}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden lg:flex flex-row items-center gap-4">
                    <Link
                        href="/cart"
                        className="flex flex-row items-center gap-2 text-sm text-neutral-600 hover:text-red-400"
                    >
                        <IoCartOutline /> Cart
                    </Link>
                    {!session || !session.user ? (
                        <Link
                            href="/login"
                            className="flex flex-row items-center gap-2"
                        >
                            <LuCircleUser /> Login
                        </Link>
                    ) : (
                        <HoverCard
                            email={session.user.email}
                            image={session.user.image}
                            name={session.user.name}
                            role={session.user.role}
                        />
                    )}
                </div>

                <div
                    className="lg:hidden cursor-pointer"
                    onClick={() => setshowMenu(!showMenu)}
                >
                    <RiMenu4Line className="text-2xl" />
                </div>

                {showMenu && (
                    <div className="flex justify-end fixed top-0 right-0 w-full h-screen bg-neutral-50/60 z-10 pointer-events-auto">
                        <div className="flex flex-col gap-4 w-1/2 h-full bg-white p-6">
                            <div className="flex flex-row justify-end">
                                <MdKeyboardBackspace
                                    className="text-4xl p-2 rounded-full cursor-pointer hover:bg-neutral-200"
                                    onClick={() => setshowMenu(false)}
                                />
                            </div>
                            {!session || !session.user ? null : (
                                <div className="flex flex-row gap-4 justify-between">
                                    <div className="flex flex-row gap-4 items-center">
                                        <div>
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name}
                                                className="w-24 h-24 rounded-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-neutral-600 text-sm font-semibold">
                                                {session.user.name}
                                            </p>
                                            <p className="text-neutral-600 text-sm">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/cart"
                                        className="flex items-center justify-center gap-4"
                                    >
                                        <IoCartOutline className="text-2xl" />
                                    </Link>
                                </div>
                            )}

                            <div className="border border-neutral-200/40 w-full h-0.5"></div>
                            <div className="flex flex-col gap-4">
                                {session?.user.role === "CUSTOMER" ? (
                                    <Link
                                        href="/seller/create"
                                        className="text-neutral-600 flex flex-row gap-2 hover:text-red-400"
                                    >
                                        <MdOutlineDashboard />{" "}
                                        <p>Create Seller Account</p>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/seller"
                                        className="text-neutral-600 flex flex-row gap-2 hover:text-red-400"
                                    >
                                        <RxDashboard /> <p>Seller Dashboard</p>
                                    </Link>
                                )}
                                <Link
                                    href={"/orders"}
                                    className="text-neutral-600 flex flex-row gap-2 hover:text-red-400"
                                >
                                    <RxArchive />
                                    <p>My Orders</p>
                                </Link>
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        if (pathname !== "/") {
                                            router.replace("/");
                                        }
                                    }}
                                    className="text-neutral-600 flex flex-row gap-2 w-fit! border-0! p-0! m-0! hover:text-red-400"
                                >
                                    <IoLogOutOutline className="text-xl" />{" "}
                                    <p>Logout</p>
                                </button>
                            </div>

                            <div className="border border-neutral-200/40 w-full h-0.5"></div>
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    href="/"
                                    className="text-sm text-neutral-600 p-2 rounded hover:bg-red-50 hover:text-red-400 w-full text-center"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    className="text-sm text-neutral-600 p-2 rounded hover:bg-red-50 hover:text-red-400 w-full text-center"
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-sm text-neutral-600 p-2 rounded hover:bg-red-50 hover:text-red-400 w-full text-center"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-sm text-neutral-600 p-2 rounded hover:bg-red-50 hover:text-red-400 w-full text-center"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
