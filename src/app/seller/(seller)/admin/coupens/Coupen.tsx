"use client";

import { fetchClient } from "@/utils/fetchClient";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Coupon = {
    _id: string;
    code: string;
    discount: number;
    minPurchase?: number;
    maxDiscount?: number;
    expiryDate: string;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
};

export default function Coupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        minPurchase: "",
        maxDiscount: "",
        expiryDate: "",
        isActive: true,
        usageLimit: "",
    });

    const fetchCoupons = useCallback(async () => {
        if (loading) return;
        try {
            setLoading(true);
            const res = await fetchClient("coupen", "GET", undefined, false);
            if (res.success) {
                setCoupons(res.data);
            } else {
                toast.error(res.message || "Failed to load coupons");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    async function handleCreateCoupon(e: React.FormEvent) {
        e.preventDefault();
        try {
            const couponData = {
                code: formData.code,
                discount: parseFloat(formData.discount),
                minPurchase: formData.minPurchase
                    ? parseFloat(formData.minPurchase)
                    : undefined,
                maxDiscount: formData.maxDiscount
                    ? parseFloat(formData.maxDiscount)
                    : undefined,
                expiryDate: formData.expiryDate,
                isActive: formData.isActive,
                usageLimit: formData.usageLimit
                    ? parseInt(formData.usageLimit)
                    : undefined,
            };

            const res = await fetchClient("coupen", "POST", couponData, false);
            if (res.success) {
                toast.success("Coupon created successfully");
                setFormData({
                    code: "",
                    discount: "",
                    minPurchase: "",
                    maxDiscount: "",
                    expiryDate: "",
                    isActive: true,
                    usageLimit: "",
                });
                fetchCoupons();
            } else {
                toast.error(res.message || "Failed to create coupon");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to create coupon");
        }
    }

    function isExpired(expiryDate: string) {
        return new Date(expiryDate) < new Date();
    }

    function isExhausted(coupon: Coupon) {
        return (
            coupon.usageLimit !== undefined &&
            coupon.usedCount >= coupon.usageLimit
        );
    }

    return (
        <div className="grid gap-6">
            <h1 className="text-xl! text-neutral-600!">Coupons</h1>

            <div className="border border-neutral-200 p-6 rounded-lg grid gap-4">
                <h2 className="font-semibold text-lg">Create New Coupon</h2>
                <form onSubmit={handleCreateCoupon} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">
                                Code *
                            </span>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    })
                                }
                                className="border px-3 py-2"
                                placeholder="SAVE10"
                                required
                            />
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">
                                Discount (%) *
                            </span>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.discount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        discount: e.target.value,
                                    })
                                }
                                className="border px-3 py-2"
                                placeholder="10"
                                required
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">
                                Min Purchase ($)
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.minPurchase}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        minPurchase: e.target.value,
                                    })
                                }
                                className="border px-3 py-2"
                                placeholder="0"
                            />
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">
                                Max Discount ($)
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.maxDiscount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        maxDiscount: e.target.value,
                                    })
                                }
                                className="border px-3 py-2"
                                placeholder="No limit"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">
                                Expiry Date *
                            </span>
                            <input
                                type="datetime-local"
                                value={formData.expiryDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        expiryDate: e.target.value,
                                    })
                                }
                                className="border px-3 py-2"
                                required
                            />
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">
                                Usage Limit
                            </span>
                            <input
                                type="number"
                                min="1"
                                value={formData.usageLimit}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        usageLimit: e.target.value,
                                    })
                                }
                                className="border px-3 py-2"
                                placeholder="Unlimited"
                            />
                        </label>
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    isActive: e.target.checked,
                                })
                            }
                        />
                        <span className="text-sm text-neutral-600">Active</span>
                    </label>

                    <button
                        type="submit"
                        className="bg-neutral-800! text-white! px-4 py-2 border-0! w-fit! ml-auto"
                    >
                        Create Coupon
                    </button>
                </form>
            </div>

            {/* Coupons List */}
            <div className="grid gap-4">
                <h2 className="font-semibold text-lg">All Coupons</h2>
                {coupons.length === 0 ? (
                    <p className="text-neutral-600">No coupons found</p>
                ) : (
                    <div className="grid gap-3">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                className={`border p-4 rounded-lg grid gap-2 ${
                                    !coupon.isActive ||
                                    isExpired(coupon.expiryDate) ||
                                    isExhausted(coupon)
                                        ? "opacity-60 bg-neutral-50"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-lg">
                                            {coupon.code}
                                        </span>
                                        <span className="text-sm text-neutral-600">
                                            {coupon.discount}% OFF
                                        </span>
                                        {!coupon.isActive && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                                Inactive
                                            </span>
                                        )}
                                        {isExpired(coupon.expiryDate) && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                                Expired
                                            </span>
                                        )}
                                        {isExhausted(coupon) && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                                Exhausted
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600">
                                    {coupon.minPurchase && (
                                        <p>
                                            Min Purchase: ${coupon.minPurchase}
                                        </p>
                                    )}
                                    {coupon.maxDiscount && (
                                        <p>
                                            Max Discount: ${coupon.maxDiscount}
                                        </p>
                                    )}
                                    <p>
                                        Expires:{" "}
                                        {new Date(
                                            coupon.expiryDate
                                        ).toLocaleDateString()}
                                    </p>
                                    {coupon.usageLimit && (
                                        <p>
                                            Used: {coupon.usedCount} /{" "}
                                            {coupon.usageLimit}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
