"use client";

import Ratings from "@/components/Ratings";
import { fetchClient } from "@/utils/fetchClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Address = {
    landmark: string;
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
};

type Orders = {
    _id: string;
    status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    quantity: number;
    createdAt: string;
    paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
    coupen: {
        _id: string;
        code: string;
        discount: number;
        minPurchase: number;
        maxDiscount: number;
    };
    product: {
        _id: string;
        name: string;
        image: string;
        price: number;
    };
    seller: {
        _id: string;
        phone: string;
        rating: number;
        address: Address;
        user: {
            _id: string;
            name: string;
            email: string;
            image: string;
        };
    };
    shippingAddress: Address;
};

export default function Orders({ ordersProp }: { ordersProp: Orders[] }) {
    const [activeTab, setActiveTab] = useState<
        "ALL" | "PENDING" | "DELIVERED" | "CANCELLED" | "SHIPPED"
    >("ALL");
    const [activeProduct, setActiveProduct] = useState<string | null>(null);
    const [orders, setOrders] = useState(ordersProp);
    const router = useRouter();

    function calculateSubtotal(_id: string) {
        const order = orders.find((order) => order._id === _id)!;
        return (
            order.quantity *
            parseFloat(order.product.price.toString().split("$")[1].trim())
        );
    }

    function calculateTotal(_id: string) {
        const subtotal = calculateSubtotal(_id);
        const discountAmount = calculateDiscount(_id);
        return subtotal - discountAmount;
    }

    function calculateDiscount(_id: string) {
        const order = orders.find((order) => order._id === _id)!;
        const subtotal = calculateSubtotal(_id);

        let discountAmount = 0;
        if (order.coupen) {
            if (subtotal >= order.coupen.minPurchase) {
                discountAmount = Math.min(
                    (subtotal * order.coupen.discount) / 100,
                    order.coupen.maxDiscount
                );
            }
        }
        return discountAmount;
    }

    async function cancelOrder(_id: string) {
        const res = await fetchClient(`order/${_id}`, "DELETE");
        if (res.success) {
            setOrders((prev) => {
                return prev?.map((order) => {
                    if (order._id === _id) {
                        return {
                            ...order,
                            status: "CANCELLED",
                        };
                    }
                    return order;
                });
            });
        }
    }

    return (
        <div className="min-h-screen w-2/3 min-w-sm lg:min-w-lg mx-auto flex flex-col gap-8 pb-8">
            <div className="flex flex-wrap gap-2 md:gap-4">
                <button
                    className={
                        "px-6! w-fit! rounded-3xl! " +
                        (activeTab === "ALL"
                            ? "text-red-400 border-red-400/60!"
                            : "text-neutral-600 border-neutral-300!")
                    }
                    onClick={() => setActiveTab("ALL")}
                >
                    All
                </button>
                <button
                    className={
                        "px-6! w-fit! rounded-3xl! " +
                        (activeTab === "PENDING"
                            ? "text-red-400 border-red-400/60!"
                            : "text-neutral-600")
                    }
                    onClick={() => setActiveTab("PENDING")}
                >
                    Pending
                </button>
                <button
                    className={
                        "px-6! w-fit! rounded-3xl! " +
                        (activeTab === "SHIPPED"
                            ? "text-red-400 border-red-400/60!"
                            : "text-neutral-600")
                    }
                    onClick={() => setActiveTab("SHIPPED")}
                >
                    Shipped
                </button>
                <button
                    className={
                        "px-6! w-fit! rounded-3xl! " +
                        (activeTab === "DELIVERED"
                            ? "text-red-400 border-red-400/60!"
                            : "text-neutral-600")
                    }
                    onClick={() => setActiveTab("DELIVERED")}
                >
                    Delivered
                </button>
                <button
                    className={
                        "px-6! w-fit! rounded-3xl! " +
                        (activeTab === "CANCELLED"
                            ? "text-red-400 border-red-400/60!"
                            : "text-neutral-600")
                    }
                    onClick={() => setActiveTab("CANCELLED")}
                >
                    Cancelled
                </button>
            </div>

            <div className={"flex flex-col gap-12"}>
                <div className="flex flex-col gap-4">
                    {orders.filter(
                        (order) =>
                            order.status === activeTab || activeTab === "ALL"
                    ).length === 0 ? (
                        <div>
                            <p className="text-neutral-600 text-center text-sm!">
                                Nothing to show here.
                            </p>
                        </div>
                    ) : (
                        orders.map((order) => {
                            if (
                                activeTab === "ALL" ||
                                order.status === activeTab
                            )
                                return (
                                    <div
                                        onClick={() => {
                                            if (activeProduct === order._id) {
                                                setActiveProduct(null);
                                                return;
                                            }
                                            setActiveProduct(order._id);
                                        }}
                                        key={order._id}
                                        className={
                                            "border border-neutral-200/60 rounded-3xl p-4 flex flex-col gap-4 shadow cursor-pointer" +
                                            (activeProduct === order._id
                                                ? " bg-red-50/60 border-red-200/60!"
                                                : "")
                                        }
                                    >
                                        <div className="flex flex-row gap-4 items-center">
                                            <div
                                                className={
                                                    "flex flex-row gap-2 items-center justify-center px-2 py-0.5 rounded-3xl " +
                                                    (order.status === "PENDING"
                                                        ? "bg-blue-400"
                                                        : order.status ===
                                                          "SHIPPED"
                                                        ? "bg-amber-400"
                                                        : order.status ===
                                                          "DELIVERED"
                                                        ? "bg-emerald-400"
                                                        : "bg-red-400")
                                                }
                                            >
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                <p
                                                    className={
                                                        "w-fit! rounded-3xl! text-white"
                                                    }
                                                >
                                                    {order.status
                                                        .slice(0, 1)
                                                        .toUpperCase() +
                                                        order.status
                                                            .slice(1)
                                                            .toLowerCase()}
                                                </p>
                                            </div>
                                            <div className="h-full w-0.5 bg-neutral-200"></div>
                                            <p className="text-[0.7rem]! text-neutral-600">
                                                {order.createdAt}
                                            </p>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <div className="relative w-20 h-20 bg-neutral-200 grid place-items-center rounded-xl">
                                                <img
                                                    src={order.product.image}
                                                    alt={order.product.name}
                                                    className="w-16 h-16"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-neutral-600 font-semibold">
                                                    {order.product.name}
                                                </p>
                                                <p className="text-sm text-neutral-600">
                                                    Quantity: {order.quantity}
                                                </p>
                                                <p className="text-sm text-neutral-600">
                                                    {order.product.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                        })
                    )}
                </div>

                {activeProduct !== null
                    ? orders.map((order) => {
                          if (order._id === activeProduct) {
                              return (
                                  <div
                                      key={order._id}
                                      className="flex flex-col gap-8"
                                  >
                                      <div className="flex flex-col gap-2">
                                          <h2 className="font-semibold">
                                              Delivery Address
                                          </h2>
                                          <div className="border border-neutral-200/40 shadow bg-white rounded-2xl px-8 py-4">
                                              <p>{`${order.shippingAddress.landmark}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`}</p>
                                              <p>
                                                  {
                                                      order.shippingAddress
                                                          .pincode
                                                  }
                                              </p>
                                          </div>
                                      </div>

                                      <div className="flex flex-col gap-2">
                                          <h2 className="font-semibold">
                                              Payment Details
                                          </h2>
                                          <div className="border border-neutral-200/40 shadow bg-white rounded-2xl px-8 py-4 grid gap-2">
                                              <div className="grid grid-cols-2">
                                                  <h3>Payment Method</h3>
                                                  <p>
                                                      {order.paymentMethod
                                                          .slice(0, 1)
                                                          .toUpperCase() +
                                                          order.paymentMethod
                                                              .replaceAll(
                                                                  "_",
                                                                  " "
                                                              )
                                                              .slice(1)
                                                              .toLowerCase()}
                                                  </p>
                                              </div>
                                              <div className="grid grid-cols-2">
                                                  <h3>Price</h3>
                                                  <p>{order.product.price}</p>
                                              </div>
                                              <div className="grid grid-cols-2">
                                                  <h3>Quantity</h3>
                                                  <p>{order.quantity}</p>
                                              </div>
                                              <div className="grid grid-cols-2">
                                                  <h3>Sub-Total</h3>
                                                  <p>
                                                      {`$${calculateSubtotal(
                                                          order._id
                                                      )}`}
                                                  </p>
                                              </div>
                                              <div className="grid grid-cols-2">
                                                  <h3>Coupen</h3>
                                                  <p>{`-$${calculateDiscount(
                                                      order._id
                                                  )}`}</p>
                                              </div>

                                              <div className="h-0.5 w-full bg-neutral-200 my-2"></div>
                                              <div className="grid grid-cols-2">
                                                  <h3>Total</h3>
                                                  <p>
                                                      {`$${calculateTotal(
                                                          order._id
                                                      )}`}
                                                  </p>
                                              </div>
                                          </div>
                                      </div>

                                      <div className="flex flex-col gap-2">
                                          <h2 className="font-semibold">
                                              Seller Details
                                          </h2>
                                          <div className="border border-neutral-200/40 shadow bg-white rounded-2xl px-8 py-4 flex flex-col gap-4">
                                              <div className="flex flex-row gap-4 items-center">
                                                  <img
                                                      src={
                                                          order.seller.user
                                                              .image
                                                      }
                                                      alt="seller image"
                                                      className="w-12 h-12 rounded-full"
                                                  />
                                                  <div className="flex flex-col gap-2">
                                                      <h2>
                                                          {
                                                              order.seller.user
                                                                  .name
                                                          }
                                                      </h2>
                                                      <Ratings
                                                          rating={
                                                              order.seller
                                                                  .rating
                                                          }
                                                      />
                                                  </div>
                                              </div>
                                              <div className="flex flex-row items-center gap-4">
                                                  <p>
                                                      {order.seller.user.email}
                                                  </p>
                                                  <p>
                                                      +91-{order.seller.phone}
                                                  </p>
                                              </div>
                                              <p>{`${order.seller.address.landmark}, ${order.seller.address.street}, ${order.seller.address.city}, ${order.seller.address.state}, ${order.seller.address.country} - ${order.seller.address.pincode}`}</p>
                                          </div>
                                      </div>
                                      <div className="flex justify-end gap-4">
                                          <button
                                              className="w-fit! border-neutral-600 text-neutral-600"
                                              onClick={async () => {
                                                  const res = await fetchClient(
                                                      "cart",
                                                      "POST",
                                                      {
                                                          productId:
                                                              order.product._id,
                                                      }
                                                  );
                                                  if (res.success) {
                                                      router.push("/cart");
                                                  }
                                              }}
                                          >
                                              Buy Again
                                          </button>
                                          <button
                                              onClick={() =>
                                                  cancelOrder(order._id)
                                              }
                                              disabled={
                                                  order.status !== "PENDING"
                                              }
                                              className="border-0! w-fit! bg-red-400 text-white py-2! px-4! rounded-xl disabled:bg-red-300"
                                          >
                                              Cancel Order
                                          </button>
                                      </div>
                                  </div>
                              );
                          }
                      })
                    : null}
            </div>
        </div>
    );
}
