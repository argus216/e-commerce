import Link from "next/link";
import { CgArrowRight } from "react-icons/cg";

export function Carousel1() {
    return (
        <div className="w-full flex justify-center px-4">
            {/* Card */}
            <div className="w-full lg:w-3/4 bg-blue-50 p-8 md:p-16 rounded-2xl grid grid-cols-1 md:grid-cols-2 place-items-center gap-8">
                <div className="grid gap-4 md:gap-6">
                    <h2 className="font-semibold text-red-400 text-sm md:text-xl">
                        Hurry up only a few left
                    </h2>
                    <h1 className="font-semibold text-2xl md:text-4xl">
                        Next level Gaming Starts Here - Discover PlayStation 5
                        Today!
                    </h1>

                    <div className="flex gap-6">
                        <Link
                            href="/products/690d9bb2f914bf336c4c1288"
                            className="text-white bg-red-400 px-4 py-2 rounded text-sm md:text-[0.9rem]"
                        >
                            Shop Now
                        </Link>

                        <Link
                            href="/products/690d9bb2f914bf336c4c1288"
                            className="flex items-center gap-2 text-sm md:text-[0.9rem]"
                        >
                            Explore deals <CgArrowRight />
                        </Link>
                    </div>
                </div>

                <img
                    src="/assests/product_img14.png"
                    alt="carousel"
                    className="w-full h-[180px] md:h-[250px] lg:h-[300px] object-contain"
                />
            </div>
        </div>
    );
}

export function Carousel2() {
    return (
        <div className="w-full flex justify-center px-4">
            <div className="w-full lg:w-3/4 bg-blue-50 p-8 md:p-16 rounded-2xl grid grid-cols-1 md:grid-cols-2 place-items-center gap-8">
                <div className="grid gap-4 md:gap-6">
                    <h2 className="font-semibold text-red-400 text-sm md:text-xl">
                        Limited Time Offer 30% off
                    </h2>

                    <h1 className="text-2xl md:text-4xl font-semibold">
                        Experience Pure Sound - Your Perfect Headphones Awaits!
                    </h1>

                    <div className="flex gap-6">
                        <Link
                            href="/products/691858aef81ecae39137ac22"
                            className="text-white bg-red-400 px-4 py-2 rounded"
                        >
                            Buy Now
                        </Link>

                        <Link
                            href="/products/691858aef81ecae39137ac22"
                            className="flex items-center gap-2"
                        >
                            Find More <CgArrowRight />
                        </Link>
                    </div>
                </div>

                <img
                    src="/assests/header_headphone_image.png"
                    alt="carousel"
                    className="w-full h-[220px] md:h-[300px] object-contain"
                />
            </div>
        </div>
    );
}

export function Carousel3() {
    return (
        <div className="w-full flex justify-center px-4">
            <div className="w-full lg:w-3/4 bg-blue-50 p-8 md:p-16 rounded-2xl grid grid-cols-1 md:grid-cols-2 place-items-center gap-8">
                <div className="grid gap-4 md:gap-6">
                    <h2 className="font-semibold text-red-400 text-sm md:text-xl">
                        Exclusive Deals 40% off
                    </h2>

                    <h1 className="text-2xl md:text-4xl font-semibold">
                        Power meets Elegance — Apple Macbook Pro is here for
                        you!
                    </h1>

                    <div className="flex gap-6">
                        <Link
                            href="/products/691858e7f81ecae39137ac28"
                            className="text-white bg-red-400 px-4 py-2 rounded"
                        >
                            Order Now
                        </Link>

                        <Link
                            href="/products/691858e7f81ecae39137ac28"
                            className="flex items-center gap-2"
                        >
                            Learn More <CgArrowRight />
                        </Link>
                    </div>
                </div>

                <img
                    src="/assests/header_macbook_image.png"
                    alt="carousel"
                    className="w-full h-[220px] md:h-[300px] object-contain"
                />
            </div>
        </div>
    );
}
