"use client";

import { useState } from "react";
import { Carousel1, Carousel2, Carousel3 } from "./Carousels";

const arr = [];

export default function Carousel() {
    const [active, setActive] = useState(0);

    return (
        <div className="w-[300svw] overflow-hidden flex">
            <Carousel1 />
            <Carousel2 />
            <Carousel3 />
        </div>
    );
}
