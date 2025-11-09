"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BsUpload } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";

type CategoryOption = { _id: string; name: string };

export default function AddProduct() {
    const [images, setImages] = useState<File[]>([]);
    const imageRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // TODO: Replace with real categories fetch when GET route is available
    useEffect(() => {
        (async () => {
            const res = await fetch("/api/category");
            const data = await res.json();
            setCategories(data.data);
        })();
    }, []);

    function onPickImage() {
        imageRef.current?.click();
    }

    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImages((prev) => {
            if (prev.length >= 4) return prev; // limit 4
            return [...prev, file];
        });
        // reset input so same file can be picked again later if removed
        e.currentTarget.value = "";
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (images.length < 1) return alert("Add at least 1 image");
        if (!name || !price || !stock || !category)
            return alert("Please fill required fields");

        const formData = new FormData();
        images.forEach((f) => formData.append("images[]", f));
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("description", description);
        formData.append("category", category);

        try {
            setSubmitting(true);
            const res = await fetch("/api/product", {
                method: "POST",
                body: formData,
            }).then((r) => r.json());
            console.log(res);
            setSubmitting(false);

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            setImages([]);
            setName("");
            setPrice("");
            setStock("");
            setDescription("");
            setCategory("");
            toast.success(res.message);
        } catch (err: any) {
            setSubmitting(false);
            alert(err?.message || "Something went wrong");
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
            <div className="grid gap-4 p-6 border border-neutral-400/60 shadow">
                <h2 className="text-[1rem]! text-neutral-600!">Add Images</h2>
                <div
                    onClick={onPickImage}
                    className="relative grid place-items-center gap-4 border-dashed border-red-600 border bg-red-50 cursor-pointer min-h-40"
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple={false}
                        className="absolute hidden"
                        ref={imageRef}
                        onChange={onImageChange}
                    />
                    <IoMdImages className="text-4xl text-red-600" />
                    <div className="flex flex-row gap-2 items-center">
                        <BsUpload />
                        <p>Choose image from gallery (one at a time)</p>
                    </div>
                </div>

                <div className="grid gap-3 w-full">
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            className="relative border p-2 border-neutral-400/40 shadow flex flex-row w-full items-center gap-2"
                        >
                            <Image
                                src={URL.createObjectURL(src)}
                                alt={`product-${idx}`}
                                width={50}
                                height={50}
                                className="rounded"
                            />
                            <div className="flex-1 flex flex-col gap-2">
                                <h3 className="text-[0.9rem]! text-neutral-600!">
                                    {src.name}
                                </h3>
                                <p className="text-xs text-neutral-500">
                                    {src.size} bytes
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="w-fit! text-xs bg-red-600 text-white px-2 py-1"
                            >
                                <RiDeleteBin5Line className="text-xl!" />
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-neutral-500">
                    You can add up to 4 images. Click the area again to add
                    another.
                </p>
            </div>

            <div className="grid gap-4 p-6 border border-neutral-400/60 shadow">
                <h2 className="text-[1rem]! text-neutral-600!">
                    Product Details
                </h2>
                <label className="grid gap-1">
                    <span className="text-sm">Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border px-3 py-2"
                        placeholder="Product name"
                        required
                    />
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1">
                        <span className="text-sm">Price</span>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border px-3 py-2"
                            placeholder="0.00"
                            required
                        />
                    </label>
                    <label className="grid gap-1">
                        <span className="text-sm">Stock</span>
                        <input
                            type="number"
                            min={0}
                            step="1"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="border px-3 py-2"
                            placeholder="0"
                            required
                        />
                    </label>
                </div>

                <label className="grid gap-1">
                    <span className="text-sm">Category</span>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-neutral-600/60 text-neutral-600 rounded px-3 py-2 bg-white outline-0"
                        required
                    >
                        <option value="" disabled>
                            Select category
                        </option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-1">
                    <span className="text-sm">Description</span>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-neutral-600/60 rounded outline-0 resize-none text-neutral-600 px-3 py-2 min-h-28"
                        placeholder="Describe your product"
                    />
                </label>

                <div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-black text-white px-4 py-2 disabled:opacity-60"
                    >
                        {submitting ? "Submitting..." : "Create Product"}
                    </button>
                </div>
            </div>
        </form>
    );
}
