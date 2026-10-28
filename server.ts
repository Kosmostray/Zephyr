import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import { 
  getOrders, 
  saveOrders, 
  broadcastOrder, 
  startBotPolling, 
  OrderRecord 
} from "./bot/driverBot";
import { sendBookingConfirmationEmail } from "./services/emailService";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any
});

const PENDING_ORDERS_FILE = path.join(__dirname, "data/pending_orders.json");

function getPendingOrders(): Record<string, OrderRecord> {
  try {
    if (!fs.existsSync(PENDING_ORDERS_FILE)) return {};
    const raw = fs.readFileSync(PENDING_ORDERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function savePendingOrders(orders: Record<string, OrderRecord>): void {
  try {
    const dir = path.dirname(PENDING_ORDERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PENDING_ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (e) {
    console.error("[Stripe] Error saving pending orders:", e);
  }
}

async function finalizePaidOrder(sessionId: string): Promise<{
  success: boolean;
  order?: OrderRecord;
  alreadyProcessed?: boolean;
  error?: string;
}> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" };
    }

    const orders = getOrders();
    const existing = orders.find(
      (o) => o.payment?.stripeSessionId === sessionId || o.id === session.metadata?.orderId
    );
    if (existing) {
      return { success: true, order: existing, alreadyProcessed: true };
    }

    const pendingOrders = getPendingOrders();
    let order = pendingOrders[sessionId];
    if (!order && session.metadata?.orderId) {
      order = Object.values(pendingOrders).find((o) => o.id === session.metadata?.orderId);
    }

    if (!order) {
      const meta = session.metadata || {};
      const amountPaid = (session.amount_total || 0) / 100;
      const orderId = meta.orderId || `ZEP-${Math.floor(100000 + Math.random() * 900000)}`;
      const clientPrice = Number(meta.clientPrice) || amountPaid;
      const paymentType = (meta.paymentOption as "deposit_30" | "full") || "deposit_30";
      const remainingCash = Number(meta.remainingCash) || 0;
      const driverPrice = Number(meta.driverPrice) || Math.round(clientPrice / 1.12);
      const luggage = Number(meta.luggage) || 2;

      order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        status: "pending",
        category: (meta.category as "car" | "bus") || "car",
        vehicleType: meta.vehicleType || "Executive Chauffeur",
        from: meta.from || "Milan",
        to: meta.to || "Destination",
        distance: meta.distance || "45 km",
        duration: meta.duration || "45 mins",
        passengers: Number(meta.passengers) || 1,
        luggage,
        clientPrice,
        driverPrice,
        profit: clientPrice - driverPrice,
        payment: {
          type: paymentType,
          amountPaid,
          remainingCash,
          stripeSessionId: sessionId,
          stripePaymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          paidAt: new Date().toISOString()
        },
        client: {
          name: session.customer_details?.name || meta.clientName || "Valued Guest",
          email: session.customer_details?.email || session.customer_email || meta.clientEmail || "",
          phone: session.customer_details?.phone || meta.clientPhone || "",
          flightNotes: meta.flightNotes,
          customNotes: meta.customNotes
        }
      };
    } else {
      order.payment = {
        type: (order.payment?.type as "deposit_30" | "full") || "deposit_30",
        amountPaid: (session.amount_total || 0) / 100,
        remainingCash: order.payment?.remainingCash || 0,
        stripeSessionId: sessionId,
        stripePaymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        paidAt: new Date().toISOString()
      };
    }

    // Save into active orders
    orders.unshift(order);
    saveOrders(orders);

    // Remove from pending
    delete pendingOrders[sessionId];
    if (session.metadata?.orderId) {
      for (const k in pendingOrders) {
        if (pendingOrders[k].id === session.metadata.orderId) delete pendingOrders[k];
      }
    }
    savePendingOrders(pendingOrders);

    console.log(
      `[Stripe Checkout] Order ${order.id} verified & paid (€${order.payment.amountPaid}). Dispatching notifications...`
    );

    // Broadcast to Telegram driver bot & driver group
    broadcastOrder(order).catch((err) => {
      console.warn("[Telegram Bot] Broadcast failed:", err);
    });

    // Send confirmation email to client via Resend
    sendBookingConfirmationEmail(order).catch((err) => {
      console.warn("[Resend Email] Dispatch failed:", err);
    });

    return { success: true, order, alreadyProcessed: false };
  } catch (e: any) {
    console.error("[Stripe Finalize Error]:", e);
    return { success: false, error: e.message };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to proxy Google Maps Distance Matrix API
  app.post("/api/distance", async (req, res) => {
    const { origin, destination, apiKey } = req.body;
    
    // The key should ideally be in process.env, but the user passed it in their request.
    // Given the architecture, I'll allow it passed but log a warning if it is not secure.
    // The prompt says "I'll put the API key in the UI" - I should move it to a server env var.
    
    const usedApiKey = process.env.GOOGLE_MAPS_API_KEY || apiKey;
    
    if (!usedApiKey) {
      return res.status(400).json({ error: "Missing API Key" });
    }

    const formatLocationQuery = (loc: string) => {
      if (!loc) return "";
      let s = loc.trim();
      const lower = s.toLowerCase();

      const translations: Record<string, string> = {
        // Italy Primary Hubs & Cities
        'мілан': 'Milan, Italy',
        'милан': 'Milan, Italy',
        'milan': 'Milan, Italy',
        'milano': 'Milan, Italy',
        'венеція': 'Venice, Italy',
        'венеция': 'Venice, Italy',
        'venice': 'Venice, Italy',
        'venezia': 'Venice, Italy',
        'рим': 'Rome, Italy',
        'rome': 'Rome, Italy',
        'roma': 'Rome, Italy',
        'флоренція': 'Florence, Italy',
        'флоренция': 'Florence, Italy',
        'florence': 'Florence, Italy',
        'firenze': 'Florence, Italy',
        'генуя': 'Genoa, Italy',
        'genoa': 'Genoa, Italy',
        'genova': 'Genoa, Italy',
        'турин': 'Turin, Italy',
        'turin': 'Turin, Italy',
        'torino': 'Turin, Italy',
        'болонья': 'Bologna, Italy',
        'bologna': 'Bologna, Italy',
        'верона': 'Verona, Italy',
        'verona': 'Verona, Italy',
        'неаполь': 'Naples, Italy',
        'naples': 'Naples, Italy',
        'napoli': 'Naples, Italy',
        'піза': 'Pisa, Italy',
        'пиза': 'Pisa, Italy',
        'pisa': 'Pisa, Italy',
        'сієна': 'Siena, Italy',
        'сиена': 'Siena, Italy',
        'siena': 'Siena, Italy',
        'мальпенса': 'Milan Malpensa Airport (MXP), Italy',
        'лінате': 'Milan Linate Airport (LIN), Italy',
        'ленате': 'Milan Linate Airport (LIN), Italy',
        'бергамо': 'Bergamo Airport (BGY), Italy',

        // Ambiguous Italian Spots (Prevents Google Maps picking wrong continents or centers)
        'bellagio': 'Bellagio, Lake Como, Italy',
        'белладжо': 'Bellagio, Lake Como, Italy',
        'белладжіо': 'Bellagio, Lake Como, Italy',
        'como': 'Lake Como, Italy',
        'комо': 'Lake Como, Italy',
        'озеро комо': 'Lake Como, Italy',
        'portofino': 'Portofino, Italy',
        'портофіно': 'Portofino, Italy',
        'портофино': 'Portofino, Italy',
        'sanremo': 'Sanremo, Italy',
        'san remo': 'Sanremo, Italy',
        'санремо': 'Sanremo, Italy',
        'сан-ремо': 'Sanremo, Italy',
        'сан ремо': 'Sanremo, Italy',
        'sirmione': 'Sirmione, Lake Garda, Italy',
        'сірміоне': 'Sirmione, Lake Garda, Italy',
        'сирмионе': 'Sirmione, Lake Garda, Italy',
        'amalfi': 'Amalfi, Italy',
        'амальфі': 'Amalfi, Italy',
        'positano': 'Positano, Italy',
        'позітано': 'Positano, Italy',
        'bormio': 'Bormio, Italy',
        'livigno': 'Livigno, Italy',

        // France & French Riviera (Nice, Cannes, etc. - stops 589 km fallback)
        'nice': 'Nice, France',
        'ніцца': 'Nice, France',
        'ницца': 'Nice, France',
        'nizza': 'Nice, France',
        'cannes': 'Cannes, France',
        'канни': 'Cannes, France',
        'канны': 'Cannes, France',
        'antibes': 'Antibes, France',
        'антіб': 'Antibes, France',
        'антиб': 'Antibes, France',
        'menton': 'Menton, France',
        'ментон': 'Menton, France',
        'ментона': 'Menton, France',
        'saint-tropez': 'Saint-Tropez, France',
        'saint tropez': 'Saint-Tropez, France',
        'st tropez': 'Saint-Tropez, France',
        'st. tropez': 'Saint-Tropez, France',
        'сен-тропе': 'Saint-Tropez, France',
        'сен тропе': 'Saint-Tropez, France',
        'chamonix': 'Chamonix, France',
        'шамоні': 'Chamonix, France',
        'шамони': 'Chamonix, France',
        'courchevel': 'Courchevel, France',
        'куршевель': 'Courchevel, France',
        'val d\'isere': 'Val-d\'Isère, France',
        'валь д\'ізер': 'Val-d\'Isère, France',
        'megeve': 'Megève, France',
        'межев': 'Megève, France',
        'paris': 'Paris, France',
        'париж': 'Paris, France',
        'lyon': 'Lyon, France',
        'ліон': 'Lyon, France',

        // Monaco & Monte Carlo
        'монако': 'Monaco',
        'monaco': 'Monaco',
        'монте карло': 'Monaco, Monte-Carlo',
        'монте-карло': 'Monaco, Monte-Carlo',
        'monte carlo': 'Monaco, Monte-Carlo',
        'monte-carlo': 'Monaco, Monte-Carlo',
        'principality of monaco': 'Monaco',

        // Switzerland
        'geneva': 'Geneva, Switzerland',
        'genève': 'Geneva, Switzerland',
        'genf': 'Geneva, Switzerland',
        'женева': 'Geneva, Switzerland',
        'zurich': 'Zurich, Switzerland',
        'zürich': 'Zurich, Switzerland',
        'цюрих': 'Zurich, Switzerland',
        'цюріх': 'Zurich, Switzerland',
        'lugano': 'Lugano, Switzerland',
        'лугано': 'Lugano, Switzerland',
        'basel': 'Basel, Switzerland',
        'базель': 'Basel, Switzerland',
        'bern': 'Bern, Switzerland',
        'берн': 'Bern, Switzerland',
        'lucerne': 'Lucerne, Switzerland',
        'luzern': 'Lucerne, Switzerland',
        'люцерн': 'Lucerne, Switzerland',
        'lausanne': 'Lausanne, Switzerland',
        'лозанна': 'Lausanne, Switzerland',
        'montreux': 'Montreux, Switzerland',
        'монтре': 'Montreux, Switzerland',
        'interlaken': 'Interlaken, Switzerland',
        'інтерлакен': 'Interlaken, Switzerland',
        'st moritz': 'St. Moritz, Switzerland',
        'st. moritz': 'St. Moritz, Switzerland',
        'sankt moritz': 'St. Moritz, Switzerland',
        'моріц': 'St. Moritz, Switzerland',
        'zermatt': 'Zermatt, Switzerland',
        'церматт': 'Zermatt, Switzerland',
        'champery': 'Champéry, Switzerland',
        'шампері': 'Champéry, Switzerland',
        'brig': 'Brig, Switzerland',
        'бриг': 'Brig, Switzerland',
        'бріг': 'Brig, Switzerland',
        'brig-glis': 'Brig, Switzerland',
        'visp': 'Visp, Switzerland',
        'фісп': 'Visp, Switzerland',
        'висп': 'Visp, Switzerland',
        'sion': 'Sion, Switzerland',
        'сьйон': 'Sion, Switzerland',
        'сион': 'Sion, Switzerland',
        'locarno': 'Locarno, Switzerland',
        'локарно': 'Locarno, Switzerland',
        'ascona': 'Ascona, Switzerland',
        'аскона': 'Ascona, Switzerland',
        'bellinzona': 'Bellinzona, Switzerland',
        'беллінцона': 'Bellinzona, Switzerland',
        'беллинцона': 'Bellinzona, Switzerland',
        'andermatt': 'Andermatt, Switzerland',
        'андерматт': 'Andermatt, Switzerland',
        'saas-fee': 'Saas-Fee, Switzerland',
        'саас-фе': 'Saas-Fee, Switzerland',

        // Austria
        'innsbruck': 'Innsbruck, Austria',
        'інсбрук': 'Innsbruck, Austria',
        'инсбрук': 'Innsbruck, Austria',
        'salzburg': 'Salzburg, Austria',
        'зальцбург': 'Salzburg, Austria',
        'vienna': 'Vienna, Austria',
        'wien': 'Vienna, Austria',
        'відень': 'Vienna, Austria',
        'kitzbuhel': 'Kitzbühel, Austria',
        'kitzbühel': 'Kitzbühel, Austria',
        'ischgl': 'Ischgl, Austria',
        'st anton': 'St. Anton am Arlberg, Austria',
        'solden': 'Sölden, Austria',
        'sölden': 'Sölden, Austria',

        // Germany
        'munich': 'Munich, Germany',
        'münchen': 'Munich, Germany',
        'мюнхен': 'Munich, Germany',
        'monaco di baviera': 'Munich, Germany',
        'frankfurt': 'Frankfurt, Germany',
        'stuttgart': 'Stuttgart, Germany'
      };

      if (translations[lower]) return translations[lower];

      // Pattern detection for Riviera / French destinations
      if (lower.includes('nice') || lower.includes('ніцц') || lower.includes('ницц') || lower.includes('nizza')) {
        return 'Nice, France';
      }
      if (lower.includes('cannes') || lower.includes('канн')) {
        return 'Cannes, France';
      }
      if (lower.includes('antibes') || lower.includes('антіб') || lower.includes('антиб')) {
        return 'Antibes, France';
      }
      if (lower.includes('menton') || lower.includes('ментон')) {
        return 'Menton, France';
      }
      if (lower.includes('tropez') || lower.includes('тропе')) {
        return 'Saint-Tropez, France';
      }
      if (lower.includes('monaco') || lower.includes('монако') || lower.includes('monte carlo') || lower.includes('монте-карло') || lower.includes('монте карло')) {
        return 'Monaco';
      }
      if (lower.includes('geneva') || lower.includes('женев') || lower.includes('genève')) {
        return 'Geneva, Switzerland';
      }
      if (lower.includes('zurich') || lower.includes('zürich') || lower.includes('цюрих') || lower.includes('цюріх')) {
        return 'Zurich, Switzerland';
      }
      if (lower.includes('brig') || lower.includes('бриг') || lower.includes('бріг')) {
        return 'Brig, Switzerland';
      }
      if (lower.includes('visp') || lower.includes('фісп') || lower.includes('висп')) {
        return 'Visp, Switzerland';
      }
      if (lower.includes('sion') || lower.includes('сьйон') || lower.includes('сион')) {
        return 'Sion, Switzerland';
      }
      if (lower.includes('locarno') || lower.includes('локарно')) {
        return 'Locarno, Switzerland';
      }
      if (lower.includes('ascona') || lower.includes('аскона')) {
        return 'Ascona, Switzerland';
      }
      if (lower.includes('bellinzona') || lower.includes('беллінцон') || lower.includes('беллинцон')) {
        return 'Bellinzona, Switzerland';
      }
      if (lower.includes('andermatt') || lower.includes('андерматт')) {
        return 'Andermatt, Switzerland';
      }
      if (lower.includes('bellagio') || lower.includes('белладж')) {
        return 'Bellagio, Lake Como, Italy';
      }

      const countries = ['italy', 'switzerland', 'austria', 'france', 'germany', 'monaco', 'італія', 'италия', 'франція', 'франция', 'швейцарія', 'швейцария', 'австрія', 'австрия'];
      if (!s.includes(',') && !countries.some(c => lower.includes(c))) {
        return `${s}, Italy`;
      }
      return s;
    };

    const o = formatLocationQuery(origin);
    const d = formatLocationQuery(destination);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(o)}&destinations=${encodeURIComponent(d)}&language=en&units=metric&key=${usedApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/orders: Retrieve all orders for Admin Portal
  app.get("/api/orders", (req, res) => {
    try {
      const orders = getOrders();
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ success: true, orders });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/create-checkout-session: Initialize Stripe Checkout for 30% prepayment or full payment
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const body = req.body;
      const orderId = body.id || `ZEP-${Math.floor(100000 + Math.random() * 900000)}`;
      const isBus = body.category === "bus" || body.isBus;
      const clientPrice = Number(body.clientPrice) || 0;
      let driverPrice = Number(body.driverPrice);
      if (!driverPrice || isNaN(driverPrice)) {
        driverPrice = Math.round(clientPrice / (isBus ? 1.13 : 1.12));
      }
      const profit = clientPrice - driverPrice;
      const paymentOption: "deposit_30" | "full" = body.paymentOption === "full" ? "full" : "deposit_30";
      const luggage = Number(body.luggage) || 2;

      const chargeAmount = paymentOption === "deposit_30"
        ? Math.round(clientPrice * 0.30)
        : Math.round(clientPrice);
      const remainingCash = clientPrice - chargeAmount;

      const origin = (req.headers.origin || req.headers.referer || process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

      const sessionTitle = paymentOption === "deposit_30"
        ? `Zephyr Transfer (30% Deposit) - ${body.from} to ${body.to}`
        : `Zephyr Transfer (Full Payment) - ${body.from} to ${body.to}`;

      const sessionDescription = paymentOption === "deposit_30"
        ? `Booking Ref: ${orderId} | Vehicle: ${body.vehicleType} | Balance €${remainingCash} cash to driver`
        : `Booking Ref: ${orderId} | Vehicle: ${body.vehicleType} | 100% Fully Prepaid`;

      const pendingOrder: OrderRecord = {
        id: orderId,
        createdAt: new Date().toISOString(),
        status: "pending",
        category: body.category || (body.isBus ? "bus" : "car"),
        vehicleType: body.vehicleType || "Executive Chauffeur",
        from: body.from || "Milan",
        to: body.to || "Destination",
        distance: body.distance || "45 km",
        duration: body.duration || "45 mins",
        passengers: Number(body.passengers) || 1,
        luggage,
        clientPrice,
        driverPrice,
        profit,
        payment: {
          type: paymentOption,
          amountPaid: chargeAmount,
          remainingCash,
          paidAt: ""
        },
        client: {
          name: body.client?.name || "",
          phone: body.client?.phone || "",
          email: body.client?.email || "",
          flightNotes: body.client?.flightNotes,
          customNotes: body.client?.customNotes
        }
      };

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: body.client?.email || undefined,
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: sessionTitle,
                description: sessionDescription
              },
              unit_amount: Math.max(1, chargeAmount) * 100
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: `${origin}/?booking_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?booking_cancelled=true`,
        metadata: {
          orderId,
          paymentOption,
          chargeAmount: String(chargeAmount),
          remainingCash: String(remainingCash),
          clientPrice: String(clientPrice),
          driverPrice: String(driverPrice),
          vehicleType: body.vehicleType || "Executive Chauffeur",
          category: body.category || (body.isBus ? "bus" : "car"),
          from: body.from || "Milan",
          to: body.to || "Destination",
          distance: body.distance || "45 km",
          duration: body.duration || "45 mins",
          passengers: String(body.passengers || 1),
          luggage: String(luggage),
          clientName: body.client?.name || "",
          clientEmail: body.client?.email || "",
          clientPhone: body.client?.phone || ""
        }
      } as any);

      const pendingOrders = getPendingOrders();
      pendingOrders[session.id] = pendingOrder;
      savePendingOrders(pendingOrders);

      console.log(`[Stripe Checkout] Created session ${session.id} for order ${orderId} (${paymentOption}, €${chargeAmount})`);

      res.json({ success: true, url: session.url, sessionId: session.id });
    } catch (e: any) {
      console.error("[Stripe Session Error]:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/verify-payment: Verify Stripe Checkout session and finalize order
  app.get("/api/verify-payment", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        return res.status(400).json({ error: "Missing session_id" });
      }

      const result = await finalizePaidOrder(sessionId);
      if (result.success) {
        res.json({ success: true, order: result.order });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/stripe-webhook: Webhook handler for Stripe payment events
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const event = req.body;
      if (event?.type === "checkout.session.completed") {
        const session = event.data?.object;
        if (session?.id) {
          await finalizePaidOrder(session.id);
        }
      }
      res.json({ received: true });
    } catch (e: any) {
      console.error("[Stripe Webhook Error]:", e);
      res.status(400).send(`Webhook Error: ${e.message}`);
    }
  });

  // POST /api/orders: Submit new booking from customer
  app.post("/api/orders", async (req, res) => {
    try {
      const body = req.body;
      const orders = getOrders();

      const orderId = body.id || `ZEP-${Math.floor(100000 + Math.random() * 900000)}`;
      const isBus = body.category === 'bus' || body.isBus;
      const clientPrice = Number(body.clientPrice) || 0;
      let driverPrice = Number(body.driverPrice);
      if (!driverPrice || isNaN(driverPrice)) {
        driverPrice = Math.round(clientPrice / (isBus ? 1.13 : 1.12));
      }
      const profit = Number(body.profit) || (clientPrice - driverPrice);

      const newOrder: OrderRecord = {
        id: orderId,
        createdAt: new Date().toISOString(),
        status: 'pending',
        category: body.category || (body.isBus ? 'bus' : 'car'),
        vehicleType: body.vehicleType || 'Executive Chauffeur',
        from: body.from || 'Milan',
        to: body.to || 'Destination',
        distance: body.distance || '45 km',
        duration: body.duration || '45 mins',
        passengers: Number(body.passengers) || 1,
        luggage: Number(body.luggage) || 2,
        clientPrice,
        driverPrice,
        profit,
        client: {
          name: body.client?.name || '',
          phone: body.client?.phone || '',
          email: body.client?.email || '',
          flightNotes: body.client?.flightNotes,
          customNotes: body.client?.customNotes
        }
      };

      orders.unshift(newOrder);
      saveOrders(orders);

      // Asynchronously broadcast to Telegram driver bot
      broadcastOrder(newOrder).catch((err) => {
        console.warn("[Bot] Broadcast failed:", err);
      });

      // Asynchronously send branded confirmation email via Resend
      sendBookingConfirmationEmail(newOrder).catch((err) => {
        console.warn("[Resend Email] Dispatch failed:", err);
      });

      res.status(201).json({ success: true, order: newOrder });
    } catch (e: any) {
      console.error("[Orders API] Error creating order:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // PATCH /api/orders/:id/status: Update order status from Admin Portal
  app.patch("/api/orders/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const orders = getOrders();
      const order = orders.find(o => o.id === id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      order.status = status;
      saveOrders(orders);
      res.json({ success: true, order });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // PATCH /api/orders/:id/take: Claim order
  app.patch("/api/orders/:id/take", (req, res) => {
    try {
      const { id } = req.params;
      const { driverName, driverPhone, driverId } = req.body;
      const orders = getOrders();
      const order = orders.find(o => o.id === id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.status !== 'pending') {
        return res.status(409).json({ 
          error: "Order already taken", 
          takenBy: order.takenBy?.driverName 
        });
      }

      order.status = 'taken';
      order.takenBy = {
        driverId: driverId || 'web_operator',
        driverName: driverName || 'Assigned Driver',
        driverPhone: driverPhone || '',
        takenAt: new Date().toISOString()
      };

      saveOrders(orders);
      res.json({ success: true, order });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/data/**', '**/bot/**', '**/*.json']
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Start Telegram bot polling runner
    startBotPolling().catch((err) => {
      console.warn("[Telegram Bot] Init failed:", err);
    });
  });
}

startServer();
