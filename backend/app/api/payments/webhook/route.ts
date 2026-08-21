// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import stripe from "@/lib/stripe";
// import pool from "@/lib/db";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   console.log("🔥 WEBHOOK ROUTE CALLED");
//   const client = await pool.connect();

//   try {
//     // ==========================
//     // Read Raw Body
//     // ==========================

//     const body = await req.text();

//     const signature =
//       req.headers.get("stripe-signature");

//     if (!signature) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Missing Stripe Signature",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // ==========================
//     // Verify Webhook
//     // ==========================

//     const event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );

//     console.log(
//       "Stripe Event:",
//       event.type
//     );

//     // ==========================
//     // Payment Success
//     // ==========================

// if (event.type === "payment_intent.succeeded") {

//   console.log("✅ ENTERED payment_intent.succeeded");

//   const paymentIntent = event.data.object as Stripe.PaymentIntent;

//   console.log("Payment Intent ID:", paymentIntent.id);
//   console.log("Metadata:", paymentIntent.metadata);

//   const orderId = paymentIntent.metadata.order_id;

//   console.log("Order ID:", orderId);

//   if (!orderId) {
//     console.log("❌ order_id missing");
//     return NextResponse.json({ received: true });
//   }

//   const result = await client.query(
//     `
//     UPDATE orders
//     SET
//       payment_status='Paid',
//       order_status='Processing'
//     WHERE id=$1
//     RETURNING *
//     `,
//     [Number(orderId)]
//   );

//   console.log("Rows Updated:", result.rowCount);
//   console.log(result.rows);
// }

//     // ==========================
//     // Payment Failed
//     // ==========================

//     if (
//       event.type ===
//       "payment_intent.payment_failed"
//     ) {
//       const paymentIntent =
//         event.data.object as Stripe.PaymentIntent;

//       const orderId =
//         paymentIntent.metadata.order_id;

//       if (orderId) {
//         await client.query(
//           `
//           UPDATE orders
//           SET
//             payment_status = 'Failed'
//           WHERE id = $1
//           `,
//           [orderId]
//         );

//         console.log(
//           `Order ${orderId} marked Failed`
//         );
//       }
//     }

//     return NextResponse.json(
//       {
//         received: true,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {

//   console.error("================================");
//   console.error("WEBHOOK ERROR");
//   console.error(error);
//   console.error("================================");

//   return NextResponse.json(
//     {
//       success: false,
//       message: error instanceof Error ? error.message : "Webhook Failed",
//     },
//     {
//       status: 400,
//     }
//   );

// } finally {
//   client.release();
// }
// }


