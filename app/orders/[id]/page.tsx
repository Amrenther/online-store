import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById } from "@/app/actions/order-actions";
import { formatInrPaise } from "@/lib/format-inr";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params;
    const orderId = parseInt(id, 10);
    if (Number.isNaN(orderId)) {
        notFound();
    }

    const order = await getOrderById(orderId);
    if (!order) {
        notFound();
    }

    return (
        <div className="mx-auto mt-10 max-w-3xl px-4">
            <div className="mb-6">
                <Link href="/orders" className="btn btn-ghost btn-sm">
                    ← All orders
                </Link>
            </div>
            <h1 className="mb-2 text-2xl font-bold">Order #{order.id}</h1>
            <p className="mb-6 text-sm text-gray-500">
                Placed {new Date(order.createdAt).toLocaleString()} ·{" "}
                <span className="badge badge-outline badge-sm">
                    {order.status}
                </span>
            </p>

            <div className="card bg-base-100 mb-6 shadow">
                <div className="card-body">
                    <h2 className="card-title text-lg">Ship to</h2>
                    <address className="not-italic text-sm leading-relaxed">
                        {order.shippingFullName}
                        <br />
                        {order.shippingStreet}
                        <br />
                        {order.shippingCity}, {order.shippingState}{" "}
                        {order.shippingPincode}
                        <br />
                        {order.shippingPhone}
                    </address>
                    <p className="mt-2 text-sm text-gray-500">
                        Payment: {order.paymentMethod}
                    </p>
                </div>
            </div>

            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title mb-4 text-lg">Items</h2>
                    <div className="divide-y">
                        {order.items.map((line) => (
                            <div
                                key={line.id}
                                className="flex items-center gap-4 py-4 first:pt-0"
                            >
                                <div className="relative h-20 w-20 flex-shrink-0">
                                    <Image
                                        src={line.image}
                                        alt={line.productName}
                                        fill
                                        className="rounded object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">
                                        {line.productName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatInrPaise(line.unitPrice)} ×{" "}
                                        {line.quantity}
                                    </p>
                                </div>
                                <p className="font-bold">
                                    {formatInrPaise(
                                        line.unitPrice * line.quantity
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-1 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatInrPaise(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>{formatInrPaise(order.deliveryCharge)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>{formatInrPaise(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
