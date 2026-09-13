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

export async function sendAbandonedCartEmail({ customerEmail, subject, message, items }: { customerEmail:string; subject:string; message:string; items:any[] }) {
  ensureEmailConfigured();
  const products = items.map((item) => `<li>${escapeHtml(String(item.product?.name || item.name || "Saved item"))} × ${Number(item.quantity || 1)}</li>`).join("");
  const result = await resend.emails.send({ from: EMAIL_FROM, to: customerEmail, subject, html:`<div style="max-width:600px;margin:auto;padding:32px;background:#fffaf6;color:#2b2530;font-family:Arial,sans-serif"><p style="letter-spacing:1px;color:#5b537f;font-size:12px">SR ARTÉMORE</p><h1 style="font-size:26px">Your cart is waiting</h1><p>${escapeHtml(message)}</p><h3>Saved items</h3><ul>${products}</ul><p style="margin-top:28px">Return to SR Artémore whenever you are ready.</p></div>` });
  if (result.error) throw new Error(result.error.message || "Resend rejected the reminder"); return result;
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
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin:0;padding:0;background:#f7f3f5;font-family:Arial,Helvetica,sans-serif;color:#28191f;">
          <div style="max-width:600px;margin:32px auto;background:#fff;padding:40px;border-radius:16px;">
            <p style="margin:0 0 28px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#8b5a70;">SR Artémore</p>
            <h1 style="margin:0 0 20px;font-size:28px;font-weight:600;">Reset your password</h1>
            <p style="line-height:1.6;">${greeting}</p>
            <p style="line-height:1.6;">We received a request to reset your password. Use the button below to choose a new one.</p>
            <p style="margin:32px 0;"><a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#28191f;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a></p>
            <p style="line-height:1.6;color:#66555c;">This link expires in 30 minutes and can only be used once. If you did not request a reset, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `,
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
   CUSTOMER ORDER EMAIL
========================================== */

export async function sendCustomerOrderEmail(
  data: OrderEmailData
) {
  ensureEmailConfigured();
  if (!data.customerEmail) {
    throw new Error("Customer email is missing");
  }

  console.log("📧 Sending customer order email");
  console.log("Customer email:", data.customerEmail);
  console.log("Order ID:", data.orderId);

  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: data.customerEmail,
    subject: `Order Confirmation #${data.orderId}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <title>Order Confirmation</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 650px;
              margin: 30px auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 8px;
            "
          >

            <h2>
              Thank you for your order,
              ${escapeHtml(data.customerName || "there")}!
            </h2>

            <p>
              Your order has been successfully placed.
            </p>

            <p>
              We have received your order and will process it shortly.
            </p>

            <hr />

            <h3>
              Order #${escapeHtml(String(data.orderId))}
            </h3>

            <table
              width="100%"
              border="1"
              cellpadding="10"
              cellspacing="0"
              style="border-collapse: collapse;"
            >
              <thead>
                <tr>
                  <th align="left">Product</th>
                  <th align="center">Quantity</th>
                  <th align="right">Price</th>
                </tr>
              </thead>

              <tbody>
                ${data.items
                  .map(
                    (item) => `
                      <tr>
                        <td>
                          ${escapeHtml(String(item.name))}
                        </td>

                        <td align="center">
                          ${Number(item.quantity)}
                        </td>

                        <td align="right">
                          £${Number(item.price).toFixed(2)}
                        </td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>

            <div
              style="
                margin-top: 20px;
                text-align: right;
              "
            >
              <h3>
                Total: £${Number(data.totalAmount).toFixed(2)}
              </h3>
            </div>

            <hr />

            <p>
              Thank you for shopping with
              <strong>SR Artémore</strong>.
            </p>

            <p>
              If you have any questions about your order,
              please contact our support team.
            </p>

          </div>
        </body>
      </html>
    `,
  });

  console.log(
    "📧 Customer email Resend result:",
    result
  );

  if (result.error) {
    throw new Error(
      result.error.message || "Failed to send customer email"
    );
  }

  console.log(
    "✅ Customer order email sent successfully"
  );

  return result;
}

/* ==========================================
   ADMIN ORDER EMAIL
========================================== */

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

  const [customer, admin] = await Promise.all([
    resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: "We received your message — SR Artémore",
      html: `<main style="max-width:600px;margin:32px auto;padding:40px;background:#fffdf9;color:#261d1b;font-family:Arial,sans-serif"><p style="letter-spacing:2px;font-size:12px;color:#9a7651">SR ARTÉMORE</p><h1 style="font-size:28px">Thank you for getting in touch.</h1><p>Hi ${name}, we have received your message and will reply within 24 hours.</p><div style="margin:28px 0;padding:18px;border-left:3px solid #b28a5d;background:#faf5ed"><strong>${subject}</strong><p style="margin-bottom:0;line-height:1.6">${message}</p></div><p>Warmly,<br />SR Artémore</p></main>`,
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `Contact enquiry: ${data.subject}`,
      html: `<main style="max-width:600px;margin:32px auto;padding:32px;background:#fff;color:#261d1b;font-family:Arial,sans-serif"><p style="letter-spacing:2px;font-size:12px;color:#9a7651">SR ARTÉMORE · CONTACT ENQUIRY</p><h1 style="font-size:24px">${subject}</h1><p><strong>From:</strong> ${name} (${email})<br /><strong>Phone:</strong> ${phone}</p><div style="padding:18px;background:#faf5ed;line-height:1.6">${message}</div></main>`,
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
  const note = data.note ? `<p style="line-height:1.6">${escapeHtml(data.note)}</p>` : "";
  const trackingLink = data.trackingUrl
    ? `<p style="margin:28px 0"><a href="${escapeHtml(data.trackingUrl)}" style="display:inline-block;background:#261d1b;color:#fff;padding:14px 22px;border-radius:6px;text-decoration:none;font-weight:700">Track your delivery</a></p>`
    : "";
  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to: data.customerEmail,
    subject: `Your SR Artémore order ${data.orderNumber} is on its way`,
    html: `<main style="max-width:600px;margin:32px auto;padding:40px;background:#fffdf9;color:#261d1b;font-family:Arial,sans-serif"><p style="letter-spacing:2px;font-size:12px;color:#9a7651">SR ARTÉMORE · DELIVERY UPDATE</p><h1 style="font-size:28px">Your order is on its way.</h1><p>Hi ${customerName}, your order <strong>${orderNumber}</strong> has been handed to ${courier}.</p><div style="margin:28px 0;padding:22px;border:1px solid #e7dacb;border-radius:10px;background:#fff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;color:#806042">TRACKING NUMBER</p><p style="margin:0;font-size:20px;font-weight:700;letter-spacing:1px">${trackingNumber}</p><p style="margin:16px 0 0;color:#665b54">Delivery partner: <strong>${courier}</strong></p></div>${trackingLink}${note}<p style="color:#665b54;line-height:1.6">If the tracking page has not updated yet, please allow the carrier a little time to scan the parcel.</p></main>`,
  });
  if (result.error) throw new Error(result.error.message || "Failed to send tracking email");
  return result;
}
