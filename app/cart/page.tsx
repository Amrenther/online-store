import { getCart } from "@/app/actions/cart-actions";
import { formatInrPaise } from "@/lib/format-inr";
import CartItems from "./cart-items";
import Link from "next/link";

export default async function CartPage() {
    const { items, total } = await getCart();

    if (items.length === 0) {
        return (
            <div className="max-w-md mx-auto mt-6 sm:mt-12 px-2">
                <div className="card bg-base-100 shadow-sm border border-base-200 text-center">
                    <div className="card-body items-center py-10 sm:py-14">
                        <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-2 text-base-content/40">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="card-title text-xl sm:text-2xl font-bold">Your cart is empty</h2>
                        <p className="text-sm text-base-content/60 max-w-xs mt-1">
                            Looks like you haven&apos;t added any items to your cart yet.
                        </p>
                        <div className="card-actions mt-6">
                            <Link href="/" className="btn btn-primary btn-sm sm:btn-md">
                                Explore Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto mt-4 sm:mt-8 pb-28 sm:pb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Shopping Cart</h1>
                <span className="text-xs sm:text-sm text-base-content/60">
                    {items.length} {items.length === 1 ? "item" : "items"}
                </span>
            </div>

            <CartItems items={items} />

            {/* Desktop / Tablet Checkout Summary Card */}
            <div className="mt-8 hidden sm:block">
                <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-base-content/60">Estimated Total</p>
                            <h2 className="text-2xl font-bold text-base-content">
                                {formatInrPaise(total)}
                            </h2>
                        </div>
                        <Link href="/checkout" className="btn btn-primary btn-md px-8">
                            Proceed to Checkout →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-base-100/95 backdrop-blur-md border-t border-base-200 shadow-2xl z-30 sm:hidden">
                <div className="container mx-auto flex items-center justify-between gap-3 px-1">
                    <div>
                        <span className="text-[11px] text-base-content/60 uppercase tracking-wider block font-medium">
                            Total
                        </span>
                        <span className="text-lg font-bold text-base-content leading-tight block">
                            {formatInrPaise(total)}
                        </span>
                    </div>
                    <Link href="/checkout" className="btn btn-primary btn-sm px-5 min-h-[42px]">
                        Checkout →
                    </Link>
                </div>
            </div>
        </div>
    )
}