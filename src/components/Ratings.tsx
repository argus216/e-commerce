import { FaRegStar, FaStar } from "react-icons/fa";

export default function Ratings({ rating }: { rating: number }) {
    return (
        <div className="flex flex-row gap-1">
            {Array.from({ length: rating }).map((_, index) => (
                <FaStar key={index} className="text-red-400" />
            ))}
            {Array.from({ length: 5 - rating }).map((_, index) => (
                <FaRegStar key={index} className="" />
            ))}
        </div>
    );
}
