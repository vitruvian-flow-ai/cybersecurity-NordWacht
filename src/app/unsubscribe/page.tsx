import Link from "next/link";
import { Shield } from "lucide-react";

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 sm:p-6">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl shadow-2xl flex flex-col border border-zinc-800 overflow-hidden text-center">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

        <div className="p-8 sm:p-10 flex flex-col items-center">
          {/* Logo Badge */}
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-3">
            Successfully Unsubscribed
          </h1>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Your email address has been safely removed from our automated threat audit communications. You will no longer receive follow-ups.
          </p>

          <Link 
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors outline-none"
          >
            Return to Homepage
          </Link>

          <div className="mt-8 pt-6 border-t border-zinc-800 w-full text-xs text-zinc-500">
            © {new Date().getFullYear()} NordWacht Cybersecurity.
          </div>
        </div>
      </div>
    </div>
  );
}
