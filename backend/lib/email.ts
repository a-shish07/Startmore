// lib/email.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM =
  process.env.EMAIL_FROM || "onboarding@resend.dev";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

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
              ${data.customerName}!
            </h2>

            <p>
              Your order has been successfully placed.
            </p>

            <p>
              We have received your order and will process it shortly.
            </p>

            <hr />

            <h3>
              Order #${data.orderId}
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
                          ${item.name}
                        </td>

                        <td align="center">
                          ${item.quantity}
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
  if (!ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is not configured");
  }

  return await resend.emails.send({
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
}

/* ==========================================
   ADMIN TEST EMAIL
========================================== */

export async function sendAdminTestEmail() {
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