import { CgArrowRight } from "react-icons/cg";

export function Carousel1() {
    return (
        <div className="w-full pl-24 pr-24">
            <div className="grid place-items-center grid-cols-2 bg-blue-50 p-16 rounded-2xl">
                <div className="grid gap-6">
                    <h2 className="font-semibold text-red-400 text-xl">
                        Hurry up only a few left
                    </h2>
                    <h1>
                        Next level Gaming Starts Here - Discover PlayStation 5
                        Today!
                    </h1>
                    <div className="flex flex-row gap-8">
                        <a
                            href="/product/id1"
                            className="text-white bg-red-400 hover:text-bg-300 px-4 py-2 rounded"
                        >
                            Shop Now
                        </a>
                        <a
                            href="/product/id1"
                            className="flex flex-row gap-2 items-center"
                        >
                            Explore deals <CgArrowRight />
                        </a>
                    </div>
                </div>
                <div>
                    <img
                        src="/assests/product_img14.png"
                        alt="carousel"
                        className="w-full h-[300px]"
                    />
                </div>
            </div>
        </div>
    );
}

export function Carousel2() {
    return (
        <div className="w-full">
            <div className="grid place-items-center grid-cols-2 bg-blue-50 p-16 rounded-2xl">
                <div className="grid gap-6">
                    <h2 className="font-semibold text-red-400 text-xl">
                        Limited Time Offer 30% off
                    </h2>
                    <h1>
                        Experience Pure Sound -Your Perfect Headphones Awaits!
                    </h1>
                    <div className="flex flex-row gap-8">
                        <a
                            href="/product/id1"
                            className="text-white bg-red-400 hover:text-bg-300 px-4 py-2 rounded"
                        >
                            Buy Now
                        </a>
                        <a
                            href="/product/id1"
                            className="flex flex-row gap-2 items-center"
                        >
                            Find More <CgArrowRight />
                        </a>
                    </div>
                </div>
                <div>
                    <img
                        src="/assests/header_headphone_image.png"
                        alt="carousel"
                        className="w-full h-[300px]"
                    />
                </div>
            </div>
        </div>
    );
}

export function Carousel3() {
    return (
        <div className="w-full">
            <div className="grid place-items-center grid-cols-2 bg-blue-50 p-16 rounded-2xl">
                <div className="grid gap-6">
                    <h2 className="font-semibold text-red-400 text-xl">
                        Exclusive Deals 40% off
                    </h2>
                    <h1>
                        Power meets Elegence - Apple Macbook Pro is here for
                        you!
                    </h1>
                    <div className="flex flex-row gap-8">
                        <a
                            href="/product/id1"
                            className="text-white bg-red-400 hover:text-bg-300 px-4 py-2 rounded"
                        >
                            Order Now
                        </a>
                        <a
                            href="/product/id1"
                            className="flex flex-row gap-2 items-center"
                        >
                            Learn More <CgArrowRight />
                        </a>
                    </div>
                </div>
                <div>
                    <img
                        src="/assests/header_macbook_image.png"
                        alt="carousel"
                        className="w-full h-[300px]"
                    />
                </div>
            </div>
        </div>
    );
}
