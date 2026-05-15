"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../../../../lib/firebase";
import { startRazorpayCheckout } from "../../../../../lib/razorpayCheckout";

const merchantUpiId = process.env.NEXT_PUBLIC_CVPILOT_UPI_ID || "";

const plans = [
  {
    id: "free-forever",
    name: "Free Forever",
    price: "Rs. 0",
    badge: "Starter",
    subtitle: "Try CVPilot with two attractive resume templates.",
    button: "Start Free",
    color: "#0f172a",
    features: [
      "2 free full-body CV templates",
      "Basic resume editing",
      "ATS score check",
      "PDF and DOCX export",
      "Save 1 local resume",
    ],
  },
  {
    id: "career-launch",
    name: "Career Launch",
    price: "Rs. 199",
    badge: "Freshers",
    subtitle: "A sharp first-job pack for freshers, interns, and students.",
    button: "Take Career Launch",
    color: "#2563eb",
    features: [
      "5 premium fresher templates",
      "Unlimited downloads",
      "Modern colors and typography",
      "ATS-friendly sections",
      "Multiple local and cloud resumes",
    ],
  },
  {
    id: "interview-pro",
    name: "Interview Pro",
    price: "Rs. 499",
    badge: "Most Useful",
    subtitle: "For experienced professionals who need stronger positioning.",
    button: "Take Interview Pro",
    color: "#059669",
    features: [
      "7 advanced professional templates",
      "Premium ATS layouts",
      "Impact-focused experience sections",
      "Cloud save and unlimited exports",
      "Priority support",
    ],
  },
  {
    id: "executive-edge",
    name: "Executive Edge",
    price: "Rs. 999",
    badge: "Leadership",
    subtitle: "For managers, directors, founders, and senior professionals.",
    button: "Take Executive Edge",
    color: "#7c3aed",
    features: [
      "10 executive CV templates",
      "International and leadership styles",
      "AI resume suggestions",
      "LinkedIn summary support",
      "Priority support",
    ],
  },
];

function getPlanAmount(plan) {
  return Number(String(plan.price || "").replace(/[^0-9.]/g, ""));
}

