import { getCart } from "@/app/actions/cart-actions";
import { formatInrPaise } from "@/lib/format-inr";
import CartItems from "./cart-items";
import Link from "next/link";

export default async function CartPage() {
    const { items, total } = await getCart();

    if (items.length === 0) {
        return (
            <div className="max-w-md mx-auto mt-10">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">Cart is empty</h2>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <h1 className="text-2xl font-bold">Cart</h1>
            <CartItems items={items} />
            <div className="mt-10">
                <h2 className="text-xl font-bold">
                    Total: {formatInrPaise(total)}
                </h2>
            </div>
            <div className="mt-10">
                <Link href="/checkout" className="btn btn-primary">Checkout</Link>
            </div>
        </div>
    )
}