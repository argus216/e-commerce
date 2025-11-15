"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsUpload } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";

export default function CreateCategory() {
    const imageRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>(null);
    return (
        <div className="grid gap-4">
            <h1 className="text-xl! text-neutral-600!">Create Category</h1>
            <div className="flex flex-col gap-4 justify-end">
                <div className="flex flex-row">
                    <label
                        htmlFor="image"
                        className="text-sm text-neutral-600 flex-1"
                    >
                        Image
                    </label>
                    <div className="flex-2 w-full grid grid-cols-2 gap-4 h-40">
                        <div
                            className="relative grid place-items-center gap-4 border-dashed border-red-600 border bg-red-50 cursor-pointer"
                            onClick={() => {
                                imageRef.current?.click();
                            }}
                        >
                            <input
                                onChange={(e) => setImage(e.target.files![0])}
                                ref={imageRef}
                                className="hidden"
                                type="file"
                                name="image"
                                id="image"
                            />
                            <IoMdImages className="text-6xl" />
                            <div className="flex flex-row gap-2 items-center">
                                <BsUpload />
                                <p>Choose image from gallary</p>
                            </div>
                        </div>
                        <div className="relative grid place-items-center gap-4 border-dashed border-red-600 border bg-red-50 h-40">
                            {image !== null ? (
                                <img
                                    className="w-full h-36 object-contain"
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                />
                            ) : (
                                "Preview"
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <label
                        htmlFor="name"
                        className="text-sm text-neutral-600 flex-1"
                    >
                        Name
                    </label>
                    <div className="flex-2 w-full">
                        <input
                            ref={nameRef}
                            type="text"
                            name="name"
                            id="name"
                        />
                    </div>
                </div>

                <button
                    onClick={async () => {
                        if (!image) {
                            toast.error("Please select an image.");
                        }
                        const formData = new FormData();
                        formData.append("image", image!);
                        formData.append("name", nameRef.current!.value);

                        try {
                            const res = await fetch("/api/category", {
                                method: "POST",
                                body: formData,
                            });
                            const data = await res.json();
                            if (!data.success) {
                                toast.error(data.message);
                            } else {
                                toast.success(data.message);
                            }
                        } catch (error: any) {
                            console.log(error);
                            toast.error(
                                error?.message || "Something went wrong"
                            );
                        }
                    }}
                    className="ml-auto w-fit! text-white! bg-neutral-800! border-0!"
                >
                    Create
                </button>
            </div>
        </div>
    );
}
