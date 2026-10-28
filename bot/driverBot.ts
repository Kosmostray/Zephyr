import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');
const DRIVERS_FILE = path.join(__dirname, '../data/drivers.json');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''; // Optional group/channel chat ID

export interface DriverRecord {
  telegramId: number;
  username?: string;
  fullName: string;
  phone?: string;
  category: 'Standard' | 'Business' | 'Luxury' | 'Bus' | 'All';
  registeredAt: string;
}

export interface OrderPaymentInfo {
  type: 'deposit_30' | 'full';
  amountPaid: number;
  remainingCash: number;
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  paidAt?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: 'pending' | 'taken' | 'completed' | 'cancelled';
  takenBy?: {
    driverId: number | string;
    driverName: string;
    driverPhone?: string;
    takenAt: string;
  };
  category: 'car' | 'bus';
  vehicleType: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  passengers: number;
  luggage?: number;
  clientPrice: number;
  driverPrice: number;
  profit: number;
  payment?: OrderPaymentInfo;
  client: {
    name: string;
    phone: string;
    email: string;
    flightNotes?: string;
    customNotes?: string;
  };
}

// Helpers for reading & writing JSON files safely
export function getOrders(): OrderRecord[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[Bot] Error reading orders:', e);
    return [];
  }
}

export function saveOrders(orders: OrderRecord[]): void {
  try {
    const dir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Bot] Error saving orders:', e);
  }
}

export function getDrivers(): DriverRecord[] {
  try {
    if (!fs.existsSync(DRIVERS_FILE)) return [];
    const raw = fs.readFileSync(DRIVERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[Bot] Error reading drivers:', e);
    return [];
  }
}

export function saveDrivers(drivers: DriverRecord[]): void {
  try {
    const dir = path.dirname(DRIVERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DRIVERS_FILE, JSON.stringify(drivers, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Bot] Error saving drivers:', e);
  }
}

// Low-level Telegram API caller using Node 18+ native fetch
async function callTelegram(method: string, body: Record<string, any>): Promise<any> {
  if (!BOT_TOKEN) return null;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.ok && typeof data.description === 'string' && data.description.includes("can't parse entities") && body.parse_mode) {
      // Retry without markdown if user address or names contain characters that trip Telegram markdown
      const retryBody = { ...body };
      delete retryBody.parse_mode;
      const retryRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(retryBody)
      });
      return await retryRes.json();
    }
    return data;
  } catch (e) {
    console.error(`[Bot] Error calling Telegram ${method}:`, e);
    return null;
  }
}

// Check driver category eligibility
function isEligibleForOrder(driverCat: string, order: OrderRecord): boolean {
  if (driverCat === 'All') return true;
  if (order.category === 'bus') {
    return driverCat === 'Bus';
  }
  // Car hierarchy
  const orderType = order.vehicleType.toLowerCase();
  if (orderType.includes('luxury') || orderType.includes('first class')) {
    return driverCat === 'Luxury';
  }
  if (orderType.includes('business')) {
    return driverCat === 'Business' || driverCat === 'Luxury';
  }
  return true; // Standard order is eligible for any car driver
}

// Broadcast new order to matching drivers or group chat
export async function broadcastOrder(order: OrderRecord): Promise<void> {
  if (!BOT_TOKEN) {
    console.log(`[Bot Standby] Order ${order.id} saved. Bot token not configured yet; skipping Telegram broadcast.`);
    return;
  }

  let paymentText = '';
  if (order.payment?.type === 'deposit_30') {
    paymentText = 
      `💳 *Оплата:* Предоплата 30% через Stripe (${order.payment.amountPaid} €)\n` +
      `💵 *К получению с клиента:* *${order.payment.remainingCash} € наличными*\n`;
  } else if (order.payment?.type === 'full') {
    paymentText = 
      `💳 *Оплата:* 100% Онлайн через Stripe (Полная оплата)\n` +
      `💵 *С клиента наличными:* *0 € (Полная предоплата)*\n`;
  }

  const messageText = 
    `🚗 *НОВЫЙ ЗАКАЗ ZEPHYR / NEW ORDER*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 *Код:* \`${order.id}\`\n` +
    `📍 *Маршрут:* *${order.from}* ➔ *${order.to}*\n` +
    `📏 *Расстояние:* ${order.distance} (${order.duration})\n` +
    `👥 *Пассажиров:* ${order.passengers} pax\n` +
    `🧳 *Багаж:* ${order.luggage ?? 2} шт.\n` +
    `🚘 *Авто:* *${order.vehicleType}*\n` +
    `💰 *ОПЛАТА:* *${Math.round(order.driverPrice)} €*\n` +
    paymentText +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `⚡ Нажмите кнопку ниже, чтобы принять заказ. Первый водитель забирает!`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: `🚀 Взять заказ (${Math.round(order.driverPrice)} €)`,
          callback_data: `take_${order.id}`
        }
      ]
    ]
  };

  // 1. Send to public/driver group channel if configured
  if (CHAT_ID) {
    await callTelegram('sendMessage', {
      chat_id: CHAT_ID,
      text: messageText,
      parse_mode: 'Markdown',
      reply_markup: replyMarkup
    });
  }

  // 2. Send direct notification to all eligible registered drivers
  const drivers = getDrivers();
  for (const driver of drivers) {
    if (isEligibleForOrder(driver.category, order)) {
      await callTelegram('sendMessage', {
        chat_id: driver.telegramId,
        text: messageText,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup
      });
    }
  }
}

