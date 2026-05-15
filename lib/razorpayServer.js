import crypto from "crypto";
import Razorpay from "razorpay";

export function getRazorpayCredentials() {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  return {
    keyId,
    keySecret,
    configured: Boolean(keyId && keySecret),
  };
}

export function getRazorpayAuthHeader() {
  const { keyId, keySecret, configured } = getRazorpayCredentials();

  if (!configured) return "";

  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export function getMaskedRazorpayKeyId() {
  const { keyId } = getRazorpayCredentials();

  if (!keyId) return "";

  return `${keyId.slice(0, 8)}...${keyId.slice(-4)}`;
}

export function getRazorpayClient() {
  const { keyId, keySecret, configured } = getRazorpayCredentials();

  if (!configured) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export function buildRazorpayReceipt(prefix = "cvp") {
  return `${prefix}_${Date.now()}`.slice(0, 40);
}

export async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt = buildRazorpayReceipt(),
  notes = {},
}) {
  const client = getRazorpayClient();

  if (!client) {
    const error = new Error("Razorpay credentials are not configured.");
    error.statusCode = 401;
    throw error;
  }

  return client.orders.create({
    amount,
    currency,
    receipt,
    notes,
  });
}

export async function fetchRazorpayOrder(orderId) {
  const client = getRazorpayClient();

  if (!client) {
    const error = new Error("Razorpay credentials are not configured.");
    error.statusCode = 401;
    throw error;
  }

  return client.orders.fetch(orderId);
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}) {
  const { keySecret, configured } = getRazorpayCredentials();

  if (!configured) {
    const error = new Error("Razorpay credentials are not configured.");
    error.statusCode = 401;
    throw error;
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}
