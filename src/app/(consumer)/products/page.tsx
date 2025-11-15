import ProductIcon from "@/components/ProductIcon";
import { fetchServer } from "@/utils/fetchServer";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Products",
    description: "Browse our latest products",
};

type Product = {
    _id: string;
    name: string;
    price: string; // API currently formats price as string like "$ 100"
    rating: number;
    images: string[];
};

export default async function ProductsPage() {
    const res = await fetchServer("product", "GET");
    if (!res.success) {
        notFound();
    }
    const products: Product[] = res.data as Product[];

    return (
        <>
            <main className="py-8 w-full min-h-screen">
                <div className="w-4/5 min-w-[300px] max-w-[1400px] mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold mb-2">
                            All Products
                        </h1>
                        <p className="text-neutral-600">
                            Browse our latest products
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
                                    image={p.images?.[0]}
                                    name={p.name}
                                    price={p.price}
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
