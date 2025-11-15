import { Order } from "@/models/Order";
import { Seller } from "@/models/Seller";
import { User } from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { dbConn } from "@/utils/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Login first!", success: false },
                { status: 400 }
            );
        }

        if (session.user.role === "CUSTOMER") {
            return NextResponse.json(
                { message: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        await dbConn();

        const seller = await Seller.findOne({ user: session.user._id });
        if (!seller) {
            return NextResponse.json(
                {
                    message: "Not found",
                    success: false,
                },
                { status: 404 }
            );
        }

        const orders = await Order.aggregate([
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(session.user._id),
                },
            },
            {
                $addFields: {
                    productId: "$product",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product",
                    pipeline: [
                        {
                            $addFields: {
                                image: {
                                    $first: "$images",
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                price: 1,
                                name: 1,
                                rating: 1,
                                image: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$product",
                },
            },
        ]);

        const customersArr: { customerId: string; quantity: number }[] = [];
        orders.forEach((order) => {
            if (
                customersArr.findIndex(
                    (customer) => customer.customerId === order.user.toString()
                ) === -1
            ) {
                customersArr.push({
                    customerId: order.user.toString(),
                    quantity: order.quantity,
                });
            } else {
                customersArr[
                    customersArr.findIndex(
                        (customer) =>
                            customer.customerId === order.user.toString()
                    )
                ].quantity += order.quantity;
            }
        });

        const topCustomers: {
            name: string;
            quantity: number;
            _id: string;
            email: string;
            image: string;
        }[] = [];
        customersArr
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
            .forEach(async (customer) => {
                const cst = await User.findById(customer.customerId);
                if (cst) {
                    topCustomers.push({
                        _id: cst._id.toString(),
                        name: cst.name,
                        email: cst.email,
                        image: cst.image,
                        quantity: customer.quantity,
                    });
                }
            });

        const productsArr: {
            productId: string;
            quantity: number;
            name: string;
            image: string;
            rating: number;
            price: string;
        }[] = [];
        orders.forEach((order) => {
            if (
                productsArr.findIndex(
                    (product) =>
                        product.productId === order.product._id.toString()
                ) === -1
            ) {
                productsArr.push({
                    productId: order.product._id.toString(),
                    quantity: order.quantity,
                    name: order.product.name,
                    image: order.product.image,
                    rating: order.product.rating,
                    price: order.product.price,
                });
            } else {
                productsArr[
                    productsArr.findIndex(
                        (product) =>
                            product.productId === order.product._id.toString()
                    )
                ].quantity += order.quantity;
            }
        });

        let totalPrice = 0;
        orders.forEach((order) => {
            totalPrice +=
                order.product.price.toString().split("$")[1] * order.quantity;
        });

        const customersId: string[] = [];
        orders.forEach((order) => {
            if (customersId.indexOf(order.user.toString()) === -1) {
                customersId.push(order.user.toString());
            }
        });

        const customers: any[] = [];
        for (let i = 0; i < customersId.length; i++) {
            const customer = await User.findById(customersId[i]);
            if (customer) {
                customers.push({
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    image: customer.image,
                });
            }
        }

        const customersN = customersId.length;
        const productsN = seller.products.length;
        const ordersN = orders.length;

        return NextResponse.json(
            {
                message: "Data fetched.",
                data: {
                    productsN,
                    ordersN,
                    customersN,
                    customers,
                    totalPrice,
                    topSelling: productsArr
                        .sort((a, b) => b.quantity - a.quantity)
                        .slice(0, 5),
                    topCustomers,
                },
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}
