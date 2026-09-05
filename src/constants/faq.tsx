import React from 'react';
import { Car, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

export const faqs: FAQItem[] = [
  {
    question: "Which vehicle model will I receive for my transfer?",
    answer: (
      <div className="space-y-3 text-white/80 leading-relaxed text-sm sm:text-base font-normal">
        <p>
          You choose your preferred vehicle category (such as <strong className="text-white">Business Sedan</strong>, <strong className="text-white">Luxury First Class</strong>, <strong className="text-white">Business Van</strong>, or <strong className="text-white">Minibus</strong>) during your initial calculation.
        </p>
        <p>
          Once our concierge confirms and dispatches your order, we send you a formal confirmation email containing your assigned chauffeur's contact number and the exact vehicle details, including make, model, color, and license plate.
        </p>
      </div>
    )
  },
  {
    question: "Do the chauffeurs speak fluent English?",
    answer: (
      <div className="space-y-3 text-white/80 leading-relaxed text-sm sm:text-base font-normal">
        <p>
          Yes. All Zephyr chauffeurs possess conversational English proficiency, fully sufficient for greeting you, assisting with luggage, and coordinating any route or schedule adjustments during your journey.
        </p>
        <p>
          Please note that our chauffeurs are dedicated executive drivers focused on discretion, safety, and punctual private transport rather than licensed tour guides. Historical storytelling or cultural sightseeing commentary is not included in transfer services.
        </p>
      </div>
    )
  },
  {
    question: "Is complimentary bottled water provided in the vehicle?",
    answer: (
      <div className="space-y-3 text-white/80 leading-relaxed text-sm sm:text-base font-normal">
        <p>
          Bottled water is not included by default in standard vehicle setups, but we are delighted to provide complimentary premium bottled water (still or sparkling) upon request.
        </p>
        <p>
          Simply add a note during booking or message our 24/7 concierge dispatch via WhatsApp prior to your pickup, and your chauffeur will have chilled refreshments ready in the cabin.
        </p>
      </div>
    )
  },
  {
    question: "How are transfers handled for water-bound destinations like Venice?",
    answer: (
      <div className="space-y-3 text-white/80 leading-relaxed text-sm sm:text-base font-normal">
        <p>
          For historical canal destinations like Venice Island, road vehicles cannot physically drive into the pedestrian historic center or to hotel doorsteps.
        </p>
        <p>
          Your chauffeur will escort you directly to <strong className="text-[#f0a500]">Piazzale Roma</strong> (or Tronchetto terminal), which is the furthest point accessible by motor vehicle. From Piazzale Roma, clients board private water taxis or public vaporetto boats to reach their hotel. Please note that boat transfers are arranged independently and are not part of our road transfer fee.
        </p>
      </div>
    )
  },
  {
    question: "How much luggage fits into each vehicle type?",
    answer: (
      <div className="space-y-3 text-white/80 leading-relaxed text-sm sm:text-base font-normal">
        <p>Luggage capacity depends on the selected vehicle class:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h5 className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
              <Car size={15} className="text-[#f0a500]" /> Sedans (Mercedes E-Class, BMW 5 Series)
            </h5>
            <p className="text-xs text-white/70">Up to 2 standard check-in suitcases + 2 carry-ons.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h5 className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
              <Car size={15} className="text-[#f0a500]" /> First Class (Mercedes S-Class)
            </h5>
            <p className="text-xs text-white/70">Up to 3 standard check-in suitcases + 2 carry-ons.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h5 className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
              <Car size={15} className="text-[#f0a500]" /> Executive Vans (Mercedes V-Class)
            </h5>
            <p className="text-xs text-white/70">Up to 7–8 large suitcases + carry-on bags and ski gear.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h5 className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
              <Car size={15} className="text-[#f0a500]" /> VIP Minibus (Mercedes Sprinter)
            </h5>
            <p className="text-xs text-white/70">10+ large suitcases + dedicated luggage compartment.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    question: "What is your cancellation and booking modification policy?",
    answer: (
      <div className="space-y-3 text-white/80 leading-relaxed text-sm sm:text-base font-normal">
        <p>
          We offer full flexibility for seamless alpine and corporate journeys:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1 text-xs sm:text-sm text-white/75">
          <li><strong className="text-white">Free cancellation</strong> up to 24 hours before your scheduled pickup time.</li>
          <li>Cancellations within 24 hours of pickup incur a 50% charge to compensate dispatched drivers.</li>
          <li>Schedule or pickup location modifications can be made without fee up to 12 hours prior to travel.</li>
        </ul>
      </div>
    )
  },
  {
    question: "How do airport pickups work and what if my flight is delayed?",
    answer: (
      <div className="space-y-3 text-white/80 leading-relaxed text-sm sm:text-base font-normal">
        <p>
          For airport pickups, our service includes a <strong className="text-[#f0a500]">Meet & Greet</strong> service directly inside the arrivals terminal:
        </p>
        <p>
          Your chauffeur will wait in the arrivals hall holding a personalized name board with your name or company logo. We include <strong className="text-white">60 minutes of complimentary waiting time</strong> from the moment your aircraft touches down.
        </p>
        <p>
          Don't worry if your flight is delayed — we track all arrival times via flight numbers. If you have any trouble finding your driver, you can contact us or call/WhatsApp your driver directly using the details sent to you in advance.
        </p>
      </div>
    )
  }
];
