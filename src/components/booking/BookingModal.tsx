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
    timeline: "",
    objective: "",
  });



  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (step === "contact") {
      setStep("audit");
    } else if (step === "audit") {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/submit-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            orgSize: formData.orgSize,
            environment: formData.environment,
            compliance: formData.compliance,
            priority: formData.priority.trim(),
            role: formData.role.trim(),
            timeline: formData.timeline,
            objective: formData.objective,
          }),
        });

        if (!response.ok) {
          const resData = await response.json().catch(() => ({}));
          console.warn("[Lead Capture Warning] Webhook submission returned status:", response.status, resData.error);
        } else {
          console.log("[Lead Capture Success] Webhook lead capture completed successfully.");
        }
      } catch (error) {
        console.error("[Lead Capture Error] Failed to submit lead to serverless route:", error);
      } finally {
        setIsSubmitting(false);
        setStep("calendly");
      }
    }
  };

  const handleBack = () => {
    if (step === "audit") setStep("contact");
    else if (step === "calendly") setStep("audit");
  };

  if (!isOpen) return null;

  const isCalendly = step === "calendly";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div 
        className={`relative w-full ${isCalendly ? 'max-w-5xl' : 'max-w-2xl'} bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
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
        <div className={`flex-1 overflow-y-auto ${isCalendly ? 'p-0' : 'p-6'}`}>
          {step === "contact" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === "audit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Organization Size</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Your Role</label>
                <input
                  type="text"
                  placeholder="e.g. IT Manager"
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Timeline</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                >
                  <option value="">Select timeline...</option>
                  <option value="ASAP">ASAP</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3+ months">3+ months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Objective</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                >
                  <option value="">Select objective...</option>
                  <option value="Technical Audit">Technical Audit</option>
                  <option value="Architecture Preview">Architecture Preview</option>
                  <option value="Compliance (SOC2/ISO)">Compliance (SOC2/ISO)</option>
                  <option value="V - CISO Services">V - CISO Services</option>
                </select>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Top Security Priority</label>
                <input
                  type="text"
                  placeholder="e.g. Data Breach Prevention"
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === "calendly" && (
            <div className="flex flex-col lg:flex-row h-full w-full">
              {/* Left: Calendly widget */}
              <div className="flex-1 w-full min-h-[650px] lg:min-h-0 relative">
                <CalendlyWidget formData={formData} />
              </div>
              
              {/* Right: Summary panel */}
              <div className="w-full lg:w-[400px] bg-zinc-50 dark:bg-zinc-800/30 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 p-6 lg:p-8 flex flex-col space-y-8 overflow-y-auto">
                {/* Progress */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Booking Progress</h3>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm font-medium">1. Contact Details</span>
                    </div>
                    <div className="w-0.5 h-4 bg-zinc-200 dark:bg-zinc-700 ml-2.5 -my-1"></div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm font-medium">2. Infrastructure Audit</span>
                    </div>
                    <div className="w-0.5 h-4 bg-zinc-200 dark:bg-zinc-700 ml-2.5 -my-1"></div>
                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 dark:border-blue-400 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold">3. Schedule Session</span>
                    </div>
                    <div className="w-0.5 h-4 bg-zinc-200 dark:bg-zinc-700 ml-2.5 -my-1"></div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600"></div>
                      <span className="text-sm font-medium">4. Confirmation</span>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-zinc-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">30 Minute Technical Review</p>
                        <p className="text-xs text-zinc-500">30 min</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-zinc-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">Web Conferencing</p>
                        <p className="text-xs text-zinc-500">Details provided upon confirmation</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary of Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Information Shared</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {formData.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{formData.name}</p>
                        <p className="text-xs text-zinc-500">{formData.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 text-sm shadow-sm">
                      <div className="grid grid-cols-[100px_1fr] gap-y-2 items-center">
                        <span className="text-zinc-500 text-xs">Org Size:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium text-xs truncate" title={formData.orgSize || "N/A"}>{formData.orgSize || "N/A"}</span>
                        
                        <span className="text-zinc-500 text-xs">Environment:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium text-xs truncate" title={formData.environment || "N/A"}>{formData.environment || "N/A"}</span>
                        
                        <span className="text-zinc-500 text-xs">Compliance:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium text-xs truncate" title={formData.compliance || "N/A"}>{formData.compliance || "N/A"}</span>
                        
                        <span className="text-zinc-500 text-xs">Priority:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium text-xs truncate" title={formData.priority || "N/A"}>{formData.priority || "N/A"}</span>
                        
                        <span className="text-zinc-500 text-xs">Role:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium text-xs truncate" title={formData.role || "N/A"}>{formData.role || "N/A"}</span>
                        
                        <span className="text-zinc-500 text-xs">Timeline:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium text-xs truncate" title={formData.timeline || "N/A"}>{formData.timeline || "N/A"}</span>
                        
                        <span className="text-zinc-500 text-xs">Objective:</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium text-xs truncate" title={formData.objective || "N/A"}>{formData.objective || "N/A"}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-500 flex items-start gap-2 pt-2">
                      <svg className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>This information will be shared with the host to prepare for your session.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== "calendly" && (
          <div className="flex-none flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
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
              disabled={isSubmitting || !formData.name || !formData.email || (step === "audit" && (!formData.orgSize || !formData.environment || !formData.compliance || !formData.priority || !formData.role || !formData.timeline || !formData.objective))}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-full font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {step === "audit" ? (isSubmitting ? "Submitting..." : "Continue to Calendar") : "Next"}
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
  timeline: string;
  objective: string;
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
  const [isDark, setIsDark] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect dark mode from system preference or Tailwind 'dark' class
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const checkDark = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      setIsDark(hasDarkClass || mediaQuery.matches);
    };
    
    checkDark();
    
    const handler = () => checkDark();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (error) return;

    let isMounted = true;

    const initWidget = () => {
      if (!isMounted) return;

      if (window.Calendly && containerRef.current) {
        // Clear any existing widget if it's re-initializing
        containerRef.current.innerHTML = '';
        
        try {
          window.Calendly.initInlineWidget({
            url: `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`,
            parentElement: containerRef.current,
            prefill: {
              name: formData.name,
              email: formData.email,
              customAnswers: {
                a1: formData.timeline,
                a2: formData.objective,
                a3: `Org Size: ${formData.orgSize}\nInfrastructure: ${formData.environment}\nCompliance: ${formData.compliance}\nPriority: ${formData.priority}\nRole: ${formData.role}`,
              },
            },
            branding: {
              primaryColor: process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR || "2563eb", // blue-600
              textColor: process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR || (isDark ? "ffffff" : "18181b"),
              backgroundColor: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR || (isDark ? "18181b" : "ffffff"), // zinc-900 or white
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
  }, [formData, error, isDark]);

  return (
    <div className="flex flex-col w-full h-full">
      <Script 
        src="https://assets.calendly.com/assets/external/widget.js" 
        strategy="afterInteractive"
      />
      
      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 animate-pulse">Loading calendar...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] p-8 m-6 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
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
        className={`w-full flex-1 min-h-[650px] lg:min-h-0 ${isLoading || error ? "hidden" : "block"}`} 
      />
    </div>
  );
}
