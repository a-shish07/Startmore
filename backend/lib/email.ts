// lib/email.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM =
  process.env.EMAIL_FROM || "onboarding@resend.dev";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function ensureEmailConfigured() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

const EMAIL_COLORS = {
  ink: "#211B18",
  muted: "#756B65",
  gold: "#B08A57",
  goldLight: "#E8D8BF",
  cream: "#F8F4EE",
  white: "#FFFFFF",
  line: "#E9E1D7",
};

function emailShell(content: string, preheader = "A message from SR Artémore") {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>SR Artémore</title>
      </head>
      <body style="margin:0;padding:0;background:${EMAIL_COLORS.cream};font-family:Arial,Helvetica,sans-serif;color:${EMAIL_COLORS.ink};">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EMAIL_COLORS.cream};">
          <tr>
            <td align="center" style="padding:28px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;background:${EMAIL_COLORS.white};">
                <tr><td style="height:4px;background:${EMAIL_COLORS.gold};font-size:0;">&nbsp;</td></tr>
                <tr>
                  <td style="padding:34px 38px 28px;text-align:center;border-bottom:1px solid ${EMAIL_COLORS.line};">
                    <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:5px;font-weight:600;color:${EMAIL_COLORS.ink};">SR ARTÉMORE</div>
                    <div style="margin-top:9px;font-size:10px;letter-spacing:2.5px;color:#A49A92;text-transform:uppercase;">Crafted with intention</div>
                  </td>
                </tr>
                <tr><td style="padding:0 38px 38px;">${content}</td></tr>
                <tr>
                  <td style="padding:26px 38px;background:${EMAIL_COLORS.ink};text-align:center;">
                    <div style="font-size:12px;letter-spacing:2.5px;color:${EMAIL_COLORS.goldLight};font-weight:700;">SR ARTÉMORE</div>
                    <div style="margin-top:9px;font-size:12px;line-height:1.7;color:#C8C0BA;">Thank you for choosing us.</div>
                    <div style="margin-top:12px;font-size:11px;color:#9E958F;">This is an automated email. Please keep it for your records.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}


export async function sendAbandonedCartEmail({ customerEmail, subject, message, items }: { customerEmail:string; subject:string; message:string; items:any[] }) {
  ensureEmailConfigured();

  const products = items.map((item) => `
    <tr>
      <td style="padding:15px 12px;border-bottom:1px solid ${EMAIL_COLORS.line};font-size:13px;line-height:1.45;color:${EMAIL_COLORS.ink};">
        <strong>${escapeHtml(String(item.product?.name || item.name || "Saved item"))}</strong>
      </td>
      <td align="center" style="padding:15px 8px;border-bottom:1px solid ${EMAIL_COLORS.line};font-size:13px;color:${EMAIL_COLORS.muted};">
        ${Number(item.quantity || 1)}
      </td>
    </tr>
  `).join("");

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: customerEmail,
    subject,
    html: emailShell(`
      <div style="padding:40px 0 8px;text-align:center;">
        <div style="display:inline-block;padding:7px 14px;border:1px solid ${EMAIL_COLORS.goldLight};border-radius:999px;background:#FBF8F3;color:${EMAIL_COLORS.gold};font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">
          A little reminder
        </div>
        <h1 style="margin:20px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:400;color:${EMAIL_COLORS.ink};">
          Your cart is waiting.
        </h1>
        <p style="margin:0;color:${EMAIL_COLORS.muted};font-size:15px;line-height:1.7;">
          ${escapeHtml(message)}
        </p>
      </div>

      <div style="margin:30px 0 24px;padding:22px;background:${EMAIL_COLORS.cream};border:1px solid ${EMAIL_COLORS.line};">
        <div style="font-size:9px;letter-spacing:1.8px;color:#9A8A79;text-transform:uppercase;font-weight:700;margin-bottom:12px;">
          Saved for you
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <th align="left" style="padding:0 12px 10px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#9A8E84;font-weight:700;">Item</th>
            <th align="center" style="padding:0 8px 10px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#9A8E84;font-weight:700;">Qty</th>
          </tr>
          ${products || `
            <tr><td colspan="2" style="padding:16px 12px;color:${EMAIL_COLORS.muted};font-size:13px;">Your saved items are still waiting for you.</td></tr>
          `}
        </table>
      </div>

      <div style="margin:0 0 28px;padding:24px;text-align:center;border:1px solid ${EMAIL_COLORS.line};background:#FFFCF8;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${EMAIL_COLORS.ink};">Beautiful pieces deserve a second look.</div>
        <div style="margin-top:8px;font-size:13px;line-height:1.7;color:${EMAIL_COLORS.muted};">
          Return whenever you're ready and continue where you left off.
        </div>
      </div>

      <div style="text-align:center;padding-bottom:8px;">
        <div style="display:inline-block;padding:14px 28px;background:${EMAIL_COLORS.ink};color:#FFFFFF;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
          We’ll be here when you’re ready
        </div>
      </div>
    `, "Your saved SR Artémore items are still waiting for you."),
  });

  if (result.error) throw new Error(result.error.message || "Resend rejected the reminder");
  return result;
}

