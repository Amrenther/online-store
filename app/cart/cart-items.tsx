"use client";

import Image from "next/image";
import { updateCartItem, removeFromCart } from "../actions/cart-actions";
import { formatInrPaise } from "@/lib/format-inr";
import { useTransition } from "react";

function CartItemRow({ item }: { item: any }) {
    const [ isPending, startTransition ] = useTransition();

    function handleQuantityChange(quantity: number) {
        try {
            startTransition(async () => {
                await updateCartItem(item.id, quantity);
            });
        } catch (error) {
            console.error(error);
        }
    }
    
    function handleRemove() {
        try {
            startTransition(async () => {
                await removeFromCart(item.id);
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={`card bg-base-100 p-3 sm:p-4 border border-base-200 shadow-sm ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Item Details Row */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-base-200 border border-base-200">
                        <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base line-clamp-1" title={item.product.name}>
                                    {item.product.name}
                                </h3>
                                <p className="text-xs text-base-content/60">
                                    {item.product.category.name}
                                </p>
                            </div>
                            <div className="sm:text-right">
                                <p className="font-bold text-sm sm:text-base text-base-content">
                                    {formatInrPaise(item.product.price * item.quantity)}
                                </p>
                                {item.quantity > 1 && (
                                    <p className="text-xs text-base-content/50">
                                        {formatInrPaise(item.product.price)} each
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions: Quantity Stepper & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-base-200 sm:border-t-0">
                    <div className="flex items-center border border-base-300 rounded-lg overflow-hidden bg-base-100">
                        <button 
                            className="btn btn-xs sm:btn-sm btn-ghost rounded-none px-3 text-base font-bold min-h-[36px]"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={isPending}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="px-3 text-sm font-semibold min-w-[28px] text-center">
                            {item.quantity}
                        </span>
                        <button 
                            className="btn btn-xs sm:btn-sm btn-ghost rounded-none px-3 text-base font-bold min-h-[36px]"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={isPending}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <button 
                        className="btn btn-ghost btn-sm text-error px-2.5 flex items-center gap-1 hover:bg-error/10" 
                        onClick={handleRemove}
                        disabled={isPending}
                        aria-label={`Remove ${item.product.name} from cart`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        <span className="text-xs sm:text-sm">Remove</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CartItems( { items }: { items: any[] } ) {
    return (
        <div className="space-y-3">
            {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
            ))}
        </div>
    )
}