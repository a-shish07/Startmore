import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET SINGLE CUSTOMER
   GET /api/admin/customers/:id
========================================== */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("Customer Details Request:", id);

    // ==========================================
    // GET CUSTOMER
    // ==========================================

    const customerResult = await pool.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.created_at,

        COUNT(o.id)::INTEGER AS total_orders,

        COALESCE(
          SUM(
            CASE
              WHEN o.payment_status = 'Paid'
              THEN o.total
              ELSE 0
            END
          ),
          0
        ) AS total_spent,

        MAX(o.created_at) AS last_order

      FROM users u

      LEFT JOIN orders o
        ON u.id = o.user_id

      WHERE
        u.id = $1
        AND u.role = 'user'

      GROUP BY
        u.id,
        u.full_name,
        u.email,
        u.created_at

      LIMIT 1
      `,
      [id]
    );

    // ==========================================
    // CUSTOMER NOT FOUND
    // ==========================================

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        {
          status: 404,
        }
      );
    }

    const customer =
      customerResult.rows[0];

    // ==========================================
    // GET CUSTOMER ORDERS
    // ==========================================

    const ordersResult = await pool.query(
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
        o.tracking_number,
        o.courier,
        o.created_at

      FROM orders o

      WHERE o.user_id = $1

      ORDER BY
        o.created_at DESC
      `,
      [id]
    );

    // ==========================================
    // GET CUSTOMER ADDRESSES
    // ==========================================

    const addressesResult = await pool.query(
      `
      SELECT
        id,
        full_name,
        phone,
        country,
        state,
        city,
        postal_code,
        address_line1,
        address_line2
      FROM addresses
      WHERE user_id = $1
      ORDER BY id DESC
      `,
      [id]
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      customer: {
        ...customer,

        orders: ordersResult.rows,

        addresses:
          addressesResult.rows,
      },
    });
  } catch (error) {
    console.error(
      "Admin Customer Details Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch customer details",
      },
      {
        status: 500,
      }
    );
  }
}