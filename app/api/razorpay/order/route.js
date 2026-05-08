import { NextResponse } from "next/server";

import { getRazorpayPlan } from "../../../../lib/razorpayPlans";
import {
  getRazorpayAuthHeader,
  getRazorpayCredentials,
} from "../../../../lib/razorpayServer";

export async function POST(req) {
  try {
    const { planId, customer = {} } = await req.json();
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
        { error: "Razorpay keys are not configured." },
        { status: 500 }
      );
    }

    const receipt = `cvp_${plan.id}_${Date.now()}`.slice(0, 40);
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: plan.amount,
        currency: plan.currency,
        receipt,
        notes: {
          planId: plan.id,
          planName: plan.name,
          customerEmail: customer.email || "",
          invoiceEmail: customer.email || "",
          invoiceLinkedIn: customer.linkedin || "",
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: order.error?.description || "Razorpay order creation failed.",
          details: order,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      keyId: credentials.keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      planId: plan.id,
      planName: plan.name,
      invoiceEmail: customer.email || "",
      invoiceLinkedIn: customer.linkedin || "",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to create payment order.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
