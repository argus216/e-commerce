"use client";

import { fetchClient } from "@/utils/fetchClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";

export default function UserProfile({ user }: { user: any }) {
    const router = useRouter();
    const { update, data: session } = useSession();
    const [showImageUpload, setShowImageUpload] = useState(false);
    const profilePicRef = useRef<HTMLInputElement>(null);
    const [currentProfilePic, setCurrentProfilePic] = useState<File | null>(
        null
    );

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const entries = Object.fromEntries(formData);
        entries["name"] = entries["firstName"] + " " + entries["lastName"];
        const data: any = {};
        Object.keys(entries).forEach((key) => {
            if (key === "firstName" || key === "lastName") return;
            if (user[key] !== entries[key]) {
                data[key] = entries[key];
            }
        });

        if (Object.keys(data).length === 0) {
            toast.error("No changes made.");
            return;
        }
        const res = await fetchClient("user", "PUT", data);
        if (res.success) {
            await update({
                user: {
                    ...session?.user,
                    ...data,
                },
            });
        }
        router.refresh();
    }

    async function handleImageUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const res = await fetch("/api/user/update-image", {
            method: "POST",
            body: formData,
        })
            .then((r) => r.json())
            .catch((e) => console.log(e));

        if (res.success) {
            await update({
                user: {
                    ...session?.user,
                    image: res.data.url,
                },
            });
            toast.success("Profile picture updated");
            setShowImageUpload(false);
        } else {
            toast.error(res.message);
        }
        router.refresh();
    }

    return (
        <>
            <div className="relative h-32 bg-neutral-100 rounded-xl w-full">
                <div className="absolute p-2 rounded-full bg-white left-1/2 top-1/2">
                    <img
                        alt="Profile"
                        src={user.image}
                        className="w-24 h-24 rounded-full bg-neutral-200"
                    />
                    <div className="relative">
                        <button
                            className="absolute right-0 bottom-0 p-2! bg-white rounded-full! border-neutral-400/40! shadow-2xl! w-fit!"
                            onClick={() => setShowImageUpload(true)}
                        >
                            <MdEdit />
                        </button>
                    </div>
                </div>
            </div>

            {showImageUpload && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center"
                    onClick={() => setShowImageUpload(false)}
                >
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-2">
                            Change Profile Picture
                        </h2>
                        <form onSubmit={handleImageUpdate}>
                            <input
                                ref={profilePicRef}
                                type="file"
                                name="image"
                                id="image"
                                className="hidden"
                                onChange={(e) =>
                                    setCurrentProfilePic(e.target.files![0])
                                }
                            />
                            <div
                                className="border border-neutral-400/40 rounded-lg p-2 border-dashed flex items-center justify-center"
                                onClick={() => profilePicRef.current?.click()}
                            >
                                {currentProfilePic ? (
                                    <img
                                        alt="Profile"
                                        src={URL.createObjectURL(
                                            currentProfilePic
                                        )}
                                        className="w-24 h-24 rounded-full bg-neutral-200"
                                    />
                                ) : (
                                    <p>Upload Image</p>
                                )}
                            </div>
                            <div className="flex flex-row gap-2 mt-4">
                                <button
                                    type="button"
                                    className="w-fit! border-neutral-400/40! bg-white"
                                    onClick={() => setShowImageUpload(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-fit! border-neutral-400/40! bg-neutral-800 text-white"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <form className="grid gap-4 mt-16" onSubmit={handleFormSubmit}>
                <div className="flex flex-row gap-2 w-full items-center">
                    <label
                        className="text-sm text-neutral-600 flex-1"
                        htmlFor="firstName"
                    >
                        Full Name
                    </label>
                    <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            defaultValue={user.name.split(" ")[0]}
                            className="w-full border border-neutral-400/40 rounded-lg p-2"
                        />
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            defaultValue={user.name.split(" ")[1]}
                            className="w-full border border-neutral-400/40 rounded-lg p-2"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full items-center">
                    <label
                        className="text-sm text-neutral-600 flex-1"
                        htmlFor="phone"
                    >
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phone"
                        maxLength={10}
                        id="phone"
                        defaultValue={user.phone}
                        className="w-full border border-neutral-400/40 rounded-lg p-2 flex-2"
                    />
                </div>
                <div className="flex flex-row gap-2 w-full items-center">
                    <label
                        className="text-sm text-neutral-600 flex-1"
                        htmlFor="description"
                    >
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        id="description"
                        defaultValue={user.description}
                        className="w-full border border-neutral-400/40 rounded-lg p-2 flex-2 resize-none outline-0 text-sm"
                    />
                </div>
                <div className="flex flex-row gap-4 w-full items-center justify-end mt-4">
                    <button className="w-fit! border-red-400/40! bg-red-600! text-white">
                        Delete Seller Acocunt
                    </button>
                    <button className="w-fit! border-neutral-400/40! bg-neutral-800 text-white">
                        Save Changes
                    </button>
                </div>
            </form>
        </>
    );
}
