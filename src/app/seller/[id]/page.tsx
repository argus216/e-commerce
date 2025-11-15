import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductIcon from "@/components/ProductIcon";
import Ratings from "@/components/Ratings";
import { fetchServer } from "@/utils/fetchServer";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Seller Profile",
    description: "View the profile of a seller",
};

type Seller = {
    _id: string;
    user: {
        name: string;
        email: string;
        image: string;
    };
    rating: number;
    products: {
        _id: string;
        name: string;
        price: string;
        rating: string;
        image: string;
    }[];
    phone: string;
    createdAt: Date;
    address: {
        landmark: string;
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
};

export default async function SellerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetchServer(`seller/${id}`, "GET");
    const seller = res.data as Seller;
    if (!res.success) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className="min-h-screen w-3/5 mx-auto min-w-[1000px]">
                <div className="w-4/5 min-w-[400px] max-w-[1000px] mx-auto grid gap-6 py-8">
                    <h1 className="text-3xl font-semibold">Seller Profile</h1>
                    <div className="flex gap-6">
                        <img
                            src={seller.user.image}
                            alt={seller.user.name}
                            className="w-24 h-24 rounded-full"
                        />
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-semibold">
                                {seller.user.name}
                            </h2>
                            <Ratings rating={seller.rating} />
                            <div className="flex gap-4">
                                <p className="text-neutral-600">
                                    {seller.user.email}
                                </p>
                                <p className="text-neutral-600">
                                    +91-{seller.phone}
                                </p>
                            </div>
                            <p className="text-neutral-600">{`${seller.address.street}, ${seller.address.landmark}, ${seller.address.city}, ${seller.address.state}, ${seller.address.country} - ${seller.address.pincode}`}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold">Products</h2>
                        {seller.products.length === 0 ? (
                            <p>No products found</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {seller.products.map((p: any) => (
                                    <ProductIcon key={p._id} {...p} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
