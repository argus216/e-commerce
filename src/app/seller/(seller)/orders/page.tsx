import { fetchServer } from "@/utils/fetchServer";
import { notFound } from "next/navigation";
import Orders from "./Orders";

export const metadata = {
    title: "Sold Orders",
    description: "View your products sold to different customers.",
};

export default async function OrdersPage() {
    const res = await fetchServer("seller/orders", "GET");
    if (!res.success) {
        notFound();
    }

    return <Orders ordersProp={res.data} />;
}
