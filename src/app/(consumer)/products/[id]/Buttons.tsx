"use client";

import { fetchClient } from "@/utils/fetchClient";

export default function Buttons({ id }: { id: string }) {
    async function addToCart() {
        const res = await fetchClient(`cart`, "POST", {
            productId: id,
        });
        console.log(res);
    }

    async function buyNow() {}

    return (
        <div className="flex gap-3 mt-2">
            <button
                onClick={addToCart}
                className="px-4 py-2 bg-black text-white"
            >
                Add to Cart
            </button>
            <button onClick={buyNow} className="px-4 py-2 border border-black">
                Buy Now
            </button>
        </div>
    );
}
