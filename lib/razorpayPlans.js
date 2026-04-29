export const razorpayPlans = [
  {
    id: "free-forever",
    name: "Free Forever",
    price: 0,
    amount: 0,
    currency: "INR",
  },
  {
    id: "career-launch",
    name: "Career Launch",
    price: 199,
    amount: 19900,
    currency: "INR",
  },
  {
    id: "interview-pro",
    name: "Interview Pro",
    price: 499,
    amount: 49900,
    currency: "INR",
  },
  {
    id: "executive-edge",
    name: "Executive Edge",
    price: 999,
    amount: 99900,
    currency: "INR",
  },
];

export function getRazorpayPlan(planId) {
  return razorpayPlans.find((plan) => plan.id === planId);
}
