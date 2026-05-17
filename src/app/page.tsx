"use client";

import Header from "@/components/layout/Header";
import { useBooking } from "@/components/booking/BookingProvider";
import { Shield, Lock, Zap, BarChart } from "lucide-react";

export default function Home() {
  const { openBookingModal } = useBooking();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-zinc-50 dark:bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.1),transparent)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Enterprise Security Audit 2026</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8 leading-[1.1]">
                Secure Your Infrastructure. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Before They Do.</span>
              </h1>
              
              <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Elite cybersecurity auditing and threat intelligence for modern enterprises. 
                Identify vulnerabilities, ensure compliance, and harden your defenses.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={openBookingModal}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  Book Technical Audit
                  <Zap className="w-5 h-5" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                  View Solutions
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white dark:bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Threat Detection",
                  description: "Real-time vulnerability scanning and automated threat prioritization.",
                  icon: <Shield className="w-6 h-6 text-blue-600" />,
                },
                {
                  title: "Compliance Ready",
                  description: "Seamlessly meet ISO 27001, SOC2, and GDPR requirements.",
                  icon: <Lock className="w-6 h-6 text-blue-600" />,
                },
                {
                  title: "Risk Analytics",
                  description: "Granular insights into your organization's security posture.",
                  icon: <BarChart className="w-6 h-6 text-blue-600" />,
                },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:border-blue-500/50 transition-all group">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
        &copy; 2026 NordWacht Cybersecurity. All rights reserved.
      </footer>
    </div>
  );
}