import Ratings from "./Ratings";
import Link from "next/link";

type ProductIconProps = {
    image: string;
    name: string;
    price: string;
    rating: number;
    _id: string;
};

export default function ProductIcon({
    _id,
    image,
    name,
    price,
    rating,
}: ProductIconProps) {
    return (
        <Link
            href={"/products/" + _id}
            className={"flex flex-col items-start gap-2 flex-1"}
        >
            <div className="bg-neutral-200 w-full grid place-items-center py-8 lg:py-12">
                <img
                    src={image}
                    alt={name}
                    className={"w-16 h-16 md:w-24 md:h-24 object-contain"}
                />
            </div>
            <h3 className={"font-semibold text-sm sm:text-lg"}>{name}</h3>
            <div className="flex flex-row justify-between w-full gap-2">
                <Ratings rating={rating} />
                <h3 className={"text-[0.75rem] sm:text-sm font-semibold"}>
                    {price}
                </h3>
            </div>
        </Link>
    );
}
