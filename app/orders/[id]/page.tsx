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
        <div className="mx-auto mt-4 sm:mt-8 max-w-3xl">
            <div className="mb-4 sm:mb-6">
                <Link href="/orders" className="btn btn-ghost btn-sm -ml-2 gap-1 text-base-content/70">
                    ← Back to orders
                </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Order #{order.id}</h1>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-base-content/60">
                    <span>Placed {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="badge badge-outline badge-sm">
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="card bg-base-100 mb-4 sm:mb-6 shadow-sm border border-base-200">
                <div className="card-body p-4 sm:p-6">
                    <h2 className="card-title text-base sm:text-lg">Delivery Details</h2>
                    <address className="not-italic text-xs sm:text-sm text-base-content/80 leading-relaxed mt-1">
                        <span className="font-semibold text-base-content block">{order.shippingFullName}</span>
                        {order.shippingStreet}<br />
                        {order.shippingCity}, {order.shippingState} {order.shippingPincode}<br />
                        Phone: {order.shippingPhone}
                    </address>
                    <div className="mt-3 pt-3 border-t border-base-200 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-base-content/60">Payment Method:</span>
                        <span className="font-medium text-base-content">{order.paymentMethod}</span>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-4 sm:p-6">
                    <h2 className="card-title mb-2 text-base sm:text-lg">Ordered Items</h2>
                    <div className="divide-y divide-base-200">
                        {order.items.map((line) => (
                            <div
                                key={line.id}
                                className="flex items-center gap-3 sm:gap-4 py-3.5 first:pt-0"
                            >
                                <div className="relative h-14 w-14 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden bg-base-200 border border-base-200">
                                    <Image
                                        src={line.image}
                                        alt={line.productName}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm sm:text-base line-clamp-1">
                                        {line.productName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        {formatInrPaise(line.unitPrice)} × {line.quantity}
                                    </p>
                                </div>
                                <p className="font-bold text-sm sm:text-base text-base-content">
                                    {formatInrPaise(
                                        line.unitPrice * line.quantity
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-1.5 border-t border-base-200 pt-4 text-xs sm:text-sm">
                        <div className="flex justify-between text-base-content/70">
                            <span>Subtotal</span>
                            <span>{formatInrPaise(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-base-content/70">
                            <span>Delivery</span>
                            <span>{formatInrPaise(order.deliveryCharge)}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base font-bold text-base-content pt-1 border-t border-base-200">
                            <span>Total Paid</span>
                            <span>{formatInrPaise(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
