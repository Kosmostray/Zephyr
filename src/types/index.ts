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
  isBus?: boolean;
  busSpec?: BusSpec;
  hourlyRate?: number;
  fixedAirportPrice?: number;
  isAirportFixed?: boolean;
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

export interface BusSpec {
  id: string;
  name: string;
  model: string;
  capacity: string;
  capacityNum: number;
  ratePerKm: number;
  hourlyRate: number;
  fixedAirportPrice: number;
  image: string;
  desc: string;
}

export interface BusPriceDetail {
  driverPrice: number;
  clientPrice: number;
  hourlyRate: number;
  fixedAirportPrice: number;
  isAirportFixed: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'pending' | 'taken' | 'completed' | 'cancelled';
  takenBy?: {
    driverId: number | string;
    driverName: string;
    driverPhone: string;
    takenAt: string;
  };
  category: 'car' | 'bus';
  vehicleType: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  passengers: number;
  clientPrice: number;
  driverPrice: number;
  profit: number;
  client: {
    name: string;
    phone: string;
    email: string;
    flightNotes?: string;
    customNotes?: string;
  };
}

export interface Driver {
  telegramId: number;
  username?: string;
  fullName: string;
  phone: string;
  category: 'Standard' | 'Business' | 'Luxury' | 'Bus' | 'All';
  registeredAt: string;
}

export interface BusFormData {
  name: string;
  phone: string;
  email: string;
  customNotes: string;
}

export interface BusFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  customNotes?: string;
}
