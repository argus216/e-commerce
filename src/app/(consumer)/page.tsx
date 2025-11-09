import Carousel from "@/components/Carousel/Carousel";
import { Carousel1 } from "@/components/Carousel/Carousels";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductIcon from "@/components/ProductIcon";
import Image from "next/image";
import { SlArrowRight } from "react-icons/sl";

const categoriesArr = [
    {
        _id: "6909e0b0c104f0b08a522ade",
        name: "Electronics",
        image: "/assests/7.jpeg",
        link: "/products/categries/electronics",
    },
    {
        _id: "6909e0c0c104f0b08a522ae1",
        name: "Fashion",
        image: "/assests/17.jpeg",
        link: "/products/categries/fashion",
    },
    {
        _id: "6909e209c104f0b08a522ae6",
        name: "Luxury",
        image: "/assests/8.jpeg",
        link: "/products/categries/luxury",
    },
    {
        _id: "6909e24fc104f0b08a522ae8",
        name: "Home Dec",
        image: "/assests/15.jpeg",
        link: "/products/categries/home-decor",
    },
    {
        _id: "6909e24fc104f0b08a522ae9",
        name: "Health & Beauty",
        image: "/assests/9.jpeg",
        link: "/products/categries/health-beauty",
    },
    {
        _id: "6909e24fc104f0b08a522aea",
        name: "Groceries",
        image: "/assests/26.jpeg",
        link: "/products/categries/groceries",
    },
    {
        _id: "6909e24fc104f0b08a522aeb",
        name: "Sneakers",
        image: "/assests/25.jpeg",
        link: "/products/categries/sneakers",
    },
];

const bestProductsArr = [
    {
        _id: "",
        image: "/assests/product_img12.png",
        name: "Smart Home Cleaner",
        rating: 2,
        price: "$299",
    },
    {
        _id: "",
        image: "/assests/product_img10.png",
        name: "Apple Smart Watch",
        rating: 4,
        price: "$269",
    },
    {
        _id: "",
        image: "/assests/product_img9.png",
        name: "Apple Wireless Earphones",
        rating: 3,
        price: "$89",
    },
    {
        _id: "",
        image: "/assests/product_img8.png",
        name: "Bluetooth Speaker",
        rating: 4,
        price: "$299",
    },
    {
        _id: "",
        image: "/assests/product_img14.png",
        name: "Play Station 5",
        rating: 5,
        price: "$659",
    },
];

const bestSellingArr = [
    {
        _id: "",
        image: "/assests/product_img10.png",
        name: "Apple Smart Watch",
        rating: 4,
        price: "$269",
    },
    {
        _id: "",
        image: "/assests/product_img8.png",
        name: "Bluetooth Speaker",
        rating: 4,
        price: "$299",
    },
    {
        _id: "",
        image: "/assests/product_img14.png",
        name: "Play Station 5",
        rating: 5,
        price: "$659",
    },
    {
        _id: "",
        image: "/assests/product_img11.png",
        name: "Gaming Mouse by Asus",
        rating: 3,
        price: "$69",
    },
    {
        _id: "",
        image: "/assests/product_img9.png",
        name: "Apple Wireless Earphones",
        rating: 3,
        price: "$89",
    },
];

export default function Home() {
    return (
        <>
            <Carousel1 />
            <main className="py-8 w-full">
                <div className="w-4/5 min-w-[400px] max-w-[1400px] mx-auto">
                    <div>
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="font-semibold mt-8 mb-6">
                                Explore Popular Categories
                            </h2>
                            <a
                                href="/product/categories"
                                className="flex flex-row items-center gap-0.5 text-blue-600 hover:text-blue-400"
                            >
                                View All <SlArrowRight />
                            </a>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            {categoriesArr.map((category) => (
                                <a
                                    href={`/products/categories/${category._id}`}
                                    className="flex flex-col items-center gap-2"
                                    key={category.name}
                                >
                                    <div className="relative h-[100px] w-[100px]">
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
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-row items-center justify-between mt-4">
                            <h2 className="font-semibold mt-8 mb-6">
                                Best Deals For You
                            </h2>
                            <a
                                href="/products"
                                className="flex flex-row items-center gap-0.5 text-blue-600 hover:text-blue-400"
                            >
                                View All <SlArrowRight />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-row gap-6">
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
                            <a
                                href="/products"
                                className="flex flex-row items-center gap-0.5 text-blue-600 hover:text-blue-400"
                            >
                                View All <SlArrowRight />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-row gap-6">
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
                </div>
            </main>
        </>
    );
}
