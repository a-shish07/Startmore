import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import pool from "@/lib/db";
import { sendAdminOrderEmail, sendCustomerOrderEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();
    if (typeof paymentIntentId !== "string" || !paymentIntentId.startsWith("pi_")) {
      return NextResponse.json({ success: false, message: "A valid payment confirmation is required." }, { status: 400 });
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded" || !paymentIntent.metadata.order_id) {
      return NextResponse.json({ success: false, message: "Payment has not been completed." }, { status: 409 });
    }
    const orderId = Number(paymentIntent.metadata.order_id);
    if (!Number.isInteger(orderId)) return NextResponse.json({ success: false, message: "Payment order is invalid." }, { status: 400 });

    const updated = await pool.query(`UPDATE orders SET payment_status='Paid', order_status='Processing' WHERE id=$1 AND payment_status <> 'Paid' RETURNING id`, [orderId]);
    if (!updated.rowCount) return NextResponse.json({ success: true, alreadyProcessed: true });

    const orderResult = await pool.query(`SELECT o.order_number, o.total, o.customer_email_sent, o.admin_email_sent, u.email AS customer_email, COALESCE(a.full_name, u.full_name) AS customer_name FROM orders o LEFT JOIN users u ON u.id=o.user_id LEFT JOIN addresses a ON a.id=o.address_id WHERE o.id=$1`, [orderId]);
    const itemsResult = await pool.query(`SELECT p.name, oi.quantity, oi.price FROM order_items oi LEFT JOIN products p ON p.id=oi.product_id WHERE oi.order_id=$1 ORDER BY oi.id`, [orderId]);
    const order = orderResult.rows[0];
    if (!order?.customer_email) throw new Error("Order customer email is missing.");
    const data = { orderId: order.order_number, customerName: order.customer_name || "Customer", customerEmail: order.customer_email, totalAmount: Number(order.total), items: itemsResult.rows.map((item) => ({ name: item.name || "Product", quantity: Number(item.quantity), price: Number(item.price) })) };
    const emailFailures: string[] = [];
    if (!order.customer_email_sent) {
      try { await sendCustomerOrderEmail(data); await pool.query("UPDATE orders SET customer_email_sent=TRUE WHERE id=$1", [orderId]); }
      catch (error) { console.error("Customer confirmation email failed:", error); emailFailures.push("customer"); }
    }
    if (!order.admin_email_sent) {
      try { await sendAdminOrderEmail(data); await pool.query("UPDATE orders SET admin_email_sent=TRUE WHERE id=$1", [orderId]); }
      catch (error) { console.error("Admin order email failed:", error); emailFailures.push("admin"); }
    }
    return NextResponse.json({ success: true, emailFailures });
  } catch (error) {
    console.error("Payment confirmation fallback failed:", error);
    return NextResponse.json({ success: false, message: "Payment confirmation could not be completed." }, { status: 500 });
  }
}
