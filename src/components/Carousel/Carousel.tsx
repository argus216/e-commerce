"use client";

import { useState, useEffect } from "react";
import { Carousel1, Carousel2, Carousel3 } from "./Carousels";

export default function Carousel() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setActive((prev) => (prev + 1) % 3);
        }, 3000);

        return () => clearInterval(id);
    }, []);

    return (
        <div className="overflow-hidden w-full">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
            >
                <div className="min-w-full">
                    <Carousel1 />
                </div>

                <div className="min-w-full">
                    <Carousel2 />
                </div>

                <div className="min-w-full">
                    <Carousel3 />
                </div>
            </div>
        </div>
    );
}
