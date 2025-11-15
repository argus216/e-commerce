import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="p-6 bg-red-50/60 grid gap-8">
            <div className="grid grid-cols-2 md:grid-cols-4 justify-around items-center mx-auto gap-4">
                <div className="border border-neutral-200/40 shadow bg-white rounded-2xl px-8 py-4">
                    <h2 className="font-semibold text-sm sm:text-xl">
                        Free in-shop Pick
                    </h2>
                    <p>24/7 Amazing Service</p>
                </div>
                <div className="border border-neutral-200/40 shadow bg-white rounded-2xl px-8 py-4">
                    <h2 className="font-semibold text-sm sm:text-xl">
                        Free Shipping
                    </h2>
                    <p>24/7 Amazing Service</p>
                </div>
                <div className="border border-neutral-200/40 shadow bg-white rounded-2xl px-8 py-4">
                    <h2 className="font-semibold text-sm sm:text-xl">
                        Flexible Payment
                    </h2>
                    <p>24/7 Amazing Service</p>
                </div>
                <div className="border border-neutral-200/40 shadow bg-white rounded-2xl px-8 py-4">
                    <h2 className="font-bold text-sm sm:text-xl">
                        Convienient Help
                    </h2>
                    <p>24/7 Amazing Service</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 items-start w-full md:flex-row">
                <div className="w-full md:w-2/5">
                    <h2 className="font-semibold text-xl text-neutral-700">
                        Smart Shopping
                    </h2>
                    <p className="text-sm! text-neutral-400 mt-4">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Quibusdam repellendus aperiam minus accusantium
                        unde tempora aut repudiandae quos atque porro.
                    </p>
                </div>
                <div className="w-full md:w-3/5 flex flex-row justify-around">
                    <div>
                        <h3 className="font-semibold text-neutral-700">
                            Quick Links
                        </h3>
                        <div className="flex flex-col gap-2 mt-6">
                            <Link
                                href="/"
                                className="text-neutral-500 hover:text-red-400 text-sm"
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className="text-neutral-500 hover:text-red-400 text-sm"
                            >
                                Products
                            </Link>
                            <Link
                                href="/about"
                                className="text-neutral-500 hover:text-red-400 text-sm"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-neutral-500 hover:text-red-400 text-sm"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-neutral-700">
                            Contact Us
                        </h3>
                        <div className="flex flex-col gap-2 mt-6">
                            <p className="text-neutral-500 hover:text-red-400">
                                Phone: +1 (123) 456-7890
                            </p>
                            <p className="text-neutral-500 hover:text-red-400">
                                Email: IhE0L@example.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-0.5 bg-neutral-200 w-full"></div>
            <div>
                <p className="text-sm text-neutral-500">
                    &copy; 2025 Smart Shopping. All rights reserved.
                </p>
            </div>
        </div>
    );
}
