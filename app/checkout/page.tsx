import Link from "next/link";
import { getCart } from "@/app/actions/cart-actions";
import { DELIVERY_CHARGE } from "@/lib/order-constants";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage() {
    const { items, total } = await getCart();

    if (items.length === 0) {
        return (
            <div className="mx-auto mt-10 max-w-md">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">
                            Nothing to checkout
                        </h2>
                        <p className="text-sm text-gray-500">
                            Add items to your cart before checking out.
                        </p>
                        <div className="card-actions mt-4">
                            <Link href="/cart" className="btn btn-primary">
                                Go to cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = total;
    const deliveryCharge = DELIVERY_CHARGE;
    const orderTotal = subtotal + deliveryCharge;

    return (
        <div className="mx-auto mt-10 max-w-6xl px-4">
            <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
            <CheckoutForm
                items={items}
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                total={orderTotal}
            />
        </div>
    );
}
