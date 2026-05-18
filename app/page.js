"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "../components/navbar";
import BuilderForm from "../components/BuilderForm";
import PreviewPanel from "../components/PreviewPanel";
import LoginPanel from "../components/LoginPanel";
import MyResumes from "../components/MyResumes";
import ResumeDocument from "../components/ResumeDocument";
import JobSearchPanel from "../components/JobSearchPanel";

import { auth } from "../lib/firebase";
import { saveResumeCloud } from "../lib/cloudSave";
import { analyzeResume, saveDraft, loadDraft } from "../lib/resumeUtils";
import { defaultResume } from "../lib/resumeData";
import { startRazorpayCheckout } from "../lib/razorpayCheckout";

const freeTemplates = [
  {
    name: "free-modern",
    title: "Modern Starter CV",
    color: "#2563EB",
    pack: "Free",
    description: "Clean one-page resume for freshers and quick applications.",
  },
  {
    name: "professional-two-column",
    title: "Professional Two Column",
    color: "#0F172A",
    pack: "Free",
    description: "Balanced full-body CV with sidebar details and ATS-safe text.",
  },
];

const subscriptionPacks = [
  {
    id: "career-launch",
    name: "Career Launch",
    price: "Rs. 199",
    color: "#2563EB",
    accent: "#DBEAFE",
    templateCount: "5 premium templates",
    bestFor: "Freshers, interns, and early-career applicants",
    templates: ["blue-corporate", "minimal-fresher", "smart-sidebar", "bold-skills", "elegant-entry"],
    features: ["Fresher-ready layouts", "Unlimited exports", "ATS-safe section order"],
  },
  {
    id: "interview-pro",
    name: "Interview Pro",
    price: "Rs. 499",
    color: "#059669",
    accent: "#D1FAE5",
    templateCount: "7 advanced templates",
    bestFor: "Experienced professionals applying to competitive roles",
    templates: [
      "premium-ats",
      "executive-modern",
      "finance-sharp",
      "consultant-style",
      "global-pro",
      "sales-impact",
      "creative-clean",
    ],
    features: ["Premium ATS layouts", "Cloud save", "Impact-focused sections"],
  },
  {
    id: "executive-edge",
    name: "Executive Edge",
    price: "Rs. 999",
    color: "#7C3AED",
    accent: "#EDE9FE",
    templateCount: "10 executive templates",
    bestFor: "Managers, directors, founders, and senior leaders",
    templates: [
      "black-gold",
      "ceo-luxury",
      "royal-executive",
      "director-premium",
      "silicon-elite",
      "tech-dark",
      "platinum-pro",
      "manager-x",
      "international-max",
      "architect-pro",
    ],
    features: ["Leadership positioning", "AI suggestions", "Priority support"],
  },
];

const templates = [
  ...freeTemplates,
  ...subscriptionPacks.flatMap((pack) =>
    pack.templates.map((name) => ({
      name,
      title: name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      color: pack.color,
      pack: pack.price,
      packName: pack.name,
    }))
  ),
];

const featureCards = [
  ["ATS scoring", "Weighted scoring for keywords, structure, impact evidence, and readability."],
  ["Job matching", "Paste a JD and see matched keywords, missing keywords, and tailoring gaps."],
  ["Premium templates", "Modern, recruiter-friendly layouts that avoid ATS-hostile formatting."],
  ["Export workflow", "Preview, edit, save, and export PDF or DOCX from one guided workspace."],
];

const merchantUpiId = process.env.NEXT_PUBLIC_CVPILOT_UPI_ID || "";

const packAnchors = {
  "free-forever": "free-templates",
  "career-launch": "career-launch",
  "interview-pro": "interview-pro",
  "executive-edge": "executive-edge",
};

