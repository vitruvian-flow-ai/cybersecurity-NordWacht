"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Shield, Loader2, AlertCircle } from "lucide-react";

interface UnsubscribeClientProps {
  email?: string;
}

export default function UnsubscribeClient({ email }: UnsubscribeClientProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no_email">(email ? "loading" : "no_email");
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!email) return;

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const unsubscribeUser = async () => {
      try {
        const res = await fetch("/api/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    unsubscribeUser();
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 sm:p-6">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl shadow-2xl flex flex-col border border-zinc-800 overflow-hidden text-center">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

        <div className="p-8 sm:p-10 flex flex-col items-center">
          
          {status === "loading" && (
            <>
              <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-3">
                Processing Request
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Safely removing {email} from our systems...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-3">
                Successfully Unsubscribed
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Your email address ({email}) has been removed from our automated threat audit communications. You will no longer receive follow-ups.
              </p>
              <Link 
                href="/"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors outline-none block"
              >
                Return to Homepage
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-3">
                Something went wrong
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                We couldn&apos;t fully process your unsubscribe request for {email} at this moment. Please try again or contact support.
              </p>
              <Link 
                href="/"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition-colors outline-none block"
              >
                Return to Homepage
              </Link>
            </>
          )}

          {status === "no_email" && (
            <>
              <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50">
                <Shield className="w-8 h-8 text-zinc-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-3">
                Unsubscribe
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                No email address was provided in the link. Please use the exact link from your email, or contact us to be removed manually.
              </p>
              <Link 
                href="/"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors outline-none block"
              >
                Return to Homepage
              </Link>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800 w-full text-xs text-zinc-500">
            © {new Date().getFullYear()} NordWacht Cybersecurity.
          </div>
        </div>
      </div>
    </div>
  );
}
