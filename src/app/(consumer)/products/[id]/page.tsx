import Ratings from "@/components/Ratings";
import { fetchServer } from "@/utils/fetchServer";
import { notFound } from "next/navigation";
import ImageSlider from "./ImageSlider";
import Buttons from "./Buttons";
import Link from "next/link";

export const metadata = {
    title: "Product Details",
    description: "View the details of a product",
};

type Review = {
    _id: string;
    rating: number;
    comment?: string;
    user?: { name?: string };
};

type Product = {
    _id: string;
    name: string;
    price: string;
    description: string;
    images: string[];
    rating: number;
    reviews?: Review[];
    seller: {
        _id: string;
        phone: string;
        user: {
            name: string;
            email: string;
            image: string;
        };
    };
};

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetchServer(`product/${id}`, "GET");
    if (!res?.success) {
        notFound();
    }
    const product = res.data as Product;

    return (
        <>
            <main className="py-8 w-full min-h-screen">
                <div className="w-4/5 min-w-[300px] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col md:items-end gap-4">
                        <ImageSlider images={res.data.images} />
                    </div>

                    <div className="grid gap-4 content-start">
                        <h1 className="text-2xl font-semibold">
                            {product.name}
                        </h1>
                        <div className="flex items-center justify-between">
                            <Ratings rating={product.rating || 0} />
                            <span className="text-xl font-semibold">
                                {product.price}
                            </span>
                        </div>

                        <Buttons id={product._id} />

                        <section className="mt-6">
                            <h2 className="font-semibold mb-2">Description</h2>
                            <p className="text-neutral-700 whitespace-pre-wrap">
                                {product.description ||
                                    "No description provided."}
                            </p>
                        </section>

                        <section className="mt-6">
                            <h2 className="font-semibold mb-2">
                                Seller Details
                            </h2>
                            <Link
                                href={`/seller/${product.seller._id}`}
                                className="flex items-center gap-4"
                            >
                                <img
                                    src={product.seller.user.image}
                                    alt="Seller"
                                    className="rounded-full w-10 h-10 object-cover"
                                />
                                <div>
                                    <p className="font-semibold">
                                        {product.seller.user.name}
                                    </p>
                                    <div className="flex flex-row gap-2">
                                        <p className="text-sm text-neutral-600">
                                            {product.seller.user.email}
                                        </p>
                                        <p className="text-sm text-neutral-600">
                                            +91-{product.seller.phone}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </section>

                        <section className="mt-6">
                            <h2 className="font-semibold mb-3">Reviews</h2>
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="grid gap-3">
                                    {product.reviews.map((rev) => (
                                        <div
                                            key={rev._id}
                                            className="border border-neutral-200 p-3 rounded"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-neutral-600">
                                                    {rev.user?.name ||
                                                        "Anonymous"}
                                                </span>
                                                <Ratings
                                                    rating={rev.rating || 0}
                                                />
                                            </div>
                                            {rev.comment && (
                                                <p className="text-sm mt-2 text-neutral-700">
                                                    {rev.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-neutral-600">
                                    No reviews yet.
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
