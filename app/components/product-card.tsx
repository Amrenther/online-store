"use client";

import Image from "next/image";
import { addToCart } from "@/app/actions/cart-actions";
import { formatInrPaise } from "@/lib/format-inr";
import { useTransition } from "react";

type ProductCardProduct = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: {
        name: string;
    };
};

export default function ProductCard({ product }: { product: ProductCardProduct }) {

    const [ isPending, startTransition ] = useTransition();

    function handleAddToCart() {
        startTransition(async () => {
            await addToCart(product.id);
        });
    }


    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow flex flex-col h-full">
            <figure className="relative h-36 xs:h-40 sm:h-48 w-full bg-base-200">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                />
            </figure>
            <div className="card-body p-3 sm:p-5 flex flex-col flex-1 justify-between gap-1 sm:gap-2">
                <div>
                    <div className="badge badge-outline badge-xs sm:badge-sm mb-1 sm:mb-1.5 text-base-content/70">
                        {product.category.name}
                    </div>
                    <h2 className="card-title text-sm sm:text-base font-semibold line-clamp-1" title={product.name}>
                        {product.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-0.5">
                        {product.description}
                    </p>
                </div>

                <div className="card-actions flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-base-200">
                    <span className="font-bold text-sm sm:text-base text-base-content">
                        {formatInrPaise(product.price)}
                    </span>
                    <button 
                        className="btn btn-primary btn-xs sm:btn-sm w-full sm:w-auto min-h-\[32px\]"
                        disabled={isPending}
                        onClick={handleAddToCart}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        {isPending ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                <span className="text-[11px] sm:text-xs">Adding...</span>
                            </>
                        ): (
                            <span className="text-xs sm:text-sm">Add to Cart</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}