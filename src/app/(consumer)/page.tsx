import ProductIcon from "@/components/ProductIcon";
import Image from "next/image";
import Link from "next/link";
import { SlArrowRight } from "react-icons/sl";
import Carousel from "@/components/Carousel/Carousel";

export const metadata = {
    title: "Home",
    description: "Welcome to our website",
};

const categoriesArr = [
    {
        _id: "6909e0b0c104f0b08a522ade",
        name: "Electronics",
        image: "/assests/7.jpeg",
    },
    {
        _id: "6909e0c0c104f0b08a522ae1",
        name: "Fashion",
        image: "/assests/17.jpeg",
    },
    {
        _id: "6909e209c104f0b08a522ae6",
        name: "Luxury",
        image: "/assests/8.jpeg",
    },
    {
        _id: "6909e24fc104f0b08a522ae8",
        name: "Home Dec",
        image: "/assests/15.jpeg",
    },
    {
        _id: "6909e24fc104f0b08a522ae9",
        name: "Health & Beauty",
        image: "/assests/9.jpeg",
    },
    {
        _id: "6909e24fc104f0b08a522aea",
        name: "Groceries",
        image: "/assests/26.jpeg",
    },
    {
        _id: "6909e24fc104f0b08a522aeb",
        name: "Sneakers",
        image: "/assests/25.jpeg",
    },
];

const bestProductsArr = [
    {
        _id: "6912e1105f2bf38b78de4ba5",
        image: "/assests/product_img12.png",
        name: "Smart Home Cleaner",
        rating: 2,
        price: "$299",
    },
    {
        _id: "690d9aa5f914bf336c4c1280",
        image: "/assests/product_img10.png",
        name: "Apple Smart Watch",
        rating: 4,
        price: "$269",
    },
    {
        _id: "6912e10f5f2bf38b78de4ba3",
        image: "/assests/product_img9.png",
        name: "Apple Wireless Earphones",
        rating: 3,
        price: "$89",
    },
    {
        _id: "690d9c13f914bf336c4c128f",
        image: "/assests/product_img8.png",
        name: "Bluetooth Speaker",
        rating: 4,
        price: "$299",
    },
    {
        _id: "690d9bb2f914bf336c4c1288",
        image: "/assests/product_img14.png",
        name: "Play Station 5",
        rating: 5,
        price: "$659",
    },
];

const bestSellingArr = [
    {
        _id: "690d9aa5f914bf336c4c1280",
        image: "/assests/product_img10.png",
        name: "Apple Smart Watch",
        rating: 4,
        price: "$269",
    },
    {
        _id: "690d9c13f914bf336c4c128f",
        image: "/assests/product_img8.png",
        name: "Bluetooth Speaker",
        rating: 4,
        price: "$299",
    },
    {
        _id: "690d9bb2f914bf336c4c1288",
        image: "/assests/product_img14.png",
        name: "Play Station 5",
        rating: 5,
        price: "$659",
    },
    {
        _id: "6912e1105f2bf38b78de4ba7",
        image: "/assests/product_img11.png",
        name: "Gaming Mouse by Asus",
        rating: 3,
        price: "$69",
    },
    {
        _id: "6912e10f5f2bf38b78de4ba3",
        image: "/assests/product_img9.png",
        name: "Apple Wireless Earphones",
        rating: 3,
        price: "$89",
    },
];

export default function Home() {
    return (
        <>
            <Carousel />
            <main className="py-8 w-full">
                <div className="w-full p-4 lg:w-4/5 min-w-[200px] max-w-[1400px] mx-auto">
                    <div>
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="font-semibold mt-8 mb-6">
                                Explore Popular Categories
                            </h2>
                            <Link
                                href="/products/categories"
                                className="flex flex-row items-center gap-0.5 text-blue-600 hover:text-blue-400"
                            >
                                View All <SlArrowRight />
                            </Link>
                        </div>
                        <div className="grid place-items-center grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
                            {categoriesArr.map((category) => (
                                <Link
                                    href={`/products/categories/${category._id}`}
                                    className="flex flex-col items-center gap-2"
                                    key={category.name}
                                >
                                    <div className="relative h-20 w-20 md:h-28 md:w-28">
                                        <Image
                                            src={category.image}
                                            alt="Product Category"
                                            fill
                                            className="rounded-full bg-neutral-100"
                                        />
                                    </div>
                                    <h2 className="font-semibold text-sm">
                                        {category.name}
                                    </h2>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-row items-center justify-between mt-4">
                            <h2 className="font-semibold mt-8 mb-6">
                                Best Deals For You
                            </h2>
                            <Link
                                href="/products"
                                className="flex flex-row items-center gap-0.5 text-blue-600 hover:text-blue-400"
                            >
                                View All <SlArrowRight />
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {bestProductsArr.map((product) => (
                            <ProductIcon
                                key={product.name}
                                _id={product._id}
                                image={product.image}
                                price={product.price}
                                rating={product.rating}
                                name={product.name}
                            />
                        ))}
                    </div>

                    <div>
                        <div className="flex flex-row items-center justify-between mt-4">
                            <h2 className="font-semibold mt-8 mb-6">
                                Best Selling
                            </h2>
                            <Link
                                href="/products"
                                className="flex flex-row items-center gap-0.5 text-blue-600 hover:text-blue-400"
                            >
                                View All <SlArrowRight />
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {bestSellingArr.map((product) => (
                            <ProductIcon
                                key={product.name}
                                _id={product._id}
                                image={product.image}
                                price={product.price}
                                rating={product.rating}
                                name={product.name}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-4 max-w-lg min-w-[200px] w-4/5 mx-auto">
                        <h2 className="font-semibold text-lg md:text-2xl text-center text-neutral-700">
                            Suscribe Now and Get 20% Off
                        </h2>

                        <p className="text-neutral-500! text-center w-auto">
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Eaque ipsam odio officiis.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-4 w-full gap-3 sm:gap-0">
                            <input
                                type="text"
                                placeholder="Enter your email"
                                className="min-w-0 border px-4! py-2! md:px-8! md:py-4! text-neutral-500! rounded-md! sm:rounded-r-none! sm:rounded-l-md! w-full"
                            />

                            <button className="bg-red-400 text-white px-4! py-2! md:px-8! md:py-4! border-transparent! rounded-md! sm:rounded-l-none! sm:rounded-r-md! sm:w-fit! w-full">
                                Suscribe
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
