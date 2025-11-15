import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { FaArchive } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import { MdSpaceDashboard } from "react-icons/md";
import { RiApps2AddFill, RiCoupon2Fill } from "react-icons/ri";
import SignoutButton from "./SignoutButton";
import { Role } from "@/models/User";
import { TbCategoryPlus } from "react-icons/tb";
import Link from "next/link";

export default async function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden">
            <div className="flex flex-col w-1/4 min-w-[250px] justify-between shadow border-r border-neutral-400/40 h-screen">
                <div>
                    <Image
                        src="/assests/0.png"
                        alt="Logo"
                        width={200}
                        height={200}
                    />
                    <nav className="flex flex-col gap-2 mt-4 w-full p-4">
                        <Link
                            href="/seller"
                            className="flex flex-row items-center text-[0.95rem]! text-neutral-600 gap-2 p-4 rounded hover:bg-red-50 hover:text-red-400 transition"
                        >
                            <MdSpaceDashboard />
                            Dashboard
                        </Link>
                        <Link
                            href="/seller/products"
                            className="flex flex-row items-center text-[0.95rem]! text-neutral-600 gap-2 p-4 rounded hover:bg-red-50 hover:text-red-400 transition"
                        >
                            <FaArchive />
                            Products
                        </Link>
                        <Link
                            href="/seller/add-product"
                            className="flex flex-row items-center text-[0.95rem]! text-neutral-600 gap-2 p-4 rounded hover:bg-red-50 hover:text-red-400 transition"
                        >
                            <RiApps2AddFill />
                            Add Product
                        </Link>
                        <Link
                            href="/seller/orders"
                            className="flex flex-row items-center text-[0.95rem]! text-neutral-600 gap-2 p-4 rounded hover:bg-red-50 hover:text-red-400 transition"
                        >
                            <FaBasketShopping />
                            Orders
                        </Link>
                        <Link
                            href="/seller/update"
                            className="flex flex-row items-center text-[0.95rem]! text-neutral-600 gap-2 p-4 rounded hover:bg-red-50 hover:text-red-400 transition"
                        >
                            <FcSettings />
                            Settings
                        </Link>
                        {session?.user.role === Role.ADMIN ? (
                            <Link
                                href="/seller/admin/coupens"
                                className="flex flex-row items-center text-[0.95rem]! text-neutral-600 gap-2 p-4 rounded hover:bg-red-50 hover:text-red-400 transition"
                            >
                                <RiCoupon2Fill />
                                Coupens
                            </Link>
                        ) : (
                            <></>
                        )}
                        {session?.user.role === Role.ADMIN ? (
                            <Link
                                href="/seller/admin/create-category"
                                className="flex flex-row items-center text-[0.95rem]! text-neutral-600 gap-2 p-4 rounded hover:bg-red-50 hover:text-red-400 transition"
                            >
                                <TbCategoryPlus />
                                Add Category
                            </Link>
                        ) : (
                            <></>
                        )}
                    </nav>
                </div>
                <SignoutButton />
            </div>

            <div className="w-full h-screen bg-red-50/80 overflow-auto">
                <header className="flex flex-row items-center justify-end w-full p-6 border-0">
                    <div className="flex flex-row items-center gap-4 bg-white p-4 rounded border shadow border-neutral-400/40">
                        <Image
                            src={
                                session?.user?.image ||
                                "/assests/default_user.png"
                            }
                            alt="Logo"
                            width={60}
                            height={65}
                            className="rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                {session?.user?.name}
                            </span>
                            <span className="text-xs">
                                {session?.user?.email}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="w-full pl-6 h-full">
                    <main className="bg-white w-full p-8 shadow border border-neutral-400/40 h-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
