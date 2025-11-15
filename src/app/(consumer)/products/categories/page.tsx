import { fetchServer } from "@/utils/fetchServer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Categories",
    description: "Browse our product categories",
};

type Category = {
    _id: string;
    name: string;
    image: string;
};

export default async function CategoriesPage() {
    const res = await fetchServer("category", "GET");
    if (!res.success) {
        notFound();
    }
    const categories = res.data as Category[];

    return (
        <>
            <main className="py-8 w-full min-h-screen">
                <div className="w-4/5 min-w-[200px] max-w-[1400px] mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold mb-2">
                            All Categories
                        </h1>
                        <p className="text-neutral-600">
                            Browse through our wide range of product categories
                        </p>
                    </div>

                    {categories.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-neutral-600">
                                No categories found
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/products/categories/${category._id}`}
                                    className="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="relative h-16 w-16 md:h-28 md:w-28">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="rounded-full object-cover bg-neutral-100"
                                        />
                                    </div>
                                    <h2 className="font-semibold text-center text-sm">
                                        {category.name}
                                    </h2>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
