import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.order_number,
        o.subtotal,
        o.shipping_charge,
        o.discount,
        o.total,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.tracking_number,
        o.courier,
        o.created_at,

        u.full_name AS customer_name,
        u.email AS customer_email,

        a.full_name AS shipping_name,
        a.phone AS shipping_phone,
        a.country,
        a.state,
        a.city,
        a.postal_code,
        a.address_line1,
        a.address_line2

      FROM orders o

      LEFT JOIN users u
        ON o.user_id = u.id

      LEFT JOIN addresses a
        ON o.address_id = a.id

      ORDER BY o.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Admin Orders GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}