export async function sendPasswordResetEmail({
  customerEmail,
  customerName,
  resetUrl,
}: {
  customerEmail: string;
  customerName?: string | null;
  resetUrl: string;
}) {
  ensureEmailConfigured();
  const greeting = customerName
    ? `Hello ${escapeHtml(customerName)},`
    : "Hello,";

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: customerEmail,
    subject: "SR Artémore — Reset your password",
    html: emailShell(`
      <div style="padding:42px 0 8px;text-align:center;">
        <div style="display:inline-block;padding:7px 14px;border:1px solid ${EMAIL_COLORS.goldLight};border-radius:999px;background:#FBF8F3;color:${EMAIL_COLORS.gold};font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">
          Account security
        </div>
        <h1 style="margin:20px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:400;color:${EMAIL_COLORS.ink};">
          Reset your password.
        </h1>
        <p style="margin:0;color:${EMAIL_COLORS.muted};font-size:15px;line-height:1.7;">
          ${greeting}<br />We’re here to help you get back into your account securely.
        </p>
      </div>

      <div style="margin:30px 0 24px;padding:26px 24px;background:${EMAIL_COLORS.cream};border:1px solid ${EMAIL_COLORS.line};text-align:center;">
        <div style="font-size:12px;line-height:1.8;color:${EMAIL_COLORS.muted};">
          We received a request to reset your SR Artémore password. Click the button below to choose a new password.
        </div>
        <div style="margin-top:24px;">
          <a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:14px 30px;background:${EMAIL_COLORS.ink};color:#FFFFFF;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
            Reset Password &nbsp;→
          </a>
        </div>
      </div>

      <div style="margin:0 0 24px;padding:18px 20px;border:1px solid ${EMAIL_COLORS.line};background:#FFFCF8;">
        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${EMAIL_COLORS.gold};font-weight:700;">Security notice</div>
        <div style="margin-top:8px;font-size:13px;line-height:1.7;color:${EMAIL_COLORS.muted};">
          This link expires in <strong style="color:${EMAIL_COLORS.ink};">30 minutes</strong> and can only be used once.
        </div>
      </div>

      <div style="padding:20px 0 8px;border-top:1px solid ${EMAIL_COLORS.line};text-align:center;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${EMAIL_COLORS.ink};">Didn't request a password reset?</div>
        <div style="margin-top:7px;font-size:12px;line-height:1.7;color:${EMAIL_COLORS.muted};">
          You can safely ignore this email. Your password will remain unchanged.
        </div>
      </div>
    `, "Securely reset your SR Artémore password."),
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send password reset email");
  }

  return result;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

/* ==========================================
   CUSTOMER ORDER EMAIL — PREMIUM
========================================== */


