import { fetchServer } from "@/utils/fetchServer";
import Orders from "./Orders";
import { notFound } from "next/navigation";

export const metadata = {
    title: "My Orders",
    description: "View your orders",
};

export default async function MyOrdersPage() {
    const res = await fetchServer("order", "GET");
    if (!res.success) {
        notFound();
    }

    return <Orders ordersProp={res.data} />;
}