const customerReviews = [
  {
    name: "Ananya S.",
    role: "Salesforce Developer",
    rating: "5.0",
    result: "4 interview calls",
    quote: "CVPilot turned my plain resume into a clear, targeted CV in one sitting.",
  },
  {
    name: "Rahul M.",
    role: "Product Analyst",
    rating: "4.9",
    result: "ATS score improved to 91",
    quote: "The keyword breakdown made it obvious why my resume was not matching roles.",
  },
  {
    name: "Meera K.",
    role: "Finance Manager",
    rating: "5.0",
    result: "Premium CV selected",
    quote: "The paid templates look professional without breaking ATS readability.",
  },
];

const demoBefore = {
  ...defaultResume,
  name: "Priya Shah",
  role: "Business Analyst",
  email: "priya@example.com",
  phone: "+91 90000 00000",
  location: "Bengaluru",
  summary: "Business analyst looking for a good role. Worked on reports and requirements.",
  skills: "Excel, SQL, Jira",
  exp: "Worked with teams. Made dashboards. Helped with product documents.",
  education: "BBA, 2021",
};

const demoAfter = {
  ...demoBefore,
  summary:
    "Business Analyst with experience translating stakeholder needs into dashboards, user stories, and measurable process improvements for SaaS teams.",
  skills: "SQL, Excel, Jira, Power BI, User Stories, Requirements Gathering, Process Mapping, Stakeholder Management",
  exp:
    "- Built KPI dashboards that reduced weekly reporting effort by 30%.\n- Converted customer feedback into prioritized user stories for product and engineering teams.\n- Improved requirement clarity by mapping workflows, edge cases, and acceptance criteria.",
  projects:
    "Sales Insights Dashboard: consolidated data from multiple sources to help leadership track conversion, churn, and pipeline health.",
  achievements: "Shortlisted for 4 analyst roles after tailoring resume keywords to target job descriptions.",
};

function MiniResumePreview({ form, template, score, label }) {
  return (
    <article className="cvp-demo-resume">
      <div className="cvp-demo-label">
        <span>{label}</span>
        <strong>{score}% ATS</strong>
      </div>
      <div className="cvp-demo-frame">
        <div className="cvp-demo-scale">
          <ResumeDocument form={form} ats={score} template={template} compact />
        </div>
      </div>
    </article>
  );
}

