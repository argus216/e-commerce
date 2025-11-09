import { fetchServer } from "@/utils/fetchServer";
import ProductUpdate from "./ProductUpdate";
import { notFound } from "next/navigation";

export default async function ProductUpdatePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetchServer(`product/${id}`, "GET");
    if (!res.success) {
        notFound();
    }

    return (
        <div>
            <h2 className="font-semibold text-neutral-600">Product update</h2>
            <ProductUpdate product={res.data} />
        </div>
    );
}
