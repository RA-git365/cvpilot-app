import { NextResponse } from "next/server";

import {
  getMaskedRazorpayKeyId,
  getRazorpayCredentials,
} from "../../../../lib/razorpayServer";

export async function GET() {
  const credentials = getRazorpayCredentials();

  return NextResponse.json({
    configured: credentials.configured,
    keyId: credentials.configured ? getMaskedRazorpayKeyId() : "",
    mode: credentials.keyId.startsWith("rzp_live_") ? "live" : "test",
  });
}
