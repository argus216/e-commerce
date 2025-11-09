"use client";

import { useState } from "react";

export default function ImageSlider({ images }: { images: string[] }) {
    const [currentImage, setCurrentImage] = useState(0);

    return (
        <>
            <div className="relative w-full aspect-square bg-neutral-100 grid place-items-center">
                <img
                    src={images[currentImage]}
                    alt={"Main image"}
                    className="h-80 w-80 rounded-2xl"
                />
            </div>
            {images?.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.slice(0, 4).map((img, idx) => (
                        <div
                            key={idx}
                            className="relative aspect-square bg-neutral-100 cursor-pointer grid place-items-center"
                            onClick={() => {
                                if (currentImage === idx) return;
                                setCurrentImage(idx);
                            }}
                        >
                            <img
                                src={img}
                                alt={`side image`}
                                className="w-24 h-24 rounded"
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
