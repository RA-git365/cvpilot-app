const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT}"]`);

    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function startRazorpayCheckout({
  planId,
  customer = {},
  onSuccess,
  onFailure,
}) {
  const loaded = await loadRazorpayScript();

  if (!loaded) {
    throw new Error("Razorpay checkout could not be loaded.");
  }

  const orderResponse = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planId,
      customer,
    }),
  });

  const orderData = await orderResponse.json();

  if (!orderResponse.ok) {
    throw new Error(orderData.error || "Unable to create Razorpay order.");
  }

  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "CVPilot",
    description: orderData.planName,
    order_id: orderData.orderId,
    prefill: {
      name: customer.name || "",
      email: customer.email || "",
      contact: customer.phone || "",
    },
    notes: {
      planId,
      planName: orderData.planName,
      invoiceEmail: customer.email || "",
      invoiceLinkedIn: customer.linkedin || "",
    },
    theme: {
      color: "#2563eb",
    },
    handler: async (response) => {
      try {
        const verifyResponse = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId,
            invoiceEmail: customer.email || "",
            invoiceLinkedIn: customer.linkedin || "",
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyData.verified) {
          throw new Error(verifyData.error || "Payment verification failed.");
        }

        onSuccess?.(verifyData);
      } catch (error) {
        onFailure?.(error.message || "Payment verification failed.");
      }
    },
    modal: {
      ondismiss: () => {
        onFailure?.("Payment popup closed.");
      },
    },
  };

  const checkout = new window.Razorpay(options);
  checkout.on("payment.failed", (response) => {
    onFailure?.(response.error?.description || "Payment failed.");
  });
  checkout.open();
}
