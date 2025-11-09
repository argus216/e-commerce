"use client";

export default function UpdateAddress({
    user: { address },
}: {
    user: {
        address: {
            landmark: string;
            street: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
        };
    };
}) {
    async function handleSubmit() {}
    return (
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-2 items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="landmark"
                >
                    Landmark
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        defaultValue={address.landmark}
                        type="text"
                        name="landmark"
                        id="landmark"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="street"
                >
                    Street
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        defaultValue={address.street}
                        type="text"
                        name="street"
                        id="street"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="city"
                >
                    City
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        defaultValue={address.city}
                        type="text"
                        name="city"
                        id="city"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="state"
                >
                    State
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        defaultValue={address.state}
                        type="text"
                        name="state"
                        id="state"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="country"
                >
                    Country
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        defaultValue={address.country}
                        type="text"
                        name="country"
                        id="country"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <label
                    className="text-sm text-neutral-600 flex-1"
                    htmlFor="pincode"
                >
                    Pincode
                </label>
                <div className="flex flex-row gap-2 flex-2 p-0 m-0">
                    <input
                        defaultValue={address.pincode}
                        type="text"
                        name="pincode"
                        id="pincode"
                        className="w-full p-2 border border-neutral-400/40 rounded-xl"
                    />
                </div>
            </div>
            <div className="flex justify-end w-full">
                <button className="border-0! bg-neutral-800! w-fit! text-white! text-sm!">
                    Update
                </button>
            </div>
        </form>
    );
}