export async function sendCustomerOrderEmail(data: OrderEmailData) {
  ensureEmailConfigured();
  if (!data.customerEmail) throw new Error("Customer email is missing");

  const itemRows = data.items.map((item) => `
    <tr>
      <td style="padding:17px 14px;border-bottom:1px solid ${EMAIL_COLORS.line};font-size:14px;line-height:1.45;color:${EMAIL_COLORS.ink};">
        <strong>${escapeHtml(String(item.name))}</strong>
      </td>
      <td align="center" style="padding:17px 10px;border-bottom:1px solid ${EMAIL_COLORS.line};font-size:14px;color:${EMAIL_COLORS.muted};">
        ${Number(item.quantity)}
      </td>
      <td align="right" style="padding:17px 14px;border-bottom:1px solid ${EMAIL_COLORS.line};font-size:14px;font-weight:700;color:${EMAIL_COLORS.ink};">
        £${Number(item.price).toFixed(2)}
      </td>
    </tr>
  `).join("");

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: data.customerEmail,
    subject: `Order Confirmation #${data.orderId}`,
    html: emailShell(`
      <div style="padding:38px 0 0;text-align:center;">
        <div style="display:inline-block;padding:7px 14px;border:1px solid ${EMAIL_COLORS.goldLight};border-radius:999px;background:#FBF8F3;color:${EMAIL_COLORS.gold};font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">
          Order Confirmed
        </div>
        <h1 style="margin:20px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:400;color:${EMAIL_COLORS.ink};">
          Thank you for your order.
        </h1>
        <p style="margin:0;color:${EMAIL_COLORS.muted};font-size:15px;line-height:1.7;">
          ${escapeHtml(data.customerName || "There")}, your order has been received<br />
          and is now being prepared with care.
        </p>
      </div>

      <div style="margin:32px 0;padding:20px 22px;background:${EMAIL_COLORS.cream};border:1px solid ${EMAIL_COLORS.line};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <div style="font-size:9px;letter-spacing:1.8px;color:#9A8A79;text-transform:uppercase;">Order number</div>
              <div style="margin-top:6px;font-size:17px;font-weight:700;letter-spacing:.5px;">#${escapeHtml(String(data.orderId))}</div>
            </td>
            <td align="right">
              <div style="font-size:9px;letter-spacing:1.8px;color:#9A8A79;text-transform:uppercase;">Status</div>
              <div style="margin-top:6px;font-size:13px;font-weight:700;color:${EMAIL_COLORS.gold};">CONFIRMED</div>
            </td>
          </tr>
        </table>
      </div>

      <h2 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;">Your order</h2>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${EMAIL_COLORS.line};border-collapse:separate;border-spacing:0;">
        <thead>
          <tr style="background:#FBF9F6;">
            <th align="left" style="padding:12px 14px;font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#8C8075;border-bottom:1px solid ${EMAIL_COLORS.line};">Product</th>
            <th align="center" style="padding:12px 10px;font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#8C8075;border-bottom:1px solid ${EMAIL_COLORS.line};">Qty</th>
            <th align="right" style="padding:12px 14px;font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#8C8075;border-bottom:1px solid ${EMAIL_COLORS.line};">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
        <tr>
          <td style="padding:10px 0;color:${EMAIL_COLORS.muted};font-size:14px;">Order total</td>
          <td align="right" style="padding:10px 0;font-family:Georgia,'Times New Roman',serif;font-size:25px;font-weight:700;color:${EMAIL_COLORS.ink};">
            £${Number(data.totalAmount).toFixed(2)}
          </td>
        </tr>
      </table>

      <div style="margin:30px 0;padding:22px;background:${EMAIL_COLORS.ink};text-align:center;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${EMAIL_COLORS.goldLight};font-weight:700;">What happens next</div>
        <div style="margin-top:10px;font-family:Georgia,'Times New Roman',serif;font-size:19px;color:#FFFFFF;">We prepare. We pack. We deliver.</div>
        <div style="margin-top:8px;font-size:12px;line-height:1.7;color:#C9C2BC;">You’ll receive another email when your order is dispatched.</div>
      </div>

      <p style="margin:0;text-align:center;font-size:13px;line-height:1.7;color:${EMAIL_COLORS.muted};">
        Questions about your order? Simply reply to this email and our team will be happy to help.
      </p>
    `, `Your SR Artémore order #${data.orderId} has been confirmed.`),
  });

  if (result.error) throw new Error(result.error.message || "Failed to send customer email");
  return result;
}

