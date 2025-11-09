"use client";

import { fetchClient } from "@/utils/fetchClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoAdd, IoRemove } from "react-icons/io5";
import toast from "react-hot-toast";

type CartItem = {
    product: {
        _id: string;
        name: string;
        price: number | string;
        image: string;
        rating: number;
        stock: number;
    };
    quantity: number;
};

type Cart = {
    _id: string;
    items: CartItem[];
};

export default function Cart() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Address form state
    const [address, setAddress] = useState({
        landmark: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    // Payment method state
    const [paymentMethod, setPaymentMethod] = useState<
        "CASH_ON_DELIVERY" | "ONLINE_PAYMENT"
    >("CASH_ON_DELIVERY");

    // Coupon state
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discount: number;
        minPurchase: number;
        maxDiscount: number;
    } | null>(null);
    const coupenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCart();
    }, []);

    async function fetchCart() {
        setLoading(true);
        const res = await fetchClient("cart", "GET", undefined, false);
        if (res.success) {
            setCart(res.data);
        }
        setLoading(false);
    }

    async function updateQuantity(productId: string, newQuantity: number) {
        if (newQuantity < 1) return;
        setUpdating(productId);
        const res = await fetchClient("cart/item", "PUT", {
            productId,
            quantity: newQuantity,
        });
        if (res.success) {
            setCart((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    items: prev.items.map((item) => {
                        if (item.product._id === productId) {
                            return {
                                ...item,
                                quantity: newQuantity,
                            };
                        }
                        return item;
                    }),
                };
            });
        }
        setUpdating(null);
    }

    async function removeItem(productId: string) {
        setUpdating(productId);
        const res = await fetchClient(
            `cart/item?productId=${productId}`,
            "DELETE",
            undefined
        );

        if (res.success) {
            setCart((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    items: prev.items.filter(
                        (item) => item.product._id !== productId
                    ),
                };
            });
        }
        setUpdating(null);
    }

    async function clearCart() {
        if (!confirm("Are you sure you want to clear all items from cart?"))
            return;

        const res = await fetchClient("cart/clear", "DELETE", undefined);

        if (res.success) {
            setCart(res.data);
            toast.success("Cart cleared");
        } else {
            toast.error(res.message || "Failed to clear cart");
        }
    }

    async function applyCoupon() {
        if (!coupenRef.current?.value) {
            toast.error("Please enter a coupon code");
            return;
        }
        const res = await fetchClient(
            `coupen/${coupenRef.current?.value}`,
            "GET",
            undefined
        );
        console.log(res);
        if (res.success) {
            setAppliedCoupon(res.data);
        }
    }

    function removeCoupon() {
        setAppliedCoupon(null);
        toast.success("Coupon removed");
    }

    function calculateSubtotal() {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => {
            const price =
                typeof item.product.price === "string"
                    ? parseFloat(item.product.price.replace(/[^0-9.]/g, ""))
                    : item.product.price;
            return total + price * item.quantity;
        }, 0);
    }

    function calculateTotal() {
        const subtotal = calculateSubtotal();
        const discountAmount = calculateDiscount();
        return subtotal - discountAmount;
    }

    function calculateDiscount() {
        const subtotal = calculateSubtotal();
        if (appliedCoupon?.minPurchase && subtotal < appliedCoupon?.minPurchase)
            return 0;
        const discountAmount =
            (subtotal * (appliedCoupon?.discount ?? 0)) / 100;

        if (
            appliedCoupon?.maxDiscount &&
            discountAmount > appliedCoupon?.maxDiscount
        )
            return appliedCoupon?.maxDiscount;

        return discountAmount;
    }

    async function placeOrder() {
        if (
            !address.landmark ||
            !address.street ||
            !address.city ||
            !address.state ||
            !address.country ||
            !address.pincode
        ) {
            toast.error("Please fill in all address fields");
            return;
        }

        if (address.pincode.length !== 6) {
            toast.error("Pincode must be 6 digits");
            return;
        }

        if (!cart || cart.items.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        const orderData = {
            shippingAddress: {
                landmark: address.landmark,
                street: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                pincode: address.pincode,
            },
            paymentMethod,
            coupen: appliedCoupon?.code || null,
            totalPrice: calculateTotal(),
        };

        const res = await fetchClient("order", "POST", orderData);
        if (res.success) {
            router.push("/orders");
        }
    }

    if (loading) {
        return (
            <>
                <main className="py-8 w-full min-h-screen">
                    <div className="w-4/5 min-w-[400px] max-w-[1400px] mx-auto">
                        <p className="text-center">Loading cart...</p>
                    </div>
                </main>
            </>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <main className="py-8 w-full min-h-screen">
                <div className="w-4/5 min-w-[400px] max-w-[1400px] mx-auto">
                    <h1 className="text-3xl font-semibold mb-4">
                        Shopping Cart
                    </h1>
                    <div className="text-center py-20">
                        <p className="text-neutral-600 text-lg mb-4">
                            Your cart is empty
                        </p>
                        <button
                            onClick={() => router.push("/products")}
                            className="bg-black text-white px-6 py-2"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="py-8 w-full min-h-screen">
            <div className="w-4/5 min-w-[400px] max-w-[1400px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-semibold">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 text-sm w-fit! border-0!"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    {/* Cart Items */}
                    <div>
                        <div className="grid gap-4">
                            {cart.items.map((item) => {
                                const price =
                                    typeof item.product.price === "string"
                                        ? parseFloat(
                                              item.product.price.replace(
                                                  /[^0-9.]/g,
                                                  ""
                                              )
                                          )
                                        : item.product.price;
                                const itemTotal = price * item.quantity;

                                return (
                                    <div
                                        key={item.product._id}
                                        className="border border-neutral-200 p-4 rounded-2xl flex gap-4 flex-row items-center h-max"
                                    >
                                        <div className="relative w-32 h-32 bg-neutral-100 rounded-2xl grid place-items-center">
                                            <img
                                                src={
                                                    item.product.image ||
                                                    "/assests/product_img1.png"
                                                }
                                                alt={item.product.name}
                                                className="object-contain rounded-2xl h-20 w-20"
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-between w-full">
                                            <h3 className="font-semibold">
                                                {item.product.name}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-neutral-300 rounded">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product
                                                                    ._id,
                                                                item.quantity -
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            updating ===
                                                                item.product
                                                                    ._id ||
                                                            item.quantity <= 1
                                                        }
                                                        className="px-2 py-1 disabled:opacity-50"
                                                    >
                                                        <IoRemove />
                                                    </button>
                                                    <span className="px-3 py-1 min-w-12 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product
                                                                    ._id,
                                                                item.quantity +
                                                                    1
                                                            )
                                                        }
                                                        disabled={
                                                            updating ===
                                                                item.product
                                                                    ._id ||
                                                            item.quantity >=
                                                                item.product
                                                                    .stock
                                                        }
                                                        className="px-2 py-1 disabled:opacity-50"
                                                    >
                                                        <IoAdd />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="font-semibold">
                                                ${itemTotal.toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    removeItem(item.product._id)
                                                }
                                                disabled={
                                                    updating ===
                                                    item.product._id
                                                }
                                                className="text-red-600 hover:text-red-700 disabled:opacity-50 border-0! w-fit!"
                                            >
                                                <RiDeleteBin5Line className="font-semibold text-xl" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 grid gap-6">
                        {/* Address Form */}
                        <div className="border border-neutral-200 p-4 rounded-lg grid gap-4">
                            <h2 className="font-semibold text-lg">
                                Shipping Address
                            </h2>
                            <div className="grid gap-3">
                                <input
                                    type="text"
                                    placeholder="Landmark"
                                    value={address.landmark}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            landmark: e.target.value,
                                        })
                                    }
                                    className="border px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Street"
                                    value={address.street}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            street: e.target.value,
                                        })
                                    }
                                    className="border px-3 py-2 text-sm"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={address.city}
                                        onChange={(e) =>
                                            setAddress({
                                                ...address,
                                                city: e.target.value,
                                            })
                                        }
                                        className="border px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={address.state}
                                        onChange={(e) =>
                                            setAddress({
                                                ...address,
                                                state: e.target.value,
                                            })
                                        }
                                        className="border px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={address.country}
                                        onChange={(e) =>
                                            setAddress({
                                                ...address,
                                                country: e.target.value,
                                            })
                                        }
                                        className="border px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        value={address.pincode}
                                        onChange={(e) =>
                                            setAddress({
                                                ...address,
                                                pincode: e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                ),
                                            })
                                        }
                                        maxLength={6}
                                        className="border px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="border border-neutral-200 p-4 rounded-lg grid gap-4">
                            <h2 className="font-semibold text-lg">
                                Payment Method
                            </h2>
                            <div className="grid gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="CASH_ON_DELIVERY"
                                        checked={
                                            paymentMethod === "CASH_ON_DELIVERY"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value as
                                                    | "CASH_ON_DELIVERY"
                                                    | "ONLINE_PAYMENT"
                                            )
                                        }
                                        className="w-fit!"
                                    />
                                    <span className="w-full">
                                        Cash on Delivery
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="ONLINE_PAYMENT"
                                        checked={
                                            paymentMethod === "ONLINE_PAYMENT"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value as
                                                    | "CASH_ON_DELIVERY"
                                                    | "ONLINE_PAYMENT"
                                            )
                                        }
                                        className="w-fit!"
                                    />
                                    <span className="w-full">
                                        Online Payment
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Coupons */}
                        <div className="border border-neutral-200 p-4 rounded-lg grid gap-4">
                            <h2 className="font-semibold text-lg">Coupons</h2>
                            {appliedCoupon ? (
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                                        <span className="text-sm font-semibold">
                                            {appliedCoupon.code} -{" "}
                                            {appliedCoupon.discount}% off
                                        </span>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-red-600 text-sm border-0! w-fit!"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            ref={coupenRef}
                                            className="border px-3 py-2 text-sm flex-1"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="bg-black text-white px-4 py-2 text-sm w-fit!"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        Try: SAVE10 or SAVE20
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="border border-neutral-200 p-4 rounded-lg grid gap-4">
                            <h2 className="font-semibold text-lg">
                                Order Summary
                            </h2>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>
                                        ${calculateSubtotal().toFixed(2)}
                                    </span>
                                </div>
                                {(appliedCoupon?.discount ?? 0) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>
                                            Discount ({appliedCoupon?.discount}
                                            %)
                                        </span>
                                        <span>
                                            -$
                                            {calculateDiscount().toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t pt-2 flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={placeOrder}
                                className="bg-black text-white px-4 py-3 font-semibold w-full"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
