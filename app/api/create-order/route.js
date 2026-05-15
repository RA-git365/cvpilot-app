import { NextResponse } from "next/server";

import {
  buildRazorpayReceipt,
  createRazorpayOrder,
  getRazorpayCredentials,
} from "../../../lib/razorpayServer";

export async function POST(req) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const currency = body.currency || "INR";
    const receipt = body.receipt || buildRazorpayReceipt("cvp_order");
    const credentials = getRazorpayCredentials();

    if (!Number.isInteger(amount) || amount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise." },
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
      amount,
      currency,
      receipt,
      notes: body.notes || {},
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.error?.description || error.message || "Unable to create Razorpay order.",
      },
      { status: error.statusCode === 401 ? 401 : 500 }
    );
  }
}