export async function sendAdminOrderEmail(
  data: OrderEmailData
) {
  ensureEmailConfigured();
  if (!ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is not configured");
  }

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject: `New Order Received #${data.orderId}`,

    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>New Order Received</h2>

          <p>
            <strong>Order ID:</strong>
            ${data.orderId}
          </p>

          <p>
            <strong>Customer:</strong>
            ${data.customerName}
          </p>

          <p>
            <strong>Email:</strong>
            ${data.customerEmail}
          </p>

          <h3>Order Items</h3>

          <table
            border="1"
            cellpadding="8"
            cellspacing="0"
            width="100%"
          >
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              ${data.items
                .map(
                  (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>£${item.price}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>

          <h3>
            Total: £${data.totalAmount}
          </h3>

          <p>
            A new order has been placed on SR Artémore.
          </p>
        </body>
      </html>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send admin order email");
  }

  return result;
}

/* ==========================================
   ADMIN TEST EMAIL
========================================== */

export async function sendAdminTestEmail() {
  ensureEmailConfigured();
  if (!ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is not configured");
  }

  return await resend.emails.send({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject: "SR Artémore - Test Email",

    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>SR Artémore Email Test</h2>

          <p>
            This is a test email from your SR Artémore backend.
          </p>

          <p>
            Resend email integration is working successfully.
          </p>

          <p>
            <strong>Admin Email:</strong>
            ${ADMIN_EMAIL}
          </p>
        </body>
      </html>
    `,
  });
}

export async function sendContactEmails(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  ensureEmailConfigured();
  if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is not configured");

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone || "Not provided");
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message).replace(/\n/g, "<br />");

  const customerHtml = emailShell(`
    <div style="padding:40px 0 8px;text-align:center;">
      <div style="font-size:10px;letter-spacing:2px;color:${EMAIL_COLORS.gold};font-weight:700;text-transform:uppercase;">Message received</div>
      <h1 style="margin:16px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:400;">Thank you for reaching out.</h1>
      <p style="margin:0;color:${EMAIL_COLORS.muted};font-size:15px;line-height:1.7;">
        Hi ${name}, we’ve received your message and our team will get back to you within 24 hours.
      </p>
    </div>

    <div style="margin:30px 0;border:1px solid ${EMAIL_COLORS.line};background:#FFFCF8;">
      <div style="padding:14px 18px;border-bottom:1px solid ${EMAIL_COLORS.line};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#95887C;font-weight:700;">Your message</div>
      <div style="padding:22px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.35;color:${EMAIL_COLORS.ink};">${subject}</div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid ${EMAIL_COLORS.line};font-size:14px;line-height:1.8;color:${EMAIL_COLORS.muted};">${message}</div>
      </div>
    </div>

    <div style="margin:0 0 28px;padding:20px;background:${EMAIL_COLORS.cream};border:1px solid ${EMAIL_COLORS.line};text-align:center;">
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#9A8E84;">Response time</div>
      <div style="margin-top:7px;font-size:14px;font-weight:700;">Within 24 hours</div>
    </div>

    <div style="padding-top:24px;border-top:1px solid ${EMAIL_COLORS.line};text-align:center;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;">We look forward to speaking with you.</div>
      <div style="margin-top:7px;font-size:12px;color:${EMAIL_COLORS.muted};">Warmly, the SR Artémore team</div>
    </div>
  `, "We received your message and will reply within 24 hours.");

  const adminHtml = emailShell(`
    <div style="padding:30px 0 8px;">
      <div style="font-size:10px;letter-spacing:2px;color:${EMAIL_COLORS.gold};font-weight:700;text-transform:uppercase;">New contact enquiry</div>
      <h1 style="margin:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:400;">${subject}</h1>
    </div>

    <div style="margin:26px 0;padding:20px;background:${EMAIL_COLORS.cream};border:1px solid ${EMAIL_COLORS.line};">
      <p style="margin:0 0 9px;font-size:13px;"><strong>Name:</strong> ${name}</p>
      <p style="margin:0 0 9px;font-size:13px;"><strong>Email:</strong> ${email}</p>
      <p style="margin:0;font-size:13px;"><strong>Phone:</strong> ${phone}</p>
    </div>

    <div style="padding:20px;border-left:3px solid ${EMAIL_COLORS.gold};background:#FFFCF8;font-size:14px;line-height:1.8;">
      ${message}
    </div>
  `, "New SR Artémore contact enquiry.");

  const [customer, admin] = await Promise.all([
    resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: "We received your message — SR Artémore",
      html: customerHtml,
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `Contact enquiry: ${data.subject}`,
      html: adminHtml,
    }),
  ]);

  if (customer.error) throw new Error(customer.error.message || "Could not send customer confirmation");
  if (admin.error) throw new Error(admin.error.message || "Could not notify the admin");
  return { customer, admin };
}

export async function sendTrackingEmail(data: {
  customerEmail: string;
  customerName?: string | null;
  orderNumber: string;
  courier: string;
  trackingNumber: string;
  trackingUrl?: string | null;
  note?: string | null;
}) {
  ensureEmailConfigured();

  const customerName = escapeHtml(data.customerName || "there");
  const courier = escapeHtml(data.courier);
  const trackingNumber = escapeHtml(data.trackingNumber);
  const orderNumber = escapeHtml(data.orderNumber);

  const trackingLink = data.trackingUrl
    ? `<div style="margin:28px 0;text-align:center;">
         <a href="${escapeHtml(data.trackingUrl)}" style="display:inline-block;padding:14px 28px;background:${EMAIL_COLORS.ink};color:#FFFFFF;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">Track Your Delivery</a>
       </div>`
    : "";

  const note = data.note
    ? escapeHtml(data.note)
    : "Tracking information may take a little time to appear after the carrier scans your parcel.";

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: data.customerEmail,
    subject: `Your SR Artémore order ${data.orderNumber} is on its way`,
    html: emailShell(`
      <div style="padding:38px 0 8px;text-align:center;">
        <div style="font-size:10px;letter-spacing:2px;color:${EMAIL_COLORS.gold};font-weight:700;text-transform:uppercase;">Delivery update</div>
        <h1 style="margin:16px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:400;">Your order is on its way.</h1>
        <p style="margin:0;color:${EMAIL_COLORS.muted};font-size:15px;line-height:1.7;">
          Hi ${customerName}, your order <strong>${orderNumber}</strong> has been handed to ${courier}.
        </p>
      </div>

      <div style="margin:30px 0 24px;padding:24px;background:${EMAIL_COLORS.ink};text-align:center;">
        <div style="font-size:9px;letter-spacing:2px;color:${EMAIL_COLORS.goldLight};text-transform:uppercase;font-weight:700;">Tracking number</div>
        <div style="margin-top:10px;font-size:23px;line-height:1.3;font-weight:700;letter-spacing:1px;color:#FFFFFF;word-break:break-word;">${trackingNumber}</div>
        <div style="margin-top:12px;font-size:12px;color:#C8C0BA;">Delivered by <strong style="color:#FFFFFF;">${courier}</strong></div>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
        <tr>
          <td align="center" width="25%">
            <div style="width:26px;height:26px;margin:auto;border-radius:50%;background:${EMAIL_COLORS.gold};color:#FFFFFF;font-size:13px;line-height:26px;font-weight:700;">✓</div>
            <div style="margin-top:8px;font-size:9px;letter-spacing:.7px;text-transform:uppercase;color:${EMAIL_COLORS.gold};font-weight:700;">Confirmed</div>
          </td>
          <td width="25%" style="height:1px;background:${EMAIL_COLORS.gold};font-size:0;">&nbsp;</td>
          <td align="center" width="25%">
            <div style="width:26px;height:26px;margin:auto;border-radius:50%;background:${EMAIL_COLORS.gold};color:#FFFFFF;font-size:13px;line-height:26px;font-weight:700;">✓</div>
            <div style="margin-top:8px;font-size:9px;letter-spacing:.7px;text-transform:uppercase;color:${EMAIL_COLORS.gold};font-weight:700;">Packed</div>
          </td>
          <td width="25%" style="height:1px;background:${EMAIL_COLORS.gold};font-size:0;">&nbsp;</td>
          <td align="center" width="25%">
            <div style="width:26px;height:26px;margin:auto;border-radius:50%;background:${EMAIL_COLORS.gold};color:#FFFFFF;font-size:13px;line-height:26px;font-weight:700;">→</div>
            <div style="margin-top:8px;font-size:9px;letter-spacing:.7px;text-transform:uppercase;color:${EMAIL_COLORS.gold};font-weight:700;">Dispatched</div>
          </td>
        </tr>
      </table>

      ${trackingLink}

      <div style="margin:26px 0;padding:18px 20px;background:${EMAIL_COLORS.cream};border:1px solid ${EMAIL_COLORS.line};">
        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#9A8E84;font-weight:700;">A little note</div>
        <div style="margin-top:7px;font-size:13px;line-height:1.7;color:${EMAIL_COLORS.muted};">${note}</div>
      </div>

      <p style="margin:0;text-align:center;font-size:13px;line-height:1.7;color:${EMAIL_COLORS.muted};">
        Thank you for choosing SR Artémore. We hope your order arrives beautifully.
      </p>
    `, `Your SR Artémore order ${data.orderNumber} has been dispatched.`),
  });

  if (result.error) throw new Error(result.error.message || "Failed to send tracking email");
  return result;
}
