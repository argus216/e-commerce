"use client";

import { fetchClient } from "@/utils/fetchClient";

export default function ProductUpdate({
    product,
}: {
    product: {
        _id: string;
        name: string;
        price: string;
        stock: string;
        rating: string;
        images: string;
        description: string;
    };
}) {
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const val = Object.fromEntries(formData);
        val["price"] = "$" + val["price"];

        await fetchClient(`product/${product._id}`, "POST", {
            ...val,
            stock: Number(val.stock),
        });
    }

    return (
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-row w-full">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="name"
                >
                    Name
                </label>
                <input
                    defaultValue={product.name}
                    type="text"
                    name="name"
                    id="name"
                    className="flex-2"
                />
            </div>
            <div className="flex flex-row w-full">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="price"
                >
                    Price
                </label>
                <input
                    defaultValue={Number(product.price.split("$")[1].trim())}
                    type="number"
                    name="price"
                    id="price"
                    className="flex-2"
                />
            </div>
            <div className="flex flex-row w-full">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="stock"
                >
                    Stock
                </label>
                <input
                    defaultValue={product.stock}
                    type="number"
                    name="stock"
                    id="stock"
                    className="flex-2"
                />
            </div>
            <div className="flex flex-row w-full">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="description"
                >
                    Description
                </label>
                <textarea
                    defaultValue={product.description}
                    name="description"
                    id="description"
                    className="border border-neutral-400! text-neutral-600 rounded p-2 outline-0 resize-none flex-2"
                    rows={4}
                />
            </div>

            <div className="flex flex-row justify-end">
                <button
                    type="submit"
                    className="px-4! py-2! w-fit! text-white bg-neutral-800"
                >
                    Update
                </button>
            </div>
        </form>
    );
}