import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import pool from "@/lib/db";
import {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("🔥 WEBHOOK ROUTE CALLED");

  const client = await pool.connect();

  try {
    // ==========================
    // Read Raw Body
    // ==========================

    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Stripe Signature",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================
    // Verify Webhook
    // ==========================

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Stripe Event:", event.type);

    // ==================================================
    // PAYMENT SUCCESS
    // ==================================================

    if (event.type === "payment_intent.succeeded") {
      console.log("✅ ENTERED payment_intent.succeeded");

      const paymentIntent =
        event.data.object as Stripe.PaymentIntent;

      console.log(
        "Payment Intent ID:",
        paymentIntent.id
      );

      console.log(
        "Metadata:",
        paymentIntent.metadata
      );

      const orderId =
        paymentIntent.metadata.order_id;

      console.log("Order ID:", orderId);

      if (!orderId) {
        console.log("❌ order_id missing");

        return NextResponse.json({
          received: true,
        });
      }

      // ==================================================
      // MARK ORDER AS PAID
      // ==================================================

      const result = await client.query(
        `
        UPDATE orders
        SET
          payment_status = 'Paid',
          order_status = 'Processing'
        WHERE id = $1
          AND payment_status <> 'Paid'
        RETURNING *
        `,
        [Number(orderId)]
      );

      console.log(
        "Rows Updated:",
        result.rowCount
      );

      // ==================================================
      // IMPORTANT:
      // If 0 rows were updated, this webhook was already
      // processed.
      // ==================================================

      if (result.rowCount === 0) {
        console.log(
          `⚠️ Order ${orderId} already marked as Paid`
        );

        return NextResponse.json({
          received: true,
        });
      }

      // ==================================================
      // GET COMPLETE ORDER INFORMATION
      // ==================================================

      const orderResult = await client.query(
        `
        SELECT
          o.id,
          o.order_number,
          o.total,
          o.customer_email_sent,
          o.admin_email_sent,

          u.email AS customer_email,

          a.full_name AS customer_name

        FROM orders o

        INNER JOIN users u
          ON u.id = o.user_id

        INNER JOIN addresses a
          ON a.id = o.address_id

        WHERE o.id = $1
        `,
        [Number(orderId)]
      );

      if (orderResult.rows.length === 0) {
        throw new Error(
          `Order ${orderId} not found`
        );
      }

      const order = orderResult.rows[0];

      console.log(
        "Order Email Data:",
        order
      );

      // ==================================================
      // GET ORDER ITEMS
      // ==================================================

      const itemsResult = await client.query(
        `
        SELECT
          p.name,
          oi.quantity,
          oi.price

        FROM order_items oi

        INNER JOIN products p
          ON p.id = oi.product_id

        WHERE oi.order_id = $1

        ORDER BY oi.id
        `,
        [Number(orderId)]
      );

      const items = itemsResult.rows.map(
        (item) => ({
          name: item.name,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })
      );

      // ==================================================
      // PREPARE EMAIL DATA
      // ==================================================

      const emailData = {
        orderId: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        totalAmount: Number(order.total),
        items,
      };

      console.log(
        "📧 Email Data:",
        emailData
      );

      // ==================================================
      // SEND CUSTOMER EMAIL
      // ==================================================

      if (!order.customer_email_sent) {
        try {
          console.log(
            "📧 Sending customer order email..."
          );

          await sendCustomerOrderEmail(
            emailData
          );

          await client.query(
            `
            UPDATE orders
            SET customer_email_sent = TRUE
            WHERE id = $1
            `,
            [Number(orderId)]
          );

          console.log(
            "✅ Customer email sent"
          );
        } catch (emailError) {
          console.error(
            "❌ Customer email failed:",
            emailError
          );
        }
      } else {
        console.log(
          "ℹ️ Customer email already sent"
        );
      }

      // ==================================================
      // SEND ADMIN EMAIL
      // ==================================================

      if (!order.admin_email_sent) {
        try {
          console.log(
            "📧 Sending admin order email..."
          );

          await sendAdminOrderEmail(
            emailData
          );

          await client.query(
            `
            UPDATE orders
            SET admin_email_sent = TRUE
            WHERE id = $1
            `,
            [Number(orderId)]
          );

          console.log(
            "✅ Admin email sent"
          );
        } catch (emailError) {
          console.error(
            "❌ Admin email failed:",
            emailError
          );
        }
      } else {
        console.log(
          "ℹ️ Admin email already sent"
        );
      }

      console.log(
        `🎉 Order ${orderId} payment and email processing completed`
      );
    }

    // ==================================================
    // PAYMENT FAILED
    // ==================================================

    if (
      event.type ===
      "payment_intent.payment_failed"
    ) {
      console.log(
        "❌ ENTERED payment_intent.payment_failed"
      );

      const paymentIntent =
        event.data.object as Stripe.PaymentIntent;

      const orderId =
        paymentIntent.metadata.order_id;

      if (orderId) {
        await client.query(
          `
          UPDATE orders
          SET
            payment_status = 'Failed'
          WHERE id = $1
          `,
          [Number(orderId)]
        );

        console.log(
          `Order ${orderId} marked Failed`
        );
      }
    }

    // ==================================================
    // RETURN SUCCESS
    // ==================================================

    return NextResponse.json(
      {
        received: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "================================"
    );

    console.error("WEBHOOK ERROR");

    console.error(error);

    console.error(
      "================================"
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Webhook Failed",
      },
      {
        status: 400,
      }
    );
  } finally {
    client.release();
  }
}