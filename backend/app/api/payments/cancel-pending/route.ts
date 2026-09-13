import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();
    if (typeof paymentIntentId !== "string" || !paymentIntentId.startsWith("pi_")) return NextResponse.json({ success: false, message: "Invalid payment reference." }, { status: 400 });
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const orderId = Number(intent.metadata.order_id);
    if (!Number.isInteger(orderId)) return NextResponse.json({ success: false, message: "Payment order is invalid." }, { status: 400 });
    if (intent.status === "succeeded") return NextResponse.json({ success: false, message: "A successful payment cannot be cancelled." }, { status: 409 });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const items = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id=$1", [orderId]);
      for (const item of items.rows) await client.query("UPDATE products SET stock=stock+$1 WHERE id=$2", [item.quantity, item.product_id]);
      await client.query("DELETE FROM orders WHERE id=$1 AND payment_status='Pending'", [orderId]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pending payment cleanup failed:", error);
    return NextResponse.json({ success: false, message: "Could not remove the incomplete order." }, { status: 500 });
  }
}