function buildUpiPaymentUrl({ plan, user }) {
  const amount = getPlanAmount(plan);
  const note = `${plan.name} subscription${user?.email ? ` - ${user.email}` : ""}`;

  return `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(
    "CVPilot Pro"
  )}&am=${encodeURIComponent(amount.toFixed(2))}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export default function PricingPage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState("");
  const [payingPlan, setPayingPlan] = useState("");
  const [user, setUser] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState({
    configured: false,
    keyId: "",
    mode: "test",
    loaded: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedPack(params.get("pack") || "");
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch("/api/razorpay/config")
      .then((response) => response.json())
      .then((config) => {
        setPaymentConfig({
          configured: Boolean(config.configured),
          keyId: config.keyId || "",
          mode: config.mode || "test",
          loaded: true,
        });
      })
      .catch(() => {
        setPaymentConfig((config) => ({
          ...config,
          loaded: true,
        }));
      });
  }, []);

  const takePlan = async (plan) => {
    if (plan.id === "free-forever") {
      localStorage.setItem("cvpilot_selected_pack", JSON.stringify(plan));
      alert("Free plan selected.");
      router.push("/");
      return;
    }

    if (!paymentConfig.configured) {
      alert("Razorpay keys are missing. Add your key id and key secret in .env, then restart the app.");
      return;
    }

    if (!user?.email) {
      alert("Please login with email first. Paid pack invoices are sent to that same email.");
      router.push("/");
      return;
    }

    setPayingPlan(plan.id);

    try {
      const savedResume = JSON.parse(
        localStorage.getItem("resumeData") ||
          localStorage.getItem("cvpilot_draft") ||
          "{}"
      );

      await startRazorpayCheckout({
        planId: plan.id,
        customer: {
          name: savedResume.name,
          email: user.email,
          phone: savedResume.phone,
          linkedin: savedResume.linkedin,
        },
        onSuccess: (payment) => {
          const paidPlan = {
            ...plan,
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            invoiceEmail: payment.invoiceEmail,
            invoiceLinkedIn: payment.invoiceLinkedIn,
            paidAt: new Date().toISOString(),
          };

          localStorage.setItem("cvpilot_selected_pack", JSON.stringify(paidPlan));
          alert(`${plan.name} payment verified. Invoice/receipt will use ${payment.invoiceEmail}.`);
          router.push("/");
        },
        onFailure: (message) => {
          if (message) alert(message);
        },
      });
    } catch (error) {
      alert(error.message || "Payment could not be started.");
    } finally {
      setPayingPlan("");
    }
  };

  const previewPlan = (plan) => {
    localStorage.setItem("cvpilot_selected_pack", JSON.stringify(plan));
  };

  const payByUpi = async (plan) => {
    if (!merchantUpiId) {
      alert("UPI ID is not configured. Add NEXT_PUBLIC_CVPILOT_UPI_ID in .env and restart the app.");
      return;
    }

    if (!user?.email) {
      alert("Please login first so the UPI payment can be matched to your account.");
      router.push("/");
      return;
    }

    try {
      await navigator.clipboard?.writeText(merchantUpiId);
    } catch {
      // UPI app opening still works even if clipboard access is blocked.
    }

    window.location.href = buildUpiPaymentUrl({ plan, user });
    alert("UPI app opened and UPI ID copied. Razorpay unlocks automatically; UPI payments need manual activation after proof.");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-200 font-bold uppercase tracking-[0.15em] text-sm">
            CVPilot Packs
          </span>
          <h1 className="text-5xl font-bold mb-4 mt-3">
            Choose the pack that matches the person's requirement.
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Keep the free page simple, then unlock focused template packs for
            freshers, professionals, and executives. Paid packs require email
            login so invoices and receipts go to the same account.
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6 flex justify-between items-center flex-wrap gap-5">
          <div>
            <span className="text-sm text-blue-200 font-bold uppercase tracking-[0.15em]">
              Razorpay account
            </span>
            <h2 className="text-2xl font-bold mt-2">
              {paymentConfig.configured ? "Checkout is connected" : "Checkout needs API keys"}
            </h2>
            <p className="text-slate-400 mt-2 leading-7">
              {paymentConfig.configured
                ? `Using ${paymentConfig.mode.toUpperCase()} key ${paymentConfig.keyId}. Orders are created and verified on the server.`
                : "Add RAZORPAY_KEY_ID, NEXT_PUBLIC_RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET in .env to activate paid plans."}
            </p>
            <p className="text-slate-400 mt-2 leading-7">
              Manual UPI fallback: {merchantUpiId || "add NEXT_PUBLIC_CVPILOT_UPI_ID in .env"}.
            </p>
          </div>
          <strong
            className="rounded-full px-4 py-2 text-sm"
            style={{
              background: paymentConfig.configured ? "#064e3b" : "#7f1d1d",
              color: paymentConfig.configured ? "#d1fae5" : "#fee2e2",
            }}
          >
            {paymentConfig.configured ? "Connected" : paymentConfig.loaded ? "Not configured" : "Checking"}
          </strong>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">
          {plans.map((plan) => {
            const highlighted = selectedPack === plan.id || plan.id === "interview-pro";

            return (
              <article
                key={plan.id}
                className={`rounded-lg p-8 border transition duration-300 hover:scale-105 ${
                  highlighted
                    ? "bg-slate-900 border-blue-500 shadow-2xl"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <p className="text-sm text-yellow-400 font-semibold mb-3">
                  {plan.badge}
                </p>

                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>

                <p className="text-4xl font-bold mb-2" style={{ color: plan.color }}>
                  {plan.price}
                </p>

                <p className="text-slate-400 mb-6 leading-7">{plan.subtitle}</p>

                <ul className="space-y-3 mb-8 text-sm">
                  {plan.features.map((item) => (
                    <li key={item} className="text-slate-300">
                      <span className="text-blue-200 font-bold">OK</span> {item}
                    </li>
                  ))}
                </ul>

                <button
                  onMouseEnter={() => previewPlan(plan)}
                  onClick={() => takePlan(plan)}
                  disabled={payingPlan === plan.id || (plan.id !== "free-forever" && !paymentConfig.configured)}
                  className="w-full py-3 rounded-lg font-semibold text-white"
                  style={{
                    background: plan.color,
                    opacity:
                      payingPlan === plan.id || (plan.id !== "free-forever" && !paymentConfig.configured)
                        ? 0.72
                        : 1,
                  }}
                >
                  {payingPlan === plan.id ? "Opening Razorpay..." : plan.button}
                </button>

                {plan.id !== "free-forever" && (
                  <button
                    onClick={() => payByUpi(plan)}
                    disabled={!merchantUpiId}
                    className="w-full py-3 rounded-lg font-semibold mt-3"
                    style={{
                      background: "#ffffff",
                      color: plan.color,
                      opacity: merchantUpiId ? 1 : 0.6,
                    }}
                  >
                    Pay by UPI
                  </button>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center">
          <h3 className="text-3xl font-bold mb-3">
            Build, preview, score, save, and export in one place.
          </h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Paid packs open Razorpay Checkout, verify the payment signature on the
            server, and unlock premium templates only after verification succeeds.
          </p>
        </div>
      </div>
    </main>
  );
}
