import { NextResponse } from "next/server";

import { verifyRazorpaySignature } from "../../../lib/razorpayServer";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing Razorpay verification fields." },
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
        { success: false, error: "Payment signature mismatch." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unable to verify Razorpay payment.",
      },
      { status: error.statusCode === 401 ? 401 : 500 }
    );
  }
}
