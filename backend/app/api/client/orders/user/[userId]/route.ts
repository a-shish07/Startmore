import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // ==========================
    // Validate User
    // ==========================

    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================
    // Get User Orders
    // ==========================

    const orderResult = await pool.query(
      `
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
          o.created_at,

          COUNT(oi.id) AS total_items

      FROM orders o

      LEFT JOIN order_items oi
          ON oi.order_id = o.id

      WHERE o.user_id = $1

      GROUP BY
          o.id,
          o.order_number,
          o.subtotal,
          o.shipping_charge,
          o.discount,
          o.total,
          o.payment_method,
          o.payment_status,
          o.order_status,
          o.created_at

      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    return NextResponse.json({
      success: true,
      total_orders: orderResult.rows.length,
      orders: orderResult.rows,
    });

  } catch (error) {

    console.error("GET User Orders Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user orders",
      },
      {
        status: 500,
      }
    );
  }
}