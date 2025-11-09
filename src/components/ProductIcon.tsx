import Ratings from "./Ratings";

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
        <a
            href={"/products/" + _id}
            className={"flex flex-col items-start gap-2 flex-1"}
        >
            <div className="bg-neutral-200 w-full grid place-items-center py-12">
                <img
                    src={image}
                    alt={name}
                    className={"w-24 h-24 object-contain"}
                />
            </div>
            <h3 className={"font-semibold"}>{name}</h3>
            <div className="flex flex-row justify-between w-full gap-2">
                <Ratings rating={rating} />
                <h3 className={"text-sm font-semibold"}>{price}</h3>
            </div>
        </a>
    );
}
