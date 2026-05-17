"use client";

import React from "react";
import { useBooking } from "../booking/BookingProvider";
import Link from "next/link";

export default function Header() {
  const { openBookingModal } = useBooking();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600 dark:text-blue-500">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          NordWacht
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Solutions</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Services</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Company</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openBookingModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            Request Demo
          </button>
        </div>
      </div>
    </header>
  );
}
