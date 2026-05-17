"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import BookingModal from "./BookingModal";
import RoadmapModal from "./RoadmapModal";

interface BookingContextType {
  openBookingModal: () => void;
  closeBookingModal: () => void;
  openRoadmapModal: () => void;
  closeRoadmapModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  const openBookingModal = () => setIsOpen(true);
  const closeBookingModal = () => setIsOpen(false);

  const openRoadmapModal = () => setIsRoadmapOpen(true);
  const closeRoadmapModal = () => setIsRoadmapOpen(false);

  return (
    <BookingContext.Provider value={{ 
      openBookingModal, 
      closeBookingModal, 
      openRoadmapModal, 
      closeRoadmapModal 
    }}>
      {children}
      <BookingModal key={isOpen ? "booking-open" : "booking-closed"} isOpen={isOpen} onClose={closeBookingModal} />
      <RoadmapModal key={isRoadmapOpen ? "roadmap-open" : "roadmap-closed"} isOpen={isRoadmapOpen} onClose={closeRoadmapModal} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
