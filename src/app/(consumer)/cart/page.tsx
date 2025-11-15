import { fetchServer } from "@/utils/fetchServer";
import Cart from "./Cart";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cart",
    description: "View your cart",
};

export default async function CartPage() {
    const cart = await fetchServer("cart", "GET");
    if (!cart.success) {
        notFound();
    }

    return <Cart cartProp={cart.data} />;
}