// Handle inline 'take_order' callback with atomic concurrency protection
async function handleTakeOrderCallback(callbackQuery: any): Promise<void> {
  const queryId = callbackQuery.id;
  const from = callbackQuery.from;
  const data = callbackQuery.data as string;
  const message = callbackQuery.message;

  const orderId = data.replace('take_', '');
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    await callTelegram('answerCallbackQuery', {
      callback_query_id: queryId,
      text: '❌ Заказ не найден в системе.',
      show_alert: true
    });
    return;
  }

  const order = orders[orderIndex];

  // Concurrency check: has it already been claimed?
  if (order.status !== 'pending') {
    await callTelegram('answerCallbackQuery', {
      callback_query_id: queryId,
      text: '❌ Заказ уже взят!',
      show_alert: true
    });

    // Update message to remove button
    if (message?.chat?.id && message?.message_id) {
      await callTelegram('editMessageText', {
        chat_id: message.chat.id,
        message_id: message.message_id,
        text: (message.text || '') + '\n\n⛔ *ЗАКАЗ УЖЕ ВЗЯТ*',
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [] }
      });
    }
    return;
  }

  // Claim order atomically
  const driverDisplayName = from.first_name + (from.last_name ? ` ${from.last_name}` : '') + (from.username ? ` (@${from.username})` : '');
  
  order.status = 'taken';
  order.takenBy = {
    driverId: from.id,
    driverName: driverDisplayName,
    takenAt: new Date().toISOString()
  };
  orders[orderIndex] = order;
  saveOrders(orders);

  // Edit original message to remove button and stamp status (without driver's name!)
  if (message?.chat?.id && message?.message_id) {
    await callTelegram('editMessageText', {
      chat_id: message.chat.id,
      message_id: message.message_id,
      text: (message.text || '') + '\n\n✅ *ЗАКАЗ ВЗЯТ*',
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [] }
    });
  }

  // Send direct message with full private customer contact details to winner
  const notes = order.client.customNotes || order.client.flightNotes || 'Нет дополнительных примечаний';
  let dmPaymentText = '';
  if (order.payment?.type === 'deposit_30') {
    dmPaymentText = 
      `💳 *Статус оплаты:* Предоплата 30% (${order.payment.amountPaid} € онлайн)\n` +
      `💵 *Взять с клиента наличными:* *${order.payment.remainingCash} €*\n`;
  } else if (order.payment?.type === 'full') {
    dmPaymentText = 
      `💳 *Статус оплаты:* 100% Онлайн оплачено (${order.payment.amountPaid} €)\n` +
      `💵 *С клиента наличными:* *0 € (Полная предоплата, не брать)*\n`;
  }

  const confirmationText = 
    `🎉 *ВЗЯТИЕ ЗАКАЗА ПОДТВЕРЖДЕНО!*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 *Код заказа:* \`${order.id}\`\n` +
    `📍 *Маршрут:* *${order.from}* ➔ *${order.to}*\n` +
    `👥 *Пассажиров:* ${order.passengers} pax | 🧳 *Багаж:* ${order.luggage ?? 2} шт.\n` +
    `🚘 *Авто:* ${order.vehicleType}\n` +
    `💰 *ОПЛАТА:* *${Math.round(order.driverPrice)} €*\n` +
    dmPaymentText +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *КЛИЕНТ:* ${order.client.name}\n` +
    `📞 *Телефон:* ${order.client.phone}\n` +
    `📧 *Email:* ${order.client.email}\n` +
    `📝 *Примечания / Рейс:* ${notes}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Хорошей поездки и отличного сервиса! 🌟`;

  const dmResult = await callTelegram('sendMessage', {
    chat_id: from.id,
    text: confirmationText,
    parse_mode: 'Markdown'
  });

  const sentPrivate = dmResult && dmResult.ok;

  // Answer callback query with informative alert
  await callTelegram('answerCallbackQuery', {
    callback_query_id: queryId,
    text: sentPrivate
      ? '🎉 Поздравляем! Вы успешно взяли этот заказ. Детали клиента отправлены вам в личные сообщения!'
      : '🎉 Поздравляем! Вы взяли заказ. Пожалуйста, откройте диалог с ботом @Legkovie_bot и нажмите /start, чтобы получить контакты клиента!',
    show_alert: true
  });
}

// Handle driver /start registration flow
async function handleStartCommand(chatId: number, from: any): Promise<void> {
  const drivers = getDrivers();
  const existing = drivers.find(d => d.telegramId === from.id);

  if (existing) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: 
        `👋 С возвращением, *${existing.fullName}*!\n\n` +
        `Ваша текущая категория: *${existing.category}*\n` +
        `Вы будете получать заказы для этого класса автомобилей.\n\n` +
        `Чтобы изменить категорию, нажмите одну из кнопок ниже:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚗 Standard', callback_data: 'cat_Standard' },
            { text: '💼 Business', callback_data: 'cat_Business' }
          ],
          [
            { text: '💎 Luxury', callback_data: 'cat_Luxury' },
            { text: '🚌 Bus / Coach', callback_data: 'cat_Bus' }
          ],
          [
            { text: '🌟 Все категории (All)', callback_data: 'cat_All' }
          ]
        ]
      }
    });
    return;
  }

  // Register driver with default All category, and prompt to pick
  const newDriver: DriverRecord = {
    telegramId: from.id,
    username: from.username,
    fullName: from.first_name + (from.last_name ? ` ${from.last_name}` : ''),
    category: 'All',
    registeredAt: new Date().toISOString()
  };
  drivers.push(newDriver);
  saveDrivers(drivers);

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text: 
      `👋 Добро пожаловать в партнерскую сеть водителей *Zephyr Executive Chauffeur*!\n\n` +
      `Вы успешно зарегистрированы в базе.\n` +
      `Пожалуйста, выберите вашу основную категорию авто:`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚗 Standard', callback_data: 'cat_Standard' },
          { text: '💼 Business', callback_data: 'cat_Business' }
        ],
        [
          { text: '💎 Luxury', callback_data: 'cat_Luxury' },
          { text: '🚌 Bus / Coach', callback_data: 'cat_Bus' }
        ],
        [
          { text: '🌟 Все категории (All)', callback_data: 'cat_All' }
        ]
      ]
    }
  });
}

