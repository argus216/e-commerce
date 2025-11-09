"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DataForm() {
    const router = useRouter();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        const body = {
            address: {
                landmark: data.landmark,
                street: data.street,
                city: data.city,
                state: data.state,
                country: data.country,
                pincode: data.pincode,
            },
            phone: data.phone,
            description: data.description,
        };
        try {
            const res = await fetch("/api/seller", {
                method: "PUT",
                body: JSON.stringify(body),
            });
            const resData = await res.json();
            if (!resData.success) {
                if (resData.error.name === "ZodError") {
                    toast.error(JSON.parse(resData.error.message)[0].message);
                    return;
                }
                toast.error(resData.message);
                return;
            }
            toast.success(resData.message);
            setTimeout(() => {
                router.refresh();
            }, 2000);
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
        }
    }

    return (
        <div className="bg-white rounded w-3/4 max-w-[800px] min-w-[600px] border border-neutral-400/40 p-12 shadow">
            <h1>Enter Your Details</h1>
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="flex flex-row w-full gap-4">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full">
                            <label className="font-semibold block text-sm my-2!">
                                Landmark
                            </label>
                            <input
                                name="landmark"
                                type="text"
                                className="w-full!"
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="font-semibold block text-sm my-2!">
                            Street
                        </label>
                        <input name="street" type="text" className="w-full!" />
                    </div>
                </div>

                <div className="flex flex-row w-full gap-4">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full">
                            <label className="font-semibold block text-sm my-2!">
                                City
                            </label>
                            <input
                                name="city"
                                type="text"
                                className="w-full!"
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="font-semibold block text-sm my-2!">
                            State
                        </label>
                        <input name="state" type="text" className="w-full!" />
                    </div>
                </div>

                <div className="flex flex-row w-full gap-4">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full">
                            <label className="font-semibold block text-sm my-2!">
                                Country
                            </label>
                            <input
                                name="country"
                                type="text"
                                className="w-full!"
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="font-semibold block text-sm my-2!">
                            Pincode
                        </label>
                        <input name="pincode" type="text" className="w-full!" />
                    </div>
                </div>

                <div className="w-full flex flex-row gap-4">
                    <div className="w-full">
                        <label className="font-semibold block text-sm my-2!">
                            Phone Number
                        </label>
                        <input name="phone" type="text" className="w-full!" />
                    </div>
                </div>
                <div className="w-full">
                    <label className="font-semibold block text-sm my-2!">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        cols={50}
                        name="description"
                        className="w-full! border border-neutral-300 p-4 resize-none"
                    />
                </div>
                <button className="mt-2 bg-neutral-800 text-white">
                    Submit
                </button>
            </form>
        </div>
    );
}
