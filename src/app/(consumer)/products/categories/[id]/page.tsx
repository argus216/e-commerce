import ProductIcon from "@/components/ProductIcon";
import { fetchServer } from "@/utils/fetchServer";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Categories",
    description: "Browse our all collection of categories of products.",
};

type Product = {
    _id: string;
    name: string;
    price: string | number;
    rating: number;
    image: string;
};

export default async function CategoryProductsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetchServer(`category/${id}`, "GET");
    if (!res?.success) {
        notFound();
    }
    const products = (res.data.products as Product[]) || [];

    return (
        <>
            <main className="py-8 w-full min-h-screen">
                <div className="w-4/5 min-w-[200px] max-w-[1400px] mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold mb-2">
                            {res.data.name || "Category"}
                        </h1>
                        <p className="text-neutral-600">
                            Browse products in this category
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-neutral-600">
                                No products found
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {products.map((p) => (
                                <ProductIcon
                                    key={p._id}
                                    _id={p._id}
                                    image={p.image}
                                    name={p.name}
                                    price={
                                        typeof p.price === "number"
                                            ? `$ ${p.price}`
                                            : p.price
                                    }
                                    rating={p.rating || 0}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
