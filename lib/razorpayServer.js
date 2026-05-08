export function getRazorpayCredentials() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
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
