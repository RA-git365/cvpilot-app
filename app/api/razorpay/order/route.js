import { NextResponse } from "next/server";

import { getRazorpayPlan } from "../../../../lib/razorpayPlans";
import {
  buildRazorpayReceipt,
  createRazorpayOrder,
  getRazorpayCredentials,
} from "../../../../lib/razorpayServer";

export async function POST(req) {
  try {
    const { planId, customer = {} } = await req.json();
    const plan = getRazorpayPlan(planId);
    const credentials = getRazorpayCredentials();

    if (!plan || plan.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid paid plan selected." },
        { status: 400 }
      );
    }

    if (plan.amount < 100) {
      return NextResponse.json(
        { error: "Minimum Razorpay order amount is 100 paise." },
        { status: 400 }
      );
    }

    if (!credentials.configured) {
      return NextResponse.json(
        { error: "Razorpay keys are not configured." },
        { status: 401 }
      );
    }

    const order = await createRazorpayOrder({
      amount: plan.amount,
      currency: plan.currency,
      receipt: buildRazorpayReceipt(`cvp_${plan.id}`),
      notes: {
        planId: plan.id,
        planName: plan.name,
        customerEmail: customer.email || "",
        invoiceEmail: customer.email || "",
        invoiceLinkedIn: customer.linkedin || "",
      },
    });

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
        error: error.error?.description || error.message || "Unable to create payment order.",
        details: error.message,
      },
      { status: error.statusCode === 401 ? 401 : 500 }
    );
  }
}
