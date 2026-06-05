"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Cloud, 
  Server, 
  Layers, 
  Lock, 
  FileText, 
  Eye, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type QuizStep = "q1" | "q2" | "q3" | "contact" | "success";

interface QuizAnswers {
  infrastructure: string;
  compliance: string;
  securityPriority: string;
}

export default function RoadmapModal({ isOpen, onClose }: RoadmapModalProps) {
  const [step, setStep] = useState<QuizStep>("q1");
  const [answers, setAnswers] = useState<QuizAnswers>({
    infrastructure: "",
    compliance: "",
    securityPriority: "",
  });

  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gdprConsent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectInfrastructure = (value: string) => {
    setAnswers({ ...answers, infrastructure: value });
    setStep("q2");
  };

  const selectCompliance = (value: string) => {
    setAnswers({ ...answers, compliance: value });
    setStep("q3");
  };

  const selectPriority = (value: string) => {
    setAnswers({ ...answers, securityPriority: value });
    setStep("contact");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/submit-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: contactInfo.firstName.trim(),
          lastName: contactInfo.lastName.trim(),
          email: contactInfo.email.trim(),
          gdprConsent: contactInfo.gdprConsent,
          quizAnswers: {
            infrastructure: answers.infrastructure,
            compliance: answers.compliance,
            securityPriority: answers.securityPriority,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setStep("success");
    } catch (err: unknown) {
      console.error("[Roadmap Submit Error]", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = () => {
    switch (step) {
      case "q1": return 20;
      case "q2": return 40;
      case "q3": return 60;
      case "contact": return 85;
      case "success": return 100;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto transition-opacity duration-300">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out transform scale-100 overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

        {/* Header */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/80 pt-8">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-500 animate-pulse" />
              Custom Audit Roadmap
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {step === "q1" && "Step 1: Define your architecture"}
              {step === "q2" && "Step 2: Choose compliance targets"}
              {step === "q3" && "Step 3: State your primary concern"}
              {step === "contact" && "Step 4: Who should we send the roadmap to?"}
              {step === "success" && "Roadmap request complete!"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        {step !== "success" && (
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 flex-none">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercentage()}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* STEP 1: Infrastructure */}
          {step === "q1" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                What is your primary infrastructure environment?
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    id: "Cloud-native",
                    title: "Cloud-native",
                    desc: "AWS, GCP, Azure, Vercel, or modern serverless tech stack.",
                    icon: <Cloud className="w-6 h-6 text-blue-500" />,
                  },
                  {
                    id: "On-Premise",
                    title: "On-Premise",
                    desc: "Physical servers, co-location hosting, or private hardware.",
                    icon: <Server className="w-6 h-6 text-indigo-500" />,
                  },
                  {
                    id: "Hybrid",
                    title: "Hybrid / Multi-Cloud",
                    desc: "A mix of physical datacenters and multi-cloud providers.",
                    icon: <Layers className="w-6 h-6 text-purple-500" />,
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectInfrastructure(opt.id)}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-blue-500/50 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 hover:shadow-lg hover:-translate-y-0.5 transition-all group outline-none"
                  >
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                      {opt.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Compliance */}
          {step === "q2" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Which regulatory compliance framework is your highest priority?
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    id: "SOC 2",
                    title: "SOC 2 Type II",
                    desc: "Securing customer data for SaaS platforms and enterprise clients.",
                    icon: <Lock className="w-6 h-6 text-emerald-500" />,
                  },
                  {
                    id: "ISO 27001",
                    title: "ISO / IEC 27001",
                    desc: "Global standard for Information Security Management Systems.",
                    icon: <FileText className="w-6 h-6 text-amber-500" />,
                  },
                  {
                    id: "GDPR / HIPAA",
                    title: "GDPR / HIPAA Privacy",
                    desc: "European user data privacy or medical record security standards.",
                    icon: <Eye className="w-6 h-6 text-sky-500" />,
                  },
                  {
                    id: "General Hardening",
                    title: "None / General Security",
                    desc: "No strict compliance audits needed, just general posture hardening.",
                    icon: <Shield className="w-6 h-6 text-blue-500" />,
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectCompliance(opt.id)}
                    className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-blue-500/50 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 hover:shadow-lg hover:-translate-y-0.5 transition-all group outline-none"
                  >
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                      {opt.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("q1")}
                className="mt-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1.5 transition-colors font-medium outline-none"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 1
              </button>
            </div>
          )}

          {/* STEP 3: Security Threat Concern */}
          {step === "q3" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                What is your organization&apos;s primary security threat concern?
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    id: "Data Leakage",
                    title: "Data Leakage & Breaches",
                    desc: "Leaking proprietary IP, customer databases, or financial records.",
                  },
                  {
                    id: "Phishing & Social Eng",
                    title: "Phishing & Ransomware",
                    desc: "Malware infiltration via employee inbox credentials exploitation.",
                  },
                  {
                    id: "Cloud Misconfiguration",
                    title: "Cloud & IAM Misconfigurations",
                    desc: "Leaky S3 buckets, open API gateways, or over-privileged roles.",
                  },
                  {
                    id: "Vendor Supply Chain Risk",
                    title: "Third-Party & Supply Chain Risk",
                    desc: "Security breaches propagating from downstream tools and integrations.",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => selectPriority(opt.id)}
                    className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-blue-500/50 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 hover:shadow-lg hover:-translate-y-0.5 transition-all group outline-none"
                  >
                    <div className="space-y-1 pr-4">
                      <h4 className="font-bold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                    <div className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black group-hover:border-blue-500 group-hover:bg-blue-600 transition-all flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("q2")}
                className="mt-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1.5 transition-colors font-medium outline-none"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 2
              </button>
            </div>
          )}

          {/* STEP 4: Contact Details & GDPR Consent */}
          {step === "contact" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                Almost Done! Tell us where to send your roadmap:
              </h3>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={contactInfo.firstName}
                    onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Smith"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={contactInfo.lastName}
                    onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Work Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                />
              </div>

              {/* GDPR Compliance Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200/50 dark:border-zinc-850 rounded-2xl">
                <input
                  type="checkbox"
                  id="gdpr-checkbox"
                  required
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                  checked={contactInfo.gdprConsent}
                  onChange={(e) => setContactInfo({ ...contactInfo, gdprConsent: e.target.checked })}
                />
                <label htmlFor="gdpr-checkbox" className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed cursor-pointer select-none">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">GDPR Compliance Consent:</span> I consent to NordWacht processing my contact details to generate, deliver, and update my customized security audit roadmap, as well as sending relevant security notifications in accordance with their privacy policy.
                </label>
              </div>

              {/* Summary panel preview */}
              <div className="p-4 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 rounded-2xl text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
                <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px]">Quiz Summary</h4>
                <div className="grid grid-cols-[100px_1fr] gap-y-1">
                  <span>Infrastructure:</span>
                  <span className="font-semibold text-zinc-950 dark:text-zinc-50">{answers.infrastructure}</span>
                  <span>Compliance:</span>
                  <span className="font-semibold text-zinc-950 dark:text-zinc-50">{answers.compliance}</span>
                  <span>Threat Concern:</span>
                  <span className="font-semibold text-zinc-950 dark:text-zinc-50">{answers.securityPriority}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setStep("q3")}
                  className="text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1.5 transition-colors outline-none"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Q3
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.gdprConsent}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none inline-flex items-center gap-2 outline-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Get My Full Audit RoadMap
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Success State */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/10 border border-emerald-500/20 scale-105 animate-bounce duration-1000">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-3 max-w-md">
                <h3 className="text-2xl font-black text-zinc-950 dark:text-white">
                  Roadmap Initiated!
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Excellent work, <span className="font-bold text-zinc-900 dark:text-white">{contactInfo.firstName}</span>. Our security audit engine is analyzing your diagnostic parameters:
                </p>
                
                {/* Visual diagnostic report in success */}
                <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-4 text-xs text-left max-w-sm mx-auto border border-zinc-200/50 dark:border-zinc-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Arch: <span className="font-bold text-zinc-800 dark:text-zinc-200">{answers.infrastructure}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Focus: <span className="font-bold text-zinc-800 dark:text-zinc-200">{answers.compliance}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Priority: <span className="font-bold text-zinc-800 dark:text-zinc-200">{answers.securityPriority}</span></span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 leading-relaxed">
                  Your customized security audit roadmap will be dispatched to <span className="font-semibold text-blue-600 dark:text-blue-400">{contactInfo.email}</span> shortly. Please check your junk or spam folders if it does not appear within 5 minutes.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-full font-bold transition-all mt-4 inline-flex items-center gap-2 outline-none shadow-md"
              >
                Close Window
                <Check className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
