"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { requireUserId } from "@/lib/require-user";
import { revalidatePath } from "next/cache";

async function getOrCreateCart(userId: number) {
    return prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
    });
}

/**
 * Get the cart for the current user
 * @returns {Promise<{items: any[], total: number}>} The cart items and total
 */
export async function getCart() {
    const userId = await requireUserId();

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        include: {category: { select: {name: true}} }
                    },
                },
                orderBy: { id: "asc" }
            },
        },
    });

    if (!cart)  return { items: [], total: 0 };

    const total = cart.items.reduce(
        (sum: number, item: { product: { price: number }; quantity: number }) =>
            sum + item.product.price * item.quantity,
        0
    );

    return { items: cart.items, total };
}


/**
 * Get the cart count for the current user
 * @returns {Promise<number>} The cart count
 */
export async function getCartCount(): Promise<number> {
    const session = await auth();
    if (!session?.user?.id) return 0;
    
    const userId = parseInt(session.user.id);

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: true,
        },
    });

    if (!cart) return 0;
    return cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
}


/**
 * Add a product to the cart
 * @param {number} productId The product ID
 * @returns {Promise<void>} The cart items and total
 */
export async function addToCart(productId: number) {
    const userId = await requireUserId();
    const cart = await getOrCreateCart(userId);

    await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        create: { cartId: cart.id, productId, quantity: 1 },
        update: { quantity: { increment: 1 } },
    });

    revalidatePath("/");
    revalidatePath("/cart")
}


/**
 * Update a cart item quantity
 * @param {number} cartItemId The cart item ID
 * @param {number} quantity The new quantity
 * @returns {Promise<void>} The cart items and total
 */
export async function updateCartItem(cartItemId: number, quantity: number) {
    const userId = await requireUserId();

    const item = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
        throw new Error("Item not found");
    }

    if (quantity <= 0) {
        await prisma.cartItem.delete({
            where: { id: cartItemId },
        });
    } else {
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });
    }
    revalidatePath("/cart");
}


/**
 * Remove a cart item from the cart
 * @param {number} cartItemId The cart item ID
 * @returns {Promise<void>} The cart items and total
 */
export async function removeFromCart(cartItemId: number) {
    const userId = await requireUserId();

    const item = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
        throw new Error("Item not found");
    }

    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
    revalidatePath("/cart");
}