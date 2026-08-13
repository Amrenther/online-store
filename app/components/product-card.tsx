"use client";

import Image from "next/image";
import { addToCart } from "@/app/actions/cart-actions";
import { formatInrPaise } from "@/lib/format-inr";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: any) {

    const [ isPending, startTransition ] = useTransition();
    const router = useRouter();

    function handleAddToCart() {
        try {
            startTransition(async () => {
                await addToCart(product.id);
            });
        } catch (error) {
            router.push("/login");
            router.refresh();
        }
    }


    return (
        <div className="card bg-base-100 shadow-sm">
            <figure className="relative h-48">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
            </figure>
            <div className="card-body">
                <div className="badge badge-outline">
                    {product.category.name}
                </div>
                <h2 className="card-title">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.description}</p>

                <div className="card-actions justify-between">
                    <span className="font-bold">
                        {formatInrPaise(product.price)}
                    </span>
                    <button 
                        className="btn btn-primary btn-sm"
                        disabled={isPending}
                        onClick={handleAddToCart}
                    >
                        {isPending ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                adding...
                            </>
                        ): "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    )
}