function FlowSteps() {
  const steps = ["Upload CV", "Analyze", "ATS score", "Fix issues", "Preview", "Download"];

  return (
    <section className="cvp-section" id="flow">
      <div className="cvp-section-title">
        <span>Guided flow</span>
        <h2>From raw CV to application-ready resume</h2>
      </div>

      <div className="cvp-flow-grid">
        {steps.map((step, index) => (
          <article key={step} className="cvp-flow-step">
            <b>{index + 1}</b>
            <strong>{step}</strong>
            <p>
              {index === 0 && "Upload a PDF or DOCX, or start from the editable form."}
              {index === 1 && "Compare content against the target role and job description."}
              {index === 2 && "Review a detailed score for structure, keywords, impact, and readability."}
              {index === 3 && "Use suggestions to add missing keywords and stronger outcomes."}
              {index === 4 && "Inspect the resume in desktop and mobile preview modes."}
              {index === 5 && "Export a clean PDF or DOCX for real applications."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getPackAmount(pack) {
  return Number(String(pack.price || "").replace(/[^0-9.]/g, ""));
}

function buildUpiPaymentUrl({ pack, user }) {
  const amount = getPackAmount(pack);
  const note = `${pack.name} subscription${user?.email ? ` - ${user.email}` : ""}`;

  return `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(
    "CVPilot Pro"
  )}&am=${encodeURIComponent(amount.toFixed(2))}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export default function Home() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("desktop");
  const [template, setTemplate] = useState(templates[0]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [payingPlan, setPayingPlan] = useState("");
  const [paymentConfig, setPaymentConfig] = useState({
    configured: false,
    keyId: "",
    mode: "test",
    loaded: false,
  });
  const [form, setForm] = useState({
    ...defaultResume,
    name: "Rohith Annadatha",
    role: "Senior Salesforce Developer",
    email: "rohith@example.com",
    phone: "+91 00000 00000",
    location: "India",
    summary:
      "Certified Salesforce developer skilled in Apex, LWC, integrations and scalable CRM architecture.",
    skills: "Salesforce, Apex, LWC, SOQL, REST API, Flows, Integration, Automation",
    exp:
      "- Delivered enterprise Salesforce solutions across Apex, LWC, Flow, and REST integrations.\n- Automated CRM workflows that reduced manual sales operations effort by 35%.",
    projects:
      "Built automated lead routing, LWC dashboards, and REST integrations that improved sales operations.",
    education: "B.Tech in Computer Science",
    certifications: "Salesforce Platform Developer I, Administrator",
    achievements: "Reduced manual CRM work by 35% through flow automation.",
    jd:
      "Salesforce Developer with Apex, Lightning Web Components, SOQL, REST integration, automation, CRM workflows, and stakeholder communication.",
  });

  const analysis = useMemo(() => analyzeResume(form), [form]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const draft = loadDraft();

    if (draft) {
      setForm({
        ...defaultResume,
        ...draft,
      });
    }

    try {
      const pack = JSON.parse(localStorage.getItem("cvpilot_selected_pack") || "null");
      setSelectedPack(pack);
    } catch {
      setSelectedPack(null);
    }
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

  const runATS = () => {
    saveDraft(form);
    alert(`ATS analysis complete: ${analysis.score}% (${analysis.readiness}).`);
  };

  const saveResume = async () => {
    try {
      saveDraft(form);

      if (user) {
        await saveResumeCloud(user, form, analysis.score, template);
        alert("Saved to cloud.");
      } else {
        alert("Saved locally.");
      }
    } catch (error) {
      console.error(error);
      alert("Save failed.");
    }
  };

  const openResume = (item) => {
    if (!item) return;

    setForm({
      ...defaultResume,
      ...item.form,
    });

    const selected = templates.find((entry) => entry.name === item.template);

    if (selected) {
      setTemplate(selected);
    }

    window.scrollTo({
      top: document.getElementById("builder")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const openTemplatePage = (item) => {
    saveDraft(form);
    localStorage.setItem("resumeData", JSON.stringify(form));
    setTemplate(item);
    router.push(`/templates/${item.name}`);
  };

  const openSubscribedPack = (pack = selectedPack) => {
    if (!pack) return;

    const invoiceReadyForm = {
      ...form,
      email: user?.email || form.email,
    };

    saveDraft(invoiceReadyForm);
    localStorage.setItem("resumeData", JSON.stringify(invoiceReadyForm));
    router.push(`/templates/results#${packAnchors[pack.id] || "free-templates"}`);
  };

  const choosePack = async (pack) => {
    if (pack.id === "free-forever") {
      localStorage.setItem("cvpilot_selected_pack", JSON.stringify(pack));
      setSelectedPack(pack);
      openSubscribedPack(pack);
      return;
    }

    if (selectedPack?.id === pack.id && selectedPack?.paymentId) {
      openSubscribedPack(selectedPack);
      return;
    }

    if (!user?.email) {
      alert("Please login with email first. Paid packs and invoices need the same account email.");
      document.getElementById("account")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!paymentConfig.configured) {
      alert("Razorpay keys are missing. Add RAZORPAY_KEY_ID, NEXT_PUBLIC_RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET in .env, then restart the app.");
      return;
    }

    saveDraft(form);
    const invoiceReadyForm = {
      ...form,
      email: user.email || form.email,
    };

    localStorage.setItem("resumeData", JSON.stringify(invoiceReadyForm));
    localStorage.setItem("cvpilot_selected_pack", JSON.stringify(pack));

    setPayingPlan(pack.id);

    try {
      await startRazorpayCheckout({
        planId: pack.id,
        customer: {
          name: invoiceReadyForm.name,
          email: invoiceReadyForm.email,
          phone: invoiceReadyForm.phone,
          linkedin: invoiceReadyForm.linkedin,
        },
        onSuccess: (payment) => {
          const paidPack = {
            ...pack,
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            invoiceEmail: payment.invoiceEmail,
            invoiceLinkedIn: payment.invoiceLinkedIn,
            paidAt: new Date().toISOString(),
          };

          localStorage.setItem("cvpilot_selected_pack", JSON.stringify(paidPack));
          setSelectedPack(paidPack);
          openSubscribedPack(paidPack);
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

  const openUpiPayment = async (pack) => {
    if (!merchantUpiId) {
      alert("UPI ID is not configured. Add NEXT_PUBLIC_CVPILOT_UPI_ID in .env and restart the app.");
      return;
    }

    if (!user?.email) {
      alert("Please login first so the UPI payment can be matched to your account.");
      document.getElementById("account")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      await navigator.clipboard?.writeText(merchantUpiId);
    } catch {
      // Clipboard is a convenience only; payment opening should still continue.
    }

    window.location.href = buildUpiPaymentUrl({ pack, user });
    alert("UPI app opened and UPI ID copied. Use Razorpay for automatic unlock, or send UPI payment proof for manual activation.");
  };

  const hasPaidPack = Boolean(user?.email && selectedPack?.paymentId);

  return (
    <main className={`cvp-app-shell ${dark ? "is-dark" : ""}`} id="top">
      <Navbar dark={dark} setDark={setDark} />

      <section className="cvp-hero">
        <div className="cvp-hero-content">
          <span className="cvp-hero-badge">AI resume builder for serious job applications</span>
          <h1>Build an ATS-ready CV that looks premium and gets interviews.</h1>
          <p>
            CVPilot helps you upload, score, improve, preview, and export a recruiter-ready
            resume with job-specific keyword analysis and premium templates.
          </p>

          <div className="cvp-hero-actions">
            <a href="#builder" className="cvp-primary-link">
              Analyze My CV
            </a>
            <a href="#pricing" className="cvp-secondary-link">
              View Pricing
            </a>
          </div>

          <div className="cvp-trust-row">
            <div>
              <strong>12,400+</strong>
              <span>demo resumes improved</span>
            </div>
            <div>
              <strong>4-part</strong>
              <span>ATS score breakdown</span>
            </div>
            <div>
              <strong>24</strong>
              <span>free and premium templates</span>
            </div>
          </div>
        </div>

        <div className="cvp-hero-demo" aria-label="Before and after resume preview">
          <MiniResumePreview
            form={demoBefore}
            template={{ name: "free-modern", color: "#94a3b8" }}
            score={54}
            label="Before"
          />
          <MiniResumePreview
            form={demoAfter}
            template={{ name: "premium-ats", color: "#059669" }}
            score={92}
            label="After CVPilot"
          />
        </div>
      </section>

      <section className="cvp-section cvp-feature-band">
        <div className="cvp-feature-grid">
          {featureCards.map(([title, body]) => (
            <article key={title} className="cvp-feature-card">
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <FlowSteps />

      <section className="cvp-section" id="templates">
        <div className="cvp-section-title">
          <span>Templates</span>
          <h2>ATS-friendly designs that still look polished</h2>
          <p>
            Free templates cover the basics. Paid packs unlock fresher, professional, and
            executive layouts with stronger visual hierarchy.
          </p>
        </div>

        <div className="cvp-template-grid">
          {freeTemplates.map((item) => (
            <button
              key={item.name}
              onClick={() => openTemplatePage(item)}
              className={`cvp-template-card ${template.name === item.name ? "active" : ""}`}
              style={{ "--template-color": item.color }}
            >
              <MiniResumePreview form={form} template={item} score={analysis.score} label={item.pack} />
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="cvp-section" id="pricing">
        <div className="cvp-section-title">
          <span>Pricing</span>
          <h2>Start free, upgrade when the resume matters</h2>
          <p>
            Paid packs open Razorpay Checkout directly and unlock only after the server
            verifies the payment signature.
          </p>
        </div>

        <div className="cvp-pricing-grid">
          <article className="cvp-price-card">
            <span>Starter</span>
            <h3>Free Forever</h3>
            <strong>Rs. 0</strong>
            <p>For quick edits, ATS checks, and basic exporting.</p>
            <ul>
              <li>2 free templates</li>
              <li>ATS score and keyword matching</li>
              <li>PDF and DOCX export</li>
            </ul>
            <button onClick={() => choosePack({ id: "free-forever", name: "Free Forever" })}>
              Start Free
            </button>
          </article>

          {subscriptionPacks.map((pack) => (
            <article
              key={pack.id}
              className={`cvp-price-card ${pack.id === "interview-pro" ? "featured" : ""}`}
              style={{ "--plan-color": pack.color }}
            >
              <span>{pack.templateCount}</span>
              <h3>{pack.name}</h3>
              <strong>{pack.price}</strong>
              <p>{pack.bestFor}</p>
              <ul>
                {pack.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="cvp-price-actions">
                <button onClick={() => choosePack(pack)} disabled={Boolean(payingPlan)}>
                  {payingPlan === pack.id
                    ? "Opening Razorpay..."
                    : selectedPack?.id === pack.id && selectedPack?.paymentId
                      ? "Open Pack"
                      : "Upgrade"}
                </button>
                <button
                  className="cvp-upi-action"
                  onClick={() => openUpiPayment(pack)}
                  disabled={!merchantUpiId}
                >
                  Pay by UPI
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cvp-section" id="reviews">
        <div className="cvp-section-title">
          <span>Customer reviews</span>
          <h2>Rated by job seekers building stronger CVs</h2>
        </div>

        <div className="cvp-review-summary">
          <strong>4.9 / 5</strong>
          <span>Average customer rating</span>
          <p>Based on early CVPilot Pro users testing ATS scoring, premium templates, and exports.</p>
        </div>

        <div className="cvp-testimonial-grid">
          {customerReviews.map((item) => (
            <article key={item.name} className="cvp-testimonial-card">
              <div className="cvp-rating-row">
                <b>{item.rating} / 5</b>
                <span>{item.result}</span>
              </div>
              <p>"{item.quote}"</p>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="cvp-workspace" id="account">
        <div className="cvp-section-title">
          <span>Workspace</span>
          <h2>Your guided CV cockpit</h2>
          <p>
            Upload your current CV, paste the target job description, review the score,
            apply suggestions, then export the final resume.
          </p>
        </div>

        <div className="cvp-account-row">
          <LoginPanel user={user} />
          <div className="cvp-pack-status">
            <span>Plan status</span>
            <strong>{hasPaidPack ? selectedPack.name : "Free workspace"}</strong>
            <p>{hasPaidPack ? "Premium AI and paid templates are unlocked." : "Upgrade to unlock AI rewriting and premium packs."}</p>
            {hasPaidPack && (
              <button className="cvp-pack-open" onClick={() => openSubscribedPack()}>
                Open subscribed pack
              </button>
            )}
          </div>
        </div>

        <MyResumes user={user} onOpen={openResume} />

        <div className="cvp-product-grid">
          <BuilderForm
            form={form}
            setForm={setForm}
            runATS={runATS}
            saveResume={saveResume}
            analysis={analysis}
            allowAI={hasPaidPack}
          />

          <PreviewPanel
            form={form}
            ats={analysis.score}
            analysis={analysis}
            template={template}
            view={view}
            setView={setView}
          />
        </div>

        <JobSearchPanel form={form} user={user} />
      </section>

      <footer className="cvp-footer" id="copyright">
        <div>
          <a href="#top" className="cvp-footer-brand">
            CVPilot Pro
          </a>
          <p>
            Copyright (c) 2026 CVPilot Pro. All rights reserved. Resume templates,
            scoring screens, copy, and product design belong to CVPilot Pro.
          </p>
        </div>
        <nav aria-label="Footer">
          <a href="#pricing">Pricing</a>
          <a href="#reviews">Reviews</a>
          <a href="#account">Account</a>
        </nav>
      </footer>
    </main>
  );
}
