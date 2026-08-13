import Link from "next/link";
import { getMyOrders } from "@/app/actions/order-actions";
import { formatInrPaise } from "@/lib/format-inr";

export default async function OrdersPage() {
    const orders = await getMyOrders();

    if (orders.length === 0) {
        return (
            <div className="mx-auto mt-10 max-w-md">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">
                            No orders yet
                        </h2>
                        <p className="text-sm text-gray-500">
                            When you place an order, it will show up here.
                        </p>
                        <div className="card-actions mt-4">
                            <Link href="/" className="btn btn-primary">
                                Browse products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-10 max-w-4xl px-4">
            <h1 className="mb-6 text-2xl font-bold">Your orders</h1>
            <div className="space-y-3">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="card bg-base-100 shadow transition-shadow hover:shadow-md"
                    >
                        <div className="card-body flex-row flex-wrap items-center justify-between gap-4 py-4">
                            <div>
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">
                                    {formatInrPaise(order.total)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {order._count.items} item
                                    {order._count.items === 1 ? "" : "s"} ·{" "}
                                    {order.paymentMethod}
                                </p>
                            </div>
                            <div className="w-full sm:w-auto">
                                <span className="badge badge-outline">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
