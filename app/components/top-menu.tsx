import Link from "next/link";
import { auth, signOut } from "@/auth";
import { getCartCount } from "@/app/actions/cart-actions";


export default async function TopMenu() {
    const session = await auth();
    const isLoggedIn = !!session?.user;
    const cartCount = isLoggedIn ? await getCartCount() : 0;

    return (
        <header className="navbar bg-base-100 shadow-sm">  
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                    Online Store
                </Link>
            </div>

            <div className="flex-none flex items-center gap-2">
                <Link href="/cart" className="btn btn-ghost btn-sm">
                    <span>Cart</span>
                    <span className="badge badge-sm badge-primary">{cartCount}</span>
                </Link>
                { isLoggedIn ? (
                    <>
                        <Link href="/orders" className="btn btn-ghost btn-sm">
                            Orders
                        </Link>
                        <span className="text-sm">{session?.user?.name}!</span>
                        <form action={
                            async () => {
                                "use server";
                                await signOut({ redirectTo: "/login" });
                            }}>
                            <button 
                                type="submit"
                                className="btn btn-ghost btn-sm text-error"
                            >
                                Logout
                            </button>
                        </form>
                    </>
                ): (
                    <Link href="/login" className="btn btn-ghost btn-sm">
                        Login
                    </Link>
                )}
            </div>
        </header>
    )

}