"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

interface CalendlyOptions {
  url: string;
  parentElement: HTMLElement | null;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  branding?: {
    primaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
  };
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: CalendlyOptions) => void;
    };
  }
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "contact" | "audit" | "calendly";

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orgSize: "",
    environment: "",
    compliance: "",
    priority: "",
    role: "",
  });



  const handleNext = () => {
    if (step === "contact") setStep("audit");
    else if (step === "audit") setStep("calendly");
  };

  const handleBack = () => {
    if (step === "audit") setStep("contact");
    else if (step === "calendly") setStep("audit");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {step === "calendly" ? "Schedule Your Session" : "Technical Audit Request"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {step === "contact" && "Tell us who you are"}
              {step === "audit" && "Tell us about your infrastructure"}
              {step === "calendly" && "Choose a time that works for you"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "contact" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === "audit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Organization Size</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.orgSize}
                  onChange={(e) => setFormData({ ...formData, orgSize: e.target.value })}
                >
                  <option value="">Select size...</option>
                  <option value="1-50">1-50 endpoints</option>
                  <option value="50-500">50-500 endpoints</option>
                  <option value="500+">500+ endpoints</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Infrastructure</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                >
                  <option value="">Select env...</option>
                  <option value="Cloud">Cloud-native</option>
                  <option value="On-Prem">On-premise</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Compliance</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.compliance}
                  onChange={(e) => setFormData({ ...formData, compliance: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="ISO27001">ISO 27001</option>
                  <option value="SOC2">SOC2</option>
                  <option value="GDPR">GDPR / HIPAA</option>
                  <option value="None">None / Other</option>
                </select>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Top Security Priority</label>
                <input
                  type="text"
                  placeholder="e.g. Data Breach Prevention"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Your Role</label>
                <input
                  type="text"
                  placeholder="e.g. IT Manager"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === "calendly" && (
            <CalendlyWidget formData={formData} />
          )}
        </div>

        {/* Footer */}
        {step !== "calendly" && (
          <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleBack}
              disabled={step === "contact"}
              className={`text-sm font-medium transition-colors ${
                step === "contact" ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData.name || !formData.email}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white rounded-full font-semibold transition-all shadow-lg shadow-blue-500/20"
            >
              {step === "audit" ? "Continue to Calendar" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface BookingFormData {
  name: string;
  email: string;
  orgSize: string;
  environment: string;
  compliance: string;
  priority: string;
  role: string;
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

function CalendlyWidget({ formData }: { formData: BookingFormData }) {
  const initialError = React.useMemo(() => {
    if (!CALENDLY_URL) return "Calendly URL is not configured.";
    if (!CALENDLY_URL.startsWith("https://calendly.com/")) return "Invalid Calendly URL. It must start with https://calendly.com/";
    return null;
  }, []);

  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(!initialError);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) return;

    let isMounted = true;

    const initWidget = () => {
      if (!isMounted) return;

      if (window.Calendly && containerRef.current) {
        try {
          window.Calendly.initInlineWidget({
            url: `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`,
            parentElement: containerRef.current,
            prefill: {
              name: formData.name,
              email: formData.email,
              customAnswers: {
                a1: formData.orgSize,
                a2: formData.environment,
                a3: formData.compliance,
                a4: formData.priority,
                a5: formData.role,
              },
            },
            branding: {
              primaryColor: process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR || "0069ff",
              textColor: process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR || "4d5055",
              backgroundColor: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR || "ffffff",
            },
          });
          setIsLoading(false);
        } catch (e) {
          console.error("Calendly init error:", e);
          setError("Failed to initialize the calendar widget.");
          setIsLoading(false);
        }
      } else if (isMounted) {
        // Retry in 100ms if script not ready
        setTimeout(initWidget, 100);
      }
    };

    // 2. Set safety timeout (8 seconds)
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoading(prev => {
          if (prev) {
            setError("The calendar is taking too long to load.");
            return false;
          }
          return prev;
        });
      }
    }, 8000);

    initWidget();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [formData, error]);

  return (
    <div className="flex flex-col space-y-4">
      <Script 
        src="https://assets.calendly.com/assets/external/widget.js" 
        strategy="afterInteractive"
      />
      
      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 animate-pulse">Loading calendar...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-zinc-900 dark:text-white font-semibold mb-2">{error}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            If the calendar doesn&apos;t appear, you can book directly on our Calendly page.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            Open booking page in a new tab
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      <div 
        ref={containerRef}
        id="calendly-embed" 
        className={`min-w-[320px] min-h-[700px] rounded-xl overflow-hidden ${error ? "hidden" : "block"}`} 
      />
    </div>
  );
}
