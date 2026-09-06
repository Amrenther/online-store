import Link from "next/link";
import { auth, signOut } from "@/auth";
import { getCartCount } from "@/app/actions/cart-actions";


export default async function TopMenu() {
    const session = await auth();
    const isLoggedIn = !!session?.user;
    const cartCount = isLoggedIn ? await getCartCount() : 0;

    return (
        <header className="navbar bg-base-100 shadow-sm sticky top-0 z-40 px-3 sm:px-6">  
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-lg sm:text-xl font-bold px-2">
                    Online Store
                </Link>
            </div>

            <div className="flex-none flex items-center gap-1 sm:gap-2">
                {/* Cart link - Always visible on both mobile and desktop */}
                <Link href="/cart" className="btn btn-ghost btn-sm px-2.5 sm:px-3 flex items-center gap-1.5" aria-label={`Shopping cart with ${cartCount} items`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span className="hidden xs:inline text-xs sm:text-sm">Cart</span>
                    <span className="badge badge-sm badge-primary">{cartCount}</span>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-2">
                    { isLoggedIn ? (
                        <>
                            <Link href="/orders" className="btn btn-ghost btn-sm">
                                Orders
                            </Link>
                            <span className="text-sm font-medium px-2 max-w-[120px] truncate" title={session?.user?.name || ""}>
                                {session?.user?.name}
                            </span>
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
                        <>
                            <Link href="/login" className="btn btn-ghost btn-sm">
                                Login
                            </Link>
                            <Link href="/register" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger dropdown */}
                <div className="dropdown dropdown-end md:hidden">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle btn-sm"
                        aria-label="Toggle navigation menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu menu-sm bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow-lg border border-base-200"
                    >
                        {isLoggedIn ? (
                            <>
                                <li className="menu-title px-4 py-2 border-b border-base-200">
                                    <span className="text-xs text-base-content/60">Signed in as</span>
                                    <span className="font-semibold text-base-content text-sm truncate block">{session?.user?.name || "User"}</span>
                                    {session?.user?.email && (
                                        <span className="text-xs text-base-content/60 truncate block">{session.user.email}</span>
                                    )}
                                </li>
                                <li className="mt-1">
                                    <Link href="/" className="py-2.5">
                                        Home / Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/orders" className="py-2.5">
                                        Your Orders
                                    </Link>
                                </li>
                                <li className="border-t border-base-200 mt-1 pt-1">
                                    <form action={
                                        async () => {
                                            "use server";
                                            await signOut({ redirectTo: "/login" });
                                        }}>
                                        <button
                                            type="submit"
                                            className="text-error w-full text-left py-2.5"
                                        >
                                            Logout
                                        </button>
                                    </form>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/" className="py-2.5">
                                        Home / Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="py-2.5">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="py-2.5 text-primary font-medium">
                                        Create Account
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    )


}