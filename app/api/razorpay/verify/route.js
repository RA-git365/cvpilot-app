import crypto from "crypto";

import { NextResponse } from "next/server";

import { getRazorpayPlan } from "../../../../lib/razorpayPlans";
import {
  getRazorpayAuthHeader,
  getRazorpayCredentials,
} from "../../../../lib/razorpayServer";

export async function POST(req) {
  try {
    const {
      planId,
      invoiceEmail,
      invoiceLinkedIn,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    const plan = getRazorpayPlan(planId);
    const credentials = getRazorpayCredentials();
    const authHeader = getRazorpayAuthHeader();

    if (!plan || plan.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid paid plan selected." },
        { status: 400 }
      );
    }

    if (!credentials.configured || !authHeader) {
      return NextResponse.json(
        { error: "Razorpay secret key is not configured." },
        { status: 500 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay verification fields." },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", credentials.keySecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature.length !== razorpay_signature.length) {
      return NextResponse.json(
        { verified: false, error: "Payment signature mismatch." },
        { status: 400 }
      );
    }

    const verified = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!verified) {
      return NextResponse.json(
        { verified: false, error: "Payment signature mismatch." },
        { status: 400 }
      );
    }

    const orderResponse = await fetch(
      `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    const order = await orderResponse.json();

    if (!orderResponse.ok) {
      return NextResponse.json(
        {
          verified: false,
          error: order.error?.description || "Unable to confirm Razorpay order.",
        },
        { status: orderResponse.status }
      );
    }

    if (order.amount !== plan.amount || order.currency !== plan.currency) {
      return NextResponse.json(
        {
          verified: false,
          error: "Paid amount does not match the selected plan.",
        },
        { status: 400 }
      );
    }

    if (order.notes?.planId && order.notes.planId !== plan.id) {
      return NextResponse.json(
        {
          verified: false,
          error: "Paid order does not match the selected plan.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      planId: plan.id,
      planName: plan.name,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      invoiceEmail: invoiceEmail || "",
      invoiceLinkedIn: invoiceLinkedIn || "",
    });
  } catch (error) {
    return NextResponse.json(
      {
        verified: false,
        error: "Unable to verify payment.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
