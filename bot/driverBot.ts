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
    return await res.json();
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

  const messageText = 
    `🚗 *НОВЕ ЗАМОВЛЕННЯ ZEPHYR / NEW ORDER*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 *Код:* \`${order.id}\`\n` +
    `📍 *Маршрут:* *${order.from}* ➔ *${order.to}*\n` +
    `📏 *Відстань:* ${order.distance} (${order.duration})\n` +
    `👥 *Пасажирів:* ${order.passengers} pax\n` +
    `🚘 *Авто:* *${order.vehicleType}*\n` +
    `💰 *ОПЛАТА ВОДІЮ:* *${Math.round(order.driverPrice)} €*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `⚡ Натисніть кнопку нижче, щоб прийняти замовлення. Перший водій забирає!`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: `🚀 Взяти замовлення (${Math.round(order.driverPrice)} €)`,
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
      text: '❌ Замовлення не знайдено в системі.',
      show_alert: true
    });
    return;
  }

  const order = orders[orderIndex];

  // Concurrency check: has it already been claimed?
  if (order.status !== 'pending') {
    const takenByName = order.takenBy?.driverName || 'іншим водієм';
    await callTelegram('answerCallbackQuery', {
      callback_query_id: queryId,
      text: `❌ Замовлення вже зайнято (${takenByName})!`,
      show_alert: true
    });

    // Update message to remove button
    if (message?.chat?.id && message?.message_id) {
      await callTelegram('editMessageText', {
        chat_id: message.chat.id,
        message_id: message.message_id,
        text: (message.text || '') + `\n\n⛔ *ЗАМОВЛЕННЯ ВЖЕ ВЗЯТО* (${takenByName})`,
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

  // Notify driver of success
  await callTelegram('answerCallbackQuery', {
    callback_query_id: queryId,
    text: '🎉 Вітаємо! Ви успішно взяли це замовлення!',
    show_alert: true
  });

  // Edit original message to remove button and stamp winner
  if (message?.chat?.id && message?.message_id) {
    await callTelegram('editMessageText', {
      chat_id: message.chat.id,
      message_id: message.message_id,
      text: (message.text || '') + `\n\n✅ *ВЗЯТО ВОДІЄМ:* ${driverDisplayName}`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [] }
    });
  }

  // Send direct message with full private customer contact details to winner
  const notes = order.client.customNotes || order.client.flightNotes || 'Немає додаткових приміток';
  const confirmationText = 
    `🎉 *ВИТЯГ ЗАМОВЛЕННЯ ПІДТВЕРДЖЕНО!*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 *Код замовлення:* \`${order.id}\`\n` +
    `📍 *Маршрут:* *${order.from}* ➔ *${order.to}*\n` +
    `🚘 *Авто:* ${order.vehicleType}\n` +
    `💰 *Ваш дохід (Driver Price):* *${Math.round(order.driverPrice)} €*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *КЛІЄНТ:* ${order.client.name}\n` +
    `📞 *Телефон:* ${order.client.phone}\n` +
    `📧 *Email:* ${order.client.email}\n` +
    `📝 *Примітки / Рейс:* ${notes}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Гарної поїздки та відмінного сервісу! 🌟`;

  await callTelegram('sendMessage', {
    chat_id: from.id,
    text: confirmationText,
    parse_mode: 'Markdown'
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
        `👋 Вітаємо знову, *${existing.fullName}*!\n\n` +
        `Ваша поточна категорія: *${existing.category}*\n` +
        `Ви будете отримувати замовлення для цього класу автомобілів.\n\n` +
        `Щоб змінити категорію, натисніть одну з кнопок нижче:`,
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
            { text: '🌟 Всі категорії (All)', callback_data: 'cat_All' }
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
      `👋 Вітаємо у партнерській мережі водіїв *Zephyr Executive Chauffeur*!\n\n` +
      `Ви успішно зареєстровані в базі.\n` +
      `Будь ласка, оберіть вашу основну категорію авто:`,
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
          { text: '🌟 Всі категорії (All)', callback_data: 'cat_All' }
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
    text: `✅ Категорію встановлено: ${category}`
  });

  await callTelegram('sendMessage', {
    chat_id: from.id,
    text: `👍 Чудово! Вашу категорію оновлено до: *${category}*. Очікуйте на сповіщення про нові замовлення!`
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
