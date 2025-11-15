import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { FaArchive } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import { MdSpaceDashboard } from "react-icons/md";
import { RiApps2AddFill, RiCoupon2Fill } from "react-icons/ri";
import { Role } from "@/models/User";
import { TbBrandCashapp, TbCategoryPlus } from "react-icons/tb";
import Link from "next/link";
import SignoutButton from "./(seller)/SignoutButton";
import { fetchServer } from "@/utils/fetchServer";
import { BsShop } from "react-icons/bs";
import { LuUsersRound } from "react-icons/lu";
import Ratings from "@/components/Ratings";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Seller Dashboard",
    description: "View the dashboard of your sold products",
};

export default async function SellerDashboardPage() {
    const session = await getServerSession(authOptions);
    const res = await fetchServer("dashboard", "GET");
    if (!res.success) notFound();

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

            <div className="w-full h-screen overflow-auto">
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
                    <main className="w-full p-8 h-full">
                        <div className="flex flex-row items-center justify-between gap-4">
                            <div className="flex flex-col gap-4 p-8 rounded bg-blue-50 flex-1">
                                <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                                    <BsShop className="text-4xl" />
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm!">
                                        Total Products
                                    </p>
                                    <p className="text-neutral-800 font-semibold text-xl!">
                                        {res.data.productsN}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-8 rounded bg-amber-50 flex-1">
                                <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                                    <FaBasketShopping className="text-4xl" />
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm!">
                                        Total Orders
                                    </p>
                                    <p className="text-neutral-800 font-semibold text-xl!">
                                        {res.data.ordersN}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-8 rounded bg-orange-50 flex-1">
                                <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                                    <LuUsersRound className="text-4xl" />
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm!">
                                        Total Customers
                                    </p>
                                    <p className="text-neutral-800 font-semibold text-xl!">
                                        {res.data.customersN}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-8 rounded bg-cyan-50 flex-1">
                                <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                                    <TbBrandCashapp className="text-4xl" />
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm!">
                                        Total Revenue
                                    </p>
                                    <p className="text-neutral-800 font-semibold text-xl!">
                                        ${res.data.totalPrice}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 grid gap-8 grid-cols-2">
                            <div className="flex flex-col gap-4 p-8 flex-1">
                                <h2 className="font-semibold">Top Customers</h2>
                                <div className="flex flex-col gap-4 rounded border border-neutral-400/40 shadow p-4">
                                    {res.data.topCustomers.map(
                                        (customer: any) => (
                                            <div
                                                key={customer._id}
                                                className="flex flex-row gap-4 items-center"
                                            >
                                                <img
                                                    src={customer.image}
                                                    alt="Logo"
                                                    className="rounded-full h-12 w-12 object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">
                                                        {customer.name}
                                                    </span>
                                                    <span className="text-xs">
                                                        {customer.email}
                                                    </span>
                                                </div>
                                                <span className="text-sm align-top">
                                                    Qty: {customer.quantity}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-8 flex-1">
                                <h2 className="font-semibold">Top Products</h2>
                                <div className="flex flex-col gap-8 rounded border border-neutral-400/40 shadow p-4">
                                    {res.data.topSelling.map((product: any) => (
                                        <div
                                            key={product.productId}
                                            className="flex flex-row gap-6 items-center"
                                        >
                                            <img
                                                src={product.image}
                                                alt="Logo"
                                                className="h-12 w-12 object-cover"
                                            />
                                            <div className="flex flex-row gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">
                                                        {product.name}
                                                    </span>
                                                    <div className="flex flex-row gap-2">
                                                        <span className="text-xs">
                                                            {product.price}
                                                        </span>
                                                        <span className="text-xs">
                                                            Qty:{" "}
                                                            {product.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Ratings
                                                    rating={product.rating}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
