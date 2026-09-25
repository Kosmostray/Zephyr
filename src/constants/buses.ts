import { BusSpec } from '../types';

export const busFleet: BusSpec[] = [
  {
    id: "iveco-9pax",
    name: "Iveco Minibus",
    model: "Iveco Daily VIP",
    capacity: "9+1 pax",
    capacityNum: 10,
    ratePerKm: 1.35,
    hourlyRate: 70,
    fixedAirportPrice: 220,
    image: "./buses/fleet_garage.jpg",
    desc: "Comfortable touring minibus for small delegations & team transfers."
  },
  {
    id: "ford-12pax",
    name: "Ford Transit",
    model: "Ford Transit Executive",
    capacity: "12+1 pax",
    capacityNum: 13,
    ratePerKm: 1.50,
    hourlyRate: 80,
    fixedAirportPrice: 220,
    image: "./buses/fleet_garage.jpg",
    desc: "Spacious passenger van ideal for medium groups & airport transfers."
  },
  {
    id: "sprinter-16pax",
    name: "Mercedes-Benz Sprinter",
    model: "Mercedes Sprinter VIP Mercus",
    capacity: "16+1 pax",
    capacityNum: 17,
    ratePerKm: 1.60,
    hourlyRate: 80,
    fixedAirportPrice: 220,
    image: "./buses/sprinter_16pax.jpg",
    desc: "Luxury coach-style leather seating, climate control & supreme comfort."
  },
  {
    id: "coach-55pax-2d",
    name: "Autobus Coach 55",
    model: "Grand Tourism Coach",
    capacity: "55 pax + 2 drivers",
    capacityNum: 57,
    ratePerKm: 2.50,
    hourlyRate: 110,
    fixedAirportPrice: 450,
    image: "./buses/coach_55pax.jpg",
    desc: "Full-size grand tourism luxury coach for large tour groups & delegations."
  },
  {
    id: "volvo-55pax-1d",
    name: "Volvo Coach 55",
    model: "Volvo 9700 Luxury Coach",
    capacity: "55 pax + 1 driver",
    capacityNum: 56,
    ratePerKm: 2.50,
    hourlyRate: 110,
    fixedAirportPrice: 450,
    image: "./buses/coach_55pax.jpg",
    desc: "Elite Scandinavian engineering, reclining seats & panoramic comfort."
  }
];

export const isAirportTransfer = (from: string, to: string): boolean => {
  const f = from.toLowerCase();
  const t = to.toLowerCase();
  const airports = ["malpensa", "mxp", "linate", "lin", "bergamo", "bgy", "aeroporto", "airport"];
  const isMilan = (s: string) => s.includes("milan") || s.includes("мілан") || s.includes("милан");
  const isAirport = (s: string) => airports.some(a => s.includes(a));

  return (isMilan(f) && isAirport(t)) || (isAirport(f) && isMilan(t));
};

export const calculateBusPrice = (
  bus: BusSpec,
  from: string,
  to: string,
  distanceKm: number
): { driverPrice: number; clientPrice: number; isAirportFixed: boolean } => {
  if (isAirportTransfer(from, to)) {
    const driverPrice = bus.fixedAirportPrice;
    const clientPrice = Math.round(driverPrice * 1.15);
    return { driverPrice, clientPrice, isAirportFixed: true };
  }

  // Minimum charge equals the fixed airport price
  const baseCalc = Math.round(distanceKm * 2 * bus.ratePerKm);
  const driverPrice = Math.max(bus.fixedAirportPrice, baseCalc);
  const clientPrice = Math.round(driverPrice * 1.15);

  return { driverPrice, clientPrice, isAirportFixed: false };
};
