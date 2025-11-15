"use client";

import { useState } from "react";

export default function ImageSlider({ images }: { images: string[] }) {
    const [currentImage, setCurrentImage] = useState(0);

    return (
        <>
            <div className="relative w-full aspect-square bg-neutral-100 grid place-items-center p-12">
                <img
                    src={images[currentImage]}
                    alt={"Main image"}
                    className="object-contain h-60 sm:h-80 md:h-96"
                />
            </div>
            <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, idx) => (
                    <div
                        key={idx}
                        className="relative aspect-square bg-neutral-100 cursor-pointer grid place-items-center p-6"
                        onClick={() => {
                            if (currentImage === idx) return;
                            setCurrentImage(idx);
                        }}
                    >
                        <img
                            src={img}
                            alt={`side image`}
                            className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 rounded object-contain"
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
