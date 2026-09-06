"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { placeOrder, createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/order-actions";
import { formatInrPaise } from "@/lib/format-inr";

type CartLine = {
    id: number;
    quantity: number;
    product: {
        name: string;
        price: number;
        image: string;
        category: { name: string };
    };
};

function OrderSummaryContent({
    items,
    subtotal,
    deliveryCharge,
    total,
}: {
    items: CartLine[];
    subtotal: number;
    deliveryCharge: number;
    total: number;
}) {
    return (
        <div>
            <div className="divide-y divide-base-200">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 sm:gap-4 py-3 first:pt-0"
                    >
                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-base-200 border border-base-200">
                            <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm sm:text-base line-clamp-1">
                                {item.product.name}
                            </p>
                            <p className="text-xs sm:text-sm text-base-content/60">
                                {item.product.category.name} × {item.quantity}
                            </p>
                        </div>
                        <p className="font-bold text-sm sm:text-base">
                            {formatInrPaise(
                                item.product.price * item.quantity
                            )}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-base-200 pt-4 text-sm">
                <div className="flex justify-between text-base-content/70">
                    <span>Subtotal</span>
                    <span>{formatInrPaise(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base-content/70">
                    <span>Delivery</span>
                    <span>{formatInrPaise(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-base-content pt-1 border-t border-base-200">
                    <span>Total</span>
                    <span>{formatInrPaise(total)}</span>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutForm({
    items,
    subtotal,
    deliveryCharge,
    total,
}: {
    items: CartLine[];
    /** Paise */
    subtotal: number;
    deliveryCharge: number;
    total: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<string, string[] | undefined>>
    >({});
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">("Razorpay");

    function handleCodSubmit(formData: FormData) {
        setFormError(null);
        setFieldErrors({});
        
        startTransition(async () => {
            const result = await placeOrder(formData);
            if (result.success) {
                router.push(`/orders/${result.orderId}`);
                router.refresh();
                return;
            }
            if (result.fieldErrors) {
                setFieldErrors(result.fieldErrors);
            }
            if (result.error) {
                setFormError(result.error);
            }
        });
    }

    async function handleRazorpaySubmit(formData: FormData) {
        setFormError(null);
        setFieldErrors({});

        const shipping = {
            shippingFullName: formData.get("shippingFullName") as string,
            shippingPhone: formData.get("shippingPhone") as string,
            shippingStreet: formData.get("shippingStreet") as string,
            shippingCity: formData.get("shippingCity") as string,
            shippingState: formData.get("shippingState") as string,
            shippingPincode: formData.get("shippingPincode") as string,
        };

        try {
            if (typeof window.Razorpay !== "function") {
                setFormError(
                    "Payment widget is still loading. Wait a moment and try again."
                );
                return;
            }

            const result = await createRazorpayOrder(shipping);

            // Handle errors
            if (!result.success) {
                if (result.fieldErrors) {
                    setFieldErrors(result.fieldErrors);
                }
                if (result.error) {
                    setFormError(result.error);
                }
                return;
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: result.amountInSubunits,
                currency: result.currency,
                name: "Online Store",
                description: "Payment for your order",
                order_id: result.razorpayOrderId,
                handler: (response: RazorpayResponse) => {
                    void (async () => {
                    try {
                        const verifyResult = await verifyRazorpayPayment({
                            razorpay_order_id: result.razorpayOrderId,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: result.orderId,
                        });

                       if (verifyResult.success) {
                            router.push(`/orders/${result.orderId}`);
                            router.refresh();
                       } else {
                            setFormError(verifyResult.error || "Payment verification failed");
                       }
                    } catch {
                        setFormError("Payment failed. Please try again.");
                    }
                    })();
                },
                prefill: {
                    name: shipping.shippingFullName,
                    phone: shipping.shippingPhone,
                },
                theme: {
                    color: "#570df8"
                },
                modal: {
                    ondismiss: () => {
                        setFormError("Payment cancelled. Please try again.");
                    }
                }
            }

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch {
            setFormError("Something went wrong. Please try again.");
        }

    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);
        setFieldErrors({});

        const form = e.currentTarget;
        const formData = new FormData(form);

        if (paymentMethod === "COD") {
            handleCodSubmit(formData);
        } else {
            handleRazorpaySubmit(formData);
        }
    }

    return (
        <div>
            {/* Mobile Collapsible Order Summary Banner */}
            <div className="card bg-base-100 shadow-sm border border-base-200 lg:hidden mb-6 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setIsSummaryOpen((prev) => !prev)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-base-200/50 transition-colors"
                    aria-expanded={isSummaryOpen}
                >
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <span className="text-sm font-semibold text-primary">
                            {isSummaryOpen ? "Hide order summary ▲" : "Show order summary ▼"}
                        </span>
                    </div>
                    <span className="font-bold text-base text-base-content">
                        {formatInrPaise(total)}
                    </span>
                </button>
                {isSummaryOpen && (
                    <div className="px-4 pb-4 border-t border-base-200 pt-3 bg-base-50/50">
                        <OrderSummaryContent
                            items={items}
                            subtotal={subtotal}
                            deliveryCharge={deliveryCharge}
                            total={total}
                        />
                    </div>
                )}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Desktop Sticky Order Summary Card */}
                <div className="card bg-base-100 shadow-sm border border-base-200 hidden lg:block h-fit sticky top-20">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-2">Order summary</h2>
                        <OrderSummaryContent
                            items={items}
                            subtotal={subtotal}
                            deliveryCharge={deliveryCharge}
                            total={total}
                        />
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                    <h2 className="card-title text-lg">Shipping address</h2>
                    {formError ? (
                        <div role="alert" className="alert alert-error text-sm">
                            {formError}
                        </div>
                    ) : null}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <label className="form-control w-full">
                            <span className="label-text">Full name</span>
                            <input
                                name="shippingFullName"
                                type="text"
                                required
                                className="input input-bordered w-full"
                                disabled={isPending}
                            />
                            {fieldErrors.shippingFullName?.[0] ? (
                                <span className="label-text-alt text-error">
                                    {fieldErrors.shippingFullName[0]}
                                </span>
                            ) : null}
                        </label>
                        <label className="form-control w-full">
                            <span className="label-text">Phone</span>
                            <input
                                name="shippingPhone"
                                type="tel"
                                required
                                className="input input-bordered w-full"
                                disabled={isPending}
                            />
                            {fieldErrors.shippingPhone?.[0] ? (
                                <span className="label-text-alt text-error">
                                    {fieldErrors.shippingPhone[0]}
                                </span>
                            ) : null}
                        </label>
                        <label className="form-control w-full">
                            <span className="label-text">Street address</span>
                            <input
                                name="shippingStreet"
                                type="text"
                                required
                                className="input input-bordered w-full"
                                disabled={isPending}
                            />
                            {fieldErrors.shippingStreet?.[0] ? (
                                <span className="label-text-alt text-error">
                                    {fieldErrors.shippingStreet[0]}
                                </span>
                            ) : null}
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="form-control w-full">
                                <span className="label-text">City</span>
                                <input
                                    name="shippingCity"
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    disabled={isPending}
                                />
                                {fieldErrors.shippingCity?.[0] ? (
                                    <span className="label-text-alt text-error">
                                        {fieldErrors.shippingCity[0]}
                                    </span>
                                ) : null}
                            </label>
                            <label className="form-control w-full">
                                <span className="label-text">State</span>
                                <input
                                    name="shippingState"
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    disabled={isPending}
                                />
                                {fieldErrors.shippingState?.[0] ? (
                                    <span className="label-text-alt text-error">
                                        {fieldErrors.shippingState[0]}
                                    </span>
                                ) : null}
                            </label>
                        </div>
                        <label className="form-control w-full">
                            <span className="label-text">Pincode</span>
                            <input
                                name="shippingPincode"
                                type="text"
                                required
                                className="input input-bordered w-full"
                                disabled={isPending}
                            />
                            {fieldErrors.shippingPincode?.[0] ? (
                                <span className="label-text-alt text-error">
                                    {fieldErrors.shippingPincode[0]}
                                </span>
                            ) : null}
                        </label>

                        {/* Payment Method Selector */}
                        <div className="form-control">
                            <span className="label-text mb-2 font-medium">
                                Payment Method
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === "Razorpay" ? "border-primary bg-primary/5 font-semibold text-primary" : "border-base-300 hover:bg-base-200/50"}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethodChoice"
                                        value="Razorpay"
                                        checked={paymentMethod === "Razorpay"}
                                        onChange={() => setPaymentMethod("Razorpay")}
                                        className="radio radio-primary radio-sm"
                                        disabled={isPending}
                                    />
                                    <span className="text-sm">Pay Online (Razorpay)</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === "COD" ? "border-primary bg-primary/5 font-semibold text-primary" : "border-base-300 hover:bg-base-200/50"}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethodChoice"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")}
                                        className="radio radio-primary radio-sm"
                                        disabled={isPending}
                                    />
                                    <span className="text-sm">Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full min-h-11.5 text-base mt-2"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Placing order…
                                </>
                            ) : paymentMethod === "Razorpay" ? (
                                "Pay Now"
                            ) : (
                                "Place order (COD)"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}
