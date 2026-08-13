import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function json(body: Record<string, unknown>, status = 200) {
    return NextResponse.json(body, { status });
}

function verifySignature(rawBody: string, signature: string, secret: string) {
    const expected = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");

    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
    console.log("🔔 Razorpay webhook called at", new Date().toISOString());

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
        return json({ ok: false, error: "Webhook not configured" }, 500);
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    console.log("📩 Webhook raw body:", rawBody);
    console.log("🔑 Signature received:", signature);

    if (!verifySignature(rawBody, signature, webhookSecret)) {
        console.warn("❌ Invalid webhook signature");
        return json({ ok: false, error: "Invalid signature" }, 400);
    }

    console.log("✅ Signature verified successfully");

    const event = JSON.parse(rawBody) as {
        event: string;
        payload: {
            payment: {
                entity: {
                    id: string;
                    order_id: string;
                    status: string;
                };
            };
        };
    };

    const eventName = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    console.log("📋 Event:", eventName);
    console.log("💳 Payment entity:", JSON.stringify(paymentEntity, null, 2));

    if (!paymentEntity?.order_id) {
        console.warn("⚠️ No order_id in payment entity, skipping");
        return json({ ok: true });
    }

    const razorpayOrderId = paymentEntity.order_id;
    console.log("🔍 Looking up order with razorpayOrderId:", razorpayOrderId);

    const order = await prisma.order.findFirst({
        where: { razorpayOrderId },
    });

    if (!order) {
        console.warn("⚠️ No matching order found for razorpayOrderId:", razorpayOrderId);
        return json({ ok: true });
    }

    console.log("📦 Found order:", order.id);

    if (eventName === "payment.captured") {
        console.log("✅ Marking order as Paid");
        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: "Paid",
                razorpayPaymentId: paymentEntity.id,
            },
        });
    } else if (eventName === "payment.failed") {
        console.log("❌ Marking order as Failed");
        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: "Failed",
            },
        });
    } else {
        console.log("ℹ️ Unhandled event type:", eventName);
    }

    console.log("✅ Webhook processing complete");
    return json({ ok: true });
}
