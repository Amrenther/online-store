"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { DELIVERY_CHARGE } from "@/lib/order-constants";
import razorpay from "@/lib/razorpay";
import crypto from "crypto";

const checkoutSchema = z.object({
    shippingFullName: z.string().trim().min(1, "Required"),
    shippingPhone: z.string().trim().min(5, "Enter a valid phone number"),
    shippingStreet: z.string().trim().min(1, "Required"),
    shippingCity: z.string().trim().min(1, "Required"),
    shippingState: z.string().trim().min(1, "Required"),
    shippingPincode: z.string().trim().min(3, "Required"),
});

export type OrderListRow = Prisma.OrderGetPayload<{
    include: { _count: { select: { items: true } } };
}>;

export type OrderWithItems = Prisma.OrderGetPayload<{
    include: { items: true };
}>;

export type PlaceOrderResult =
    | { success: true; orderId: number }
    | {
          success: false;
          fieldErrors?: z.core.$ZodFlattenedError<z.output<typeof checkoutSchema>>["fieldErrors"];
          error?: string;
      };

export async function placeOrder(formData: FormData): Promise<PlaceOrderResult> {
    const userId = await requireUserId();

    const parsed = checkoutSchema.safeParse({
        shippingFullName: formData.get("shippingFullName"),
        shippingPhone: formData.get("shippingPhone"),
        shippingStreet: formData.get("shippingStreet"),
        shippingCity: formData.get("shippingCity"),
        shippingState: formData.get("shippingState"),
        shippingPincode: formData.get("shippingPincode"),
    });

    if (!parsed.success) {
        return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: { product: true },
            },
        },
    });

    if (!cart?.items.length) {
        return { success: false, error: "Your cart is empty" };
    }

    const subtotal = cart.items.reduce(
        (sum: number, item: (typeof cart.items)[number]) =>
            sum + item.product.price * item.quantity,
        0
    );
    const total = subtotal + DELIVERY_CHARGE;

    const shipping = parsed.data;

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const created = await tx.order.create({
            data: {
                userId,
                subtotal,
                deliveryCharge: DELIVERY_CHARGE,
                total,
                shippingFullName: shipping.shippingFullName,
                shippingPhone: shipping.shippingPhone,
                shippingStreet: shipping.shippingStreet,
                shippingCity: shipping.shippingCity,
                shippingState: shipping.shippingState,
                shippingPincode: shipping.shippingPincode,
                status: "Order Placed",
                paymentMethod: "COD",
                items: {
                    create: cart.items.map((item: (typeof cart.items)[number]) => ({
                        productId: item.productId,
                        productName: item.product.name,
                        unitPrice: item.product.price,
                        quantity: item.quantity,
                        image: item.product.image,
                    })),
                },
            },
        });

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return created;
    });

    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/orders");

    return { success: true, orderId: order.id };
}

export async function getMyOrders(): Promise<OrderListRow[]> {
    const userId = await requireUserId();

    return prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { items: true } },
        },
    });
}

export async function getOrderById(
    orderId: number
): Promise<OrderWithItems | null> {
    const userId = await requireUserId();

    return prisma.order.findFirst({
        where: { id: orderId, userId },
        include: {
            items: {
                orderBy: { id: "asc" },
            },
        },
    });
}


export type CreateRazorpayOrderResult =
    | {
        success: true;
        razorpayOrderId: string;
        /** Amount in paise (INR smallest unit) as sent to Razorpay. */
        amountInSubunits: number;
        currency: string;
        orderId: number;
    }
    | {
        success: false;
        error?: string;
        fieldErrors?: z.core.$ZodFlattenedError<z.output<typeof checkoutSchema>>["fieldErrors"];
    };


export async function createRazorpayOrder(
    shipping: z.infer<typeof checkoutSchema>
): Promise<CreateRazorpayOrderResult> {

    const userId = await requireUserId();

    const parsed = checkoutSchema.safeParse(shipping);

    if (!parsed.success) {
        return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: { product: true },
            },
        },
    });
    
    if (!cart?.items.length) {
        return { success: false, error: "Your cart is empty" };
    }

    const subtotal = cart.items.reduce(
        (sum: number, item: (typeof cart.items)[number]) =>
            sum + item.product.price * item.quantity,
        0
    );
    const total = subtotal + DELIVERY_CHARGE;

    const amountInSmallestUnit = total;
    const currency = "INR";

    const razorpayOrder = await razorpay.orders.create({
        amount: amountInSmallestUnit,
        currency,
        receipt: `order_rcpt_${Date.now()}`,
        notes: {
            userId: userId.toString(),
        }
    })

    const data = parsed.data;

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const created = await tx.order.create({
            data: {
                userId,
                subtotal,
                deliveryCharge: DELIVERY_CHARGE,
                total,
                shippingFullName: data.shippingFullName,
                shippingPhone: data.shippingPhone,
                shippingStreet: data.shippingStreet,
                shippingCity: data.shippingCity,
                shippingState: data.shippingState,
                shippingPincode: data.shippingPincode,
                paymentMethod: "Razorpay",
                paymentStatus: "Pending",
                razorpayOrderId: razorpayOrder.id,
                items: {
                    create: cart.items.map((item: (typeof cart.items)[number]) => ({
                        productId: item.productId,
                        productName: item.product.name,
                        unitPrice: item.product.price,
                        quantity: item.quantity,
                        image: item.product.image,
                    })),
                },
            }
        })

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return created;
    })

    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amountInSubunits: amountInSmallestUnit,
        currency,
        orderId: order.id,
    };
}


export type VerifyPaymentResult =
    | {
        success: true;
        orderId: number;
    }
    | {
        success: false;
        error?: string;
    };


export async function verifyRazorpayPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: number;
}): Promise<VerifyPaymentResult> {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
    } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
        return { success: false, error: "Missing required fields" };
    }

    const userId = await requireUserId();
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        return { success: false, error: "Payment verification is not configured" };
    }

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
            razorpayOrderId: razorpay_order_id,
        },
    });

    if (!order) {
        return { success: false, error: "Order not found or payment session mismatch" };
    }

    const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const a = Buffer.from(expectedSignature, "utf8");
    const b = Buffer.from(razorpay_signature, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        await prisma.order.update({
            where: { id: orderId, userId },
            data: {
                paymentStatus: "Failed",
            },
        });
        return { success: false, error: "Invalid signature" };
    }

    await prisma.order.update({
        where: { id: orderId, userId },
        data: {
            paymentStatus: "Paid",
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        },
    });

    revalidatePath("/");
    revalidatePath("/orders");

    return { success: true, orderId };
}