// Handle category change callback
async function handleCategoryCallback(callbackQuery: any): Promise<void> {
  const queryId = callbackQuery.id;
  const from = callbackQuery.from;
  const data = callbackQuery.data as string;
  const category = data.replace('cat_', '') as DriverRecord['category'];

  const drivers = getDrivers();
  const driver = drivers.find(d => d.telegramId === from.id);
  if (driver) {
    driver.category = category;
    saveDrivers(drivers);
  }

  await callTelegram('answerCallbackQuery', {
    callback_query_id: queryId,
    text: `✅ Категория установлена: ${category}`
  });

  await callTelegram('sendMessage', {
    chat_id: from.id,
    text: `👍 Отлично! Ваша категория обновлена на: *${category}*. Ожидайте уведомлений о новых заказах!`
  });
}

// Long Polling Runner
export async function startBotPolling(): Promise<void> {
  if (!BOT_TOKEN) {
    console.log('----------------------------------------------------');
    console.log('[Telegram Bot] Ready & Waiting for TELEGRAM_BOT_TOKEN.');
    console.log('Add TELEGRAM_BOT_TOKEN=your_token to your .env to enable live driver notifications.');
    console.log('----------------------------------------------------');
    return;
  }

  console.log('[Telegram Bot] Connecting to Telegram API...');
  const me = await callTelegram('getMe', {});
  if (me && me.ok) {
    console.log(`[Telegram Bot] Connected successfully as @${me.result.username} (${me.result.first_name})`);
    if (CHAT_ID) {
      console.log(`[Telegram Bot] Configured driver group Chat ID: ${CHAT_ID}`);
    }
  } else {
    console.warn('[Telegram Bot] Warning: Unable to verify bot with Telegram API:', me);
  }

  let offset = 0;

  const poll = async () => {
    try {
      const res = await callTelegram('getUpdates', {
        offset,
        timeout: 20
      });

      if (res && res.ok && Array.isArray(res.result)) {
        for (const update of res.result) {
          offset = update.update_id + 1;

          // 1. Text commands
          if (update.message?.text) {
            const text = update.message.text.trim();
            const chatId = update.message.chat.id;
            const from = update.message.from;

            if (text.startsWith('/start')) {
              await handleStartCommand(chatId, from);
            }
          }

          // 2. Callback queries
          if (update.callback_query) {
            const data = update.callback_query.data;
            if (data?.startsWith('take_')) {
              await handleTakeOrderCallback(update.callback_query);
            } else if (data?.startsWith('cat_')) {
              await handleCategoryCallback(update.callback_query);
            }
          }
        }
      }
    } catch (e) {
      console.error('[Telegram Bot] Polling error:', e);
    }

    setTimeout(poll, 1000);
  };

  poll();
}

// Auto-start if executed directly from terminal
if (process.argv[1] && process.argv[1].endsWith('driverBot.ts')) {
  console.log('[Telegram Bot] Starting standalone driver bot service...');
  startBotPolling();
}
