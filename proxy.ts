import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth( (req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    const isPublicRoute = 
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register");


    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    
    if (isLoggedIn && 
        (pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}