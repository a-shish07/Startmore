import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  let orderId: number | null = null;
  try {
    const body = await req.json();

    const {
      currency = "gbp",
      order_id,
    } = body;

    // ==========================
    // Validation
    // ==========================

    if (!order_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        {
          status: 400,
        }
      );
    }
    const orderResult = await pool.query(
      `SELECT total FROM orders WHERE id = $1`,
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    orderId = Number(order_id);

    const amount = Number(orderResult.rows[0].total);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount" },
        { status: 400 }
      );
    }
    // ==========================
    // Create Payment Intent
    // ==========================

const paymentIntent =
  await stripe.paymentIntents.create({
    amount: Math.round(Number(amount) * 100),
    currency,

    automatic_payment_methods: {
      enabled: true,
    },

    metadata: {
      order_id: String(order_id),
    },
  });

    // ==========================
    // Response
    // ==========================

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {

    console.error("Stripe Error:", error);

    if (orderId) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const items = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id=$1", [orderId]);
        for (const item of items.rows) await client.query("UPDATE products SET stock=stock+$1 WHERE id=$2", [item.quantity, item.product_id]);
        await client.query("DELETE FROM orders WHERE id=$1 AND payment_status='Pending'", [orderId]);
        await client.query("COMMIT");
      } catch (cleanupError) {
        await client.query("ROLLBACK");
        console.error("Could not clean up incomplete order:", cleanupError);
      } finally {
        client.release();
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create payment intent",
      },
      {
        status: 500,
      }
    );
  }
}
