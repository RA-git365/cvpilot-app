import { NextResponse } from "next/server";

import { getRazorpayPlan } from "../../../../lib/razorpayPlans";
import {
  fetchRazorpayOrder,
  getRazorpayCredentials,
  verifyRazorpaySignature,
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

    if (!plan || plan.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid paid plan selected." },
        { status: 400 }
      );
    }

    if (!credentials.configured) {
      return NextResponse.json(
        { error: "Razorpay secret key is not configured." },
        { status: 401 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay verification fields." },
        { status: 400 }
      );
    }

    const verified = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!verified) {
      return NextResponse.json(
        { verified: false, error: "Payment signature mismatch." },
        { status: 400 }
      );
    }

    const order = await fetchRazorpayOrder(razorpay_order_id);

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
        error: error.error?.description || error.message || "Unable to verify payment.",
        details: error.message,
      },
      { status: error.statusCode === 401 ? 401 : 500 }
    );
  }
}
