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
        <div className="mx-auto mt-4 sm:mt-10 max-w-4xl">
            <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold">Your Orders</h1>
            <div className="space-y-3">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="card bg-base-100 border border-base-200 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                    >
                        <div className="card-body p-4 sm:p-5">
                            {/* Mobile Layout */}
                            <div className="flex sm:hidden flex-col gap-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-base">Order #{order.id}</span>
                                    <span className="badge badge-outline badge-sm">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-xs text-base-content/60">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-base-200">
                                    <span className="text-xs text-base-content/70">
                                        {order._count.items} {order._count.items === 1 ? "item" : "items"} · {order.paymentMethod}
                                    </span>
                                    <span className="font-bold text-base text-base-content">
                                        {formatInrPaise(order.total)}
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden sm:flex items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <p className="font-semibold text-base">Order #{order.id}</p>
                                        <span className="badge badge-outline badge-sm">
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-base-content/60 mt-0.5">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-base text-base-content">
                                        {formatInrPaise(order.total)}
                                    </p>
                                    <p className="text-sm text-base-content/60">
                                        {order._count.items} item{order._count.items === 1 ? "" : "s"} · {order.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
