import React from 'react';

export interface VehicleSpec {
  model: string;
  capacity: string;
  luggage: string;
  desc: string;
}

export interface PassengerOption {
  value: number;
  label: string;
  desc: string;
}

export interface PriceResult {
  distance: string;
  duration: string;
  prices: Record<string, number>;
  formatSpecial?: boolean;
}

export interface SelectedVehicle {
  type: string;
  price: number;
}

export type BookingStep = 'vehicles' | 'form' | 'success';

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  flightNotes: string;
}

export interface ClientFormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}
