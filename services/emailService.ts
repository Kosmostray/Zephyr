import 'dotenv/config';
import { OrderRecord } from '../bot/driverBot';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Zephyr Transfer <bookings@zephyrtransfer.com>';

/**
 * Generates an executive branded HTML email for booking confirmation
 */
export function generateOrderConfirmationHtml(order: OrderRecord): string {
  const notes = order.client.customNotes || order.client.flightNotes || '';
  const notesSection = notes
    ? `
      <tr>
        <td style="padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="font-size: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.45); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Flight / Special Notes</div>
          <div style="font-size: 13px; color: #ffffff; line-height: 20px; font-style: italic; background: rgba(255, 255, 255, 0.03); border-left: 2px solid #f0a500; padding: 10px 14px; border-radius: 0 8px 8px 0;">
            "${escapeHtml(notes)}"
          </div>
        </td>
      </tr>
    `
    : '';

  let paymentSection = '';
  if (order.payment?.type === 'deposit_30') {
    paymentSection = `
      <tr>
        <td style="padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #f0a500; text-transform: uppercase; margin-bottom: 8px;">
            PAYMENT STATUS · 30% PREPAYMENT
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 12px 16px; margin-bottom: 10px;">
            <tr>
              <td style="font-size: 13px; color: #10b981; font-weight: 600;">
                ✓ 30% Paid Online via Stripe:
              </td>
              <td align="right" style="font-size: 16px; font-weight: 700; color: #10b981; font-family: 'Courier New', monospace; white-space: nowrap;">
                €${Math.round(order.payment.amountPaid)}
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(240, 165, 0, 0.08); border: 1px solid rgba(240, 165, 0, 0.25); border-radius: 8px; padding: 12px 16px;">
            <tr>
              <td style="font-size: 13px; color: #f0a500; font-weight: 600;">
                💵 Remaining Balance to Chauffeur:
              </td>
              <td align="right" style="font-size: 16px; font-weight: 700; color: #f0a500; font-family: 'Courier New', monospace; white-space: nowrap;">
                €${Math.round(order.payment.remainingCash)}
              </td>
            </tr>
            <tr>
              <td colspan="2" style="font-size: 11px; color: rgba(255, 255, 255, 0.6); padding-top: 6px; line-height: 16px;">
                Payable in cash (EUR) directly to your chauffeur upon completion of the transfer.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  } else if (order.payment?.type === 'full') {
    paymentSection = `
      <tr>
        <td style="padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #10b981; text-transform: uppercase; margin-bottom: 8px;">
            PAYMENT STATUS · 100% FULL PREPAYMENT
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 12px 16px;">
            <tr>
              <td style="font-size: 13px; color: #10b981; font-weight: 600;">
                ✓ 100% Fully Paid Online via Stripe:
              </td>
              <td align="right" style="font-size: 16px; font-weight: 700; color: #10b981; font-family: 'Courier New', monospace; white-space: nowrap;">
                €${Math.round(order.payment.amountPaid)}
              </td>
            </tr>
            <tr>
              <td colspan="2" style="font-size: 11px; color: rgba(255, 255, 255, 0.65); padding-top: 6px; line-height: 16px;">
                Fully prepaid. Zero cash required on the day of transfer.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  const statusBadgeText = order.payment?.type === 'deposit_30'
    ? '30% Deposit Paid · Confirmed'
    : (order.payment?.type === 'full' ? '100% Paid Online · Confirmed' : 'Reservation Confirmed');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Zephyr Transfer</title>
  <style>
    @media only screen and (max-width: 680px) {
      .email-container {
        padding: 16px 8px !important;
      }
      .main-card {
        max-width: 100% !important;
        border-radius: 14px !important;
      }
      .mobile-pad {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .stack-col {
        display: block !important;
        width: 100% !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
        text-align: left !important;
        box-sizing: border-box !important;
      }
      .mobile-mt {
        margin-top: 10px !important;
        display: block !important;
      }
      .mobile-spec-row {
        margin-bottom: 12px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; -webkit-font-smoothing: antialiased;">
  <!-- Email Outer Container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color: #0d0d0d; width: 100%; margin: 0; padding: 32px 14px;">
    <tr>
      <td align="center">
        <!-- Main Card (780px max-width, +30% wider than 600px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="main-card" style="max-width: 780px; width: 100%; background-color: #161616; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.85);">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #d99400, #f0a500, #ffc83b, #f0a500, #d99400); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td class="mobile-pad" style="padding: 40px 44px 26px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: 700; letter-spacing: 7px; color: #f0a500; text-transform: uppercase; margin-bottom: 6px;">
                ZEPHYR
              </div>
              <div style="font-size: 11px; letter-spacing: 3.5px; color: rgba(255, 255, 255, 0.55); text-transform: uppercase; font-weight: 600;">
                Executive Chauffeur & Private Transfer
              </div>
            </td>
          </tr>

          <!-- Status Banner & Greeting -->
          <tr>
            <td class="mobile-pad" style="padding: 32px 44px 22px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(240, 165, 0, 0.08); border: 1px solid rgba(240, 165, 0, 0.25); border-radius: 12px; padding: 14px 18px; margin-bottom: 26px;">
                <tr>
                  <td class="stack-col" style="vertical-align: middle;">
                    <span style="display: inline-block; width: 9px; height: 9px; background-color: #10b981; border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
                    <span style="font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #f0a500; text-transform: uppercase; vertical-align: middle;">${statusBadgeText}</span>
                  </td>
                  <td class="stack-col" align="right" style="vertical-align: middle;">
                    <div class="mobile-mt">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 700; color: #ffffff; background: rgba(0,0,0,0.55); padding: 6px 14px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); letter-spacing: 1px;">
                        ${escapeHtml(order.id)}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 600; color: #ffffff; margin: 0 0 10px 0;">
                Dear ${escapeHtml(order.client.name || 'Valued Guest')},
              </h1>
              <p style="font-size: 14px; line-height: 23px; color: rgba(255, 255, 255, 0.72); margin: 0 0 22px 0;">
                Thank you for choosing Zephyr. Your private transfer has been successfully booked. Our dispatch team and assigned chauffeur are preparing for your journey.
              </p>
            </td>
          </tr>

          <!-- Itinerary Card -->
          <tr>
            <td class="mobile-pad" style="padding: 0 44px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #101010; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 26px;">
                
                <!-- Pickup -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #f0a500; text-transform: uppercase; margin-bottom: 4px;">
                      PICKUP LOCATION
                    </div>
                    <div style="font-size: 17px; font-weight: 700; color: #ffffff; line-height: 24px;">
                      📍 ${escapeHtml(order.from)}
                    </div>
                  </td>
                </tr>

                <!-- Direction Arrow -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <div style="font-size: 18px; color: #f0a500; font-weight: bold;">
                      ↓
                    </div>
                  </td>
                </tr>

                <!-- Destination -->
                <tr>
                  <td style="padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #f0a500; text-transform: uppercase; margin-bottom: 4px;">
                      DESTINATION
                    </div>
                    <div style="font-size: 17px; font-weight: 700; color: #ffffff; line-height: 24px;">
                      🏁 ${escapeHtml(order.to)}
                    </div>
                  </td>
                </tr>

                <!-- Key Specs Grid -->
                <tr>
                  <td style="padding-top: 20px; padding-bottom: 12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      
                      <!-- Vehicle Class on its own prominent full-width row to prevent broken lines -->
                      <tr>
                        <td colspan="3" style="padding-bottom: 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                          <div style="font-size: 10px; color: rgba(255, 255, 255, 0.45); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">VEHICLE CLASS</div>
                          <div style="font-size: 17px; font-weight: 700; color: #ffffff; margin-top: 5px; line-height: 24px;">
                            🚘 ${escapeHtml(order.vehicleType)}
                          </div>
                        </td>
                      </tr>

                      <!-- Specs row (3 columns on desktop, stacked cleanly on mobile) -->
                      <tr>
                        <td class="stack-col mobile-spec-row" width="36%" style="padding-top: 16px; padding-right: 14px; vertical-align: top;">
                          <div style="font-size: 10px; color: rgba(255, 255, 255, 0.45); text-transform: uppercase; letter-spacing: 1px;">Party & Luggage</div>
                          <div style="font-size: 14px; font-weight: 600; color: #ffffff; margin-top: 4px;">
                            👥 ${order.passengers} Pax &nbsp;·&nbsp; 🧳 ${order.luggage ?? 2} Bags
                          </div>
                        </td>

                        <td class="stack-col mobile-spec-row" width="36%" style="padding-top: 16px; padding-right: 14px; vertical-align: top;">
                          <div style="font-size: 10px; color: rgba(255, 255, 255, 0.45); text-transform: uppercase; letter-spacing: 1px;">Distance / Duration</div>
                          <div style="font-size: 14px; font-weight: 600; color: #ffffff; margin-top: 4px;">
                            📏 ${escapeHtml(order.distance)} (${escapeHtml(order.duration)})
                          </div>
                        </td>

                        <td class="stack-col mobile-spec-row" width="28%" style="padding-top: 16px; vertical-align: top;">
                          <div style="font-size: 10px; color: rgba(255, 255, 255, 0.45); text-transform: uppercase; letter-spacing: 1px;">Total Price</div>
                          <div style="font-size: 24px; font-weight: 700; color: #f0a500; margin-top: 2px;">
                            €${Math.round(order.clientPrice)}
                          </div>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>

                <!-- Notes Section if available -->
                ${notesSection}

                <!-- Payment Settlement Section -->
                ${paymentSection}

              </table>
            </td>
          </tr>

          <!-- Included Services Guarantee -->
          <tr>
            <td class="mobile-pad" style="padding: 0 44px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px;">
                <tr>
                  <td style="font-size: 12px; line-height: 20px; color: rgba(255, 255, 255, 0.55);">
                    <strong style="color: #ffffff; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Complimentary Premium Inclusions:</strong>
                    <ul style="margin: 8px 0 0 0; padding-left: 18px; color: rgba(255, 255, 255, 0.7);">
                      <li>Meet & Greet with personalized welcome nameboard</li>
                      <li>60 minutes complimentary wait time for flight arrivals</li>
                      <li>All motorway tolls, airport fees, fuel & premium bottled water</li>
                      <li>Direct communication with your personal chauffeur prior to arrival</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact / 24/7 Concierge Support Banner -->
          <tr>
            <td class="mobile-pad" style="padding: 26px 44px; background-color: #111111; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #f0a500; text-transform: uppercase; margin-bottom: 6px;">
                24/7 Chauffeur Concierge Desk
              </div>
              <p style="font-size: 13px; color: rgba(255, 255, 255, 0.65); margin: 0 0 16px 0;">
                To update your schedule, flight number, or request extra luggage assistance:
              </p>
              <div>
                <a href="tel:+390212345678" style="display: inline-block; padding: 11px 20px; margin: 4px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600;">
                  📞 +39 02 1234 5678
                </a>
                <a href="https://wa.me/393331234567" style="display: inline-block; padding: 11px 20px; margin: 4px; background: #25D366; border-radius: 8px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600;">
                  💬 WhatsApp Concierge
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="mobile-pad" style="padding: 24px 44px; text-align: center; font-size: 11px; color: rgba(255, 255, 255, 0.35); line-height: 18px; border-top: 1px solid rgba(255, 255, 255, 0.04);">
              © ${new Date().getFullYear()} Zephyr Executive Chauffeur. All rights reserved.<br>
              Milan • Malpensa • Linate • Bergamo • Lake Como • Courmayeur • Swiss Alps
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sends booking confirmation email via Resend API
 */
export async function sendBookingConfirmationEmail(
  order: OrderRecord
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Resend Email] RESEND_API_KEY is not configured in .env. Skipping email dispatch.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const toEmail = order.client?.email?.trim();
  if (!toEmail || !toEmail.includes('@')) {
    console.warn(`[Resend Email] Order ${order.id} has invalid or missing client email (${toEmail}).`);
    return { success: false, error: 'Invalid recipient email' };
  }

  try {
    const html = generateOrderConfirmationHtml(order);
    const subject = `Booking Confirmation: ${order.id} | Zephyr Chauffeur Service`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [toEmail],
        subject,
        html
      })
    });

    const data: any = await res.json();

    if (!res.ok) {
      console.error(`[Resend Email] Failed to send email for order ${order.id}:`, data);
      return { success: false, error: data?.message || 'Resend API error' };
    }

    console.log(`[Resend Email] Successfully sent confirmation email for order ${order.id} to ${toEmail}. Email ID: ${data?.id}`);
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error(`[Resend Email] Network error sending email for order ${order.id}:`, err);
    return { success: false, error: err.message };
  }
}
