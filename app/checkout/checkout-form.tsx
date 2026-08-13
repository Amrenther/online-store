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
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title text-lg">Order summary</h2>
                    <div className="divide-y">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 py-3 first:pt-0"
                            >
                                <div className="relative h-16 w-16 flex-shrink-0">
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="rounded object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">
                                        {item.product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.product.category.name} ×{" "}
                                        {item.quantity}
                                    </p>
                                </div>
                                <p className="font-bold">
                                    {formatInrPaise(
                                        item.product.price * item.quantity
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-1 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatInrPaise(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>{formatInrPaise(deliveryCharge)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>{formatInrPaise(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow">
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
                            <div className="flex gap-4">
                                <label className="flex gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethodChoice"
                                        value="Razorpay"
                                        checked={paymentMethod === "Razorpay"}
                                        onChange={() => setPaymentMethod("Razorpay")}
                                        className="radio radio-primary"
                                        disabled={isPending}
                                    />
                                    Pay Online (Razorpay)
                                </label>
                                <label className="flex gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethodChoice"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")}
                                        className="radio radio-primary"
                                        disabled={isPending}
                                    />
                                    Cash on Delivery (COD)
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
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
    );
}
