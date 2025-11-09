import { fetchServer } from "@/utils/fetchServer";
import { notFound } from "next/navigation";

type Product = {
    _id: string;
    name: string;
    price: string;
    stock: string;
    rating: string;
    image: string;
};

export default async function AllProductsPage() {
    const res = await fetchServer("seller/products", "GET");
    console.log(res);
    if (!res) {
        notFound();
    }
    const products = res.data.products as Product[];

    return (
        <div>
            <h2 className="font-semibold text-neutral-600 mb-6">
                All Products
            </h2>
            {products.length === 0 ? (
                <p>
                    No product to show. Start selling product by first adding
                    product.
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-around items-center w-full">
                        <p>Image</p>
                        <p>Name</p>
                        <p>Price</p>
                        <p>Stock</p>
                    </div>
                    {products.map((p) => (
                        <a
                            href={`/seller/products/${p._id}`}
                            className="flex flex-row justify-around items-center w-full border border-neutral-400/40 p-2 shadow"
                        >
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-16 h-16"
                            />
                            <p>{p.name}</p>
                            <p>{p.price}</p>
                            <p>{p.stock}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
