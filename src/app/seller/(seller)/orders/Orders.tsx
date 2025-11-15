"use client";

import { fetchClient } from "@/utils/fetchClient";
import { useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { TbTruckDelivery, TbUserCancel } from "react-icons/tb";

type Orders = {
    _id: string;
    quantity: number;
    product: {
        _id: string;
        name: string;
        price: number;
    };
    user: {
        _id: string;
        name: string;
        email: string;
    };
    coupen: string | null;
    status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    createdAt: Date;
    paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
};

export default function Orders({ ordersProp }: { ordersProp: Orders[] }) {
    const [orders, setOrders] = useState(ordersProp);

    async function changeStatus(_id: string, status: string) {
        if (
            status !== "PENDING" &&
            status !== "SHIPPED" &&
            status !== "DELIVERED" &&
            status !== "CANCELLED"
        ) {
            return;
        }
        const res = await fetchClient(`seller/orders/${_id}`, "PUT", {
            status,
        });

        if (res.success) {
            setOrders((prev) => {
                return prev?.map((order) => {
                    if (order._id === _id) {
                        return {
                            ...order,
                            status,
                        };
                    }
                    return order;
                });
            });
        }
    }

    return (
        <div>
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-4 p-8 rounded bg-amber-50 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                        <FaShippingFast className="text-4xl" />
                    </div>
                    <div>
                        <p className="text-neutral-400 text-sm!">
                            Shipped Orders
                        </p>
                        <p className="text-neutral-800 font-semibold text-xl!">
                            {
                                orders.filter((o) => o.status === "SHIPPED")
                                    .length
                            }
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-8 rounded bg-blue-50 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                        <MdPendingActions className="text-4xl" />
                    </div>
                    <div>
                        <p className="text-neutral-400 text-sm!">
                            Pending Orders
                        </p>
                        <p className="text-neutral-800 font-semibold text-xl!">
                            {
                                orders.filter((o) => o.status === "PENDING")
                                    .length
                            }
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-8 rounded bg-emerald-50 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                        <TbTruckDelivery className="text-4xl" />
                    </div>
                    <div>
                        <p className="text-neutral-400 text-sm!">
                            Delivered Orders
                        </p>
                        <p className="text-neutral-800 font-semibold text-xl!">
                            {
                                orders.filter((o) => o.status === "DELIVERED")
                                    .length
                            }
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-8 rounded bg-red-50 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow w-20 h-20 grid place-items-center">
                        <TbUserCancel className="text-4xl" />
                    </div>
                    <div>
                        <p className="text-neutral-400 text-sm!">
                            Cancelled Orders
                        </p>
                        <p className="text-neutral-800 font-semibold text-xl!">
                            {
                                orders.filter((o) => o.status === "CANCELLED")
                                    .length
                            }
                        </p>
                    </div>
                </div>
            </div>

            <table className="w-full table-auto mt-8">
                <thead className="text-sm text-neutral-600">
                    <tr className="text-left">
                        <th className="bg-neutral-100 px-4 py-2">Product</th>
                        <th className="bg-neutral-100 px-4 py-2">Price</th>
                        <th className="bg-neutral-100 px-4 py-2">
                            Customer Name
                        </th>
                        <th className="bg-neutral-100 px-4 py-2">Coupen</th>
                        <th className="bg-neutral-100 px-4 py-2">
                            Payment Method
                        </th>
                        <th className="bg-neutral-100 px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {orders.map((order) => (
                        <tr key={order._id} className="text-sm">
                            <td className="px-4 py-2 border-b border-neutral-200/60">
                                <p className="font-semibold">
                                    {order.product.name}
                                </p>
                                <p className="text-neutral-600">
                                    Qty: {order.quantity}
                                </p>
                            </td>
                            <td className="px-4 py-2 border-b border-neutral-200/60 text-neutral-600">
                                $
                                {parseFloat(
                                    order.product.price
                                        .toString()
                                        .split("$")[1]
                                        .trim()
                                ) * order.quantity}
                            </td>
                            <td className="px-4 py-2 border-b border-neutral-200/60 flex flex-col gap-1">
                                <p className="font-semibold">
                                    {order.user.name}
                                </p>
                                <p className="text-neutral-600">
                                    {order.user.email}
                                </p>
                            </td>
                            <td className="px-4 py-2 border-b border-neutral-200/60 text-neutral-600">
                                {order.coupen || "None"}
                            </td>
                            <td className="px-4 py-2 border-b border-neutral-200/60 text-neutral-600">
                                {order.paymentMethod
                                    .replaceAll("_", " ")
                                    .slice(0, 1)
                                    .toUpperCase() +
                                    order.paymentMethod
                                        .replaceAll("_", " ")
                                        .slice(1)
                                        .toLowerCase()}
                            </td>
                            <td className="px-4 py-2 border-b border-neutral-200/60">
                                <select
                                    onChange={(e) =>
                                        changeStatus(order._id, e.target.value)
                                    }
                                    value={order.status}
                                    className="appearance-none w-full h-10 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 outline-0"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
