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
        <div className={`flex items-center gap-4 py-4 ${isPending ? "opacity-50" : ""}`}>

            <div className="relative w-20 h-20 flex-shrink-0">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover rounded" />
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.category.name}</p>
                    <p className="font-bold">
                        {formatInrPaise(item.product.price)}
                    </p>
                </div>

            </div>

            <div className="flex items-center gap-2">
                <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isPending}
                >
                    -
                </button>

                <span className="text-sm">{item.quantity}</span>
                <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isPending}
                >
                    +
                </button>
            </div>

            <button 
                className="btn btn-ghost btn-sm text-error" 
                onClick={handleRemove}
                disabled={isPending}
            >
                <span>Remove</span>
            </button>

        </div>
    )
}

export default function CartItems( { items }: { items: any[] } ) {
    return (
        <div className="space-y">
            {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
            ))}
        </div>
    )
}