import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { sendTrackingEmail } from "@/lib/email";

function isAdmin(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    return (jwt.verify(token || "", process.env.JWT_SECRET || "") as { role?: string }).role === "admin";
  } catch {
    return false;
  }
}

function isSafeTrackingUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, message: "Admin authorization required." }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const courier = typeof body.courier === "string" ? body.courier.trim() : "";
    const trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber.trim() : "";
    const trackingUrl = typeof body.trackingUrl === "string" ? body.trackingUrl.trim() : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";
    if (!/^\d+$/.test(id) || !courier || !trackingNumber || courier.length > 100 || trackingNumber.length > 160 || note.length > 1000 || (trackingUrl && !isSafeTrackingUrl(trackingUrl))) {
      return NextResponse.json({ success: false, message: "Enter a courier, tracking number, and a valid tracking website URL." }, { status: 400 });
    }
    const orderResult = await pool.query(`SELECT o.id, o.order_number, u.email AS customer_email, COALESCE(a.full_name, u.full_name) AS customer_name FROM orders o LEFT JOIN users u ON u.id=o.user_id LEFT JOIN addresses a ON a.id=o.address_id WHERE o.id=$1`, [Number(id)]);
    if (!orderResult.rowCount) return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    const order = orderResult.rows[0];
    if (!order.customer_email) return NextResponse.json({ success: false, message: "This order has no customer email address." }, { status: 400 });

    await sendTrackingEmail({ customerEmail: order.customer_email, customerName: order.customer_name, orderNumber: order.order_number, courier, trackingNumber, trackingUrl: trackingUrl || null, note: note || null });
    await pool.query(`UPDATE orders SET courier=$1, tracking_number=$2, tracking_url=$3, tracking_email_sent_at=NOW(), order_status=CASE WHEN order_status IN ('Placed','Processing', 'Paid') THEN 'Shipped' ELSE order_status END WHERE id=$4`, [courier, trackingNumber, trackingUrl || null, Number(id)]);
    return NextResponse.json({ success: true, message: "Tracking email sent and order updated." });
  } catch (error) {
    console.error("Tracking email error:", error);
    return NextResponse.json({ success: false, message: "Could not send the tracking email. The order was not updated." }, { status: 500 });
  }
}
