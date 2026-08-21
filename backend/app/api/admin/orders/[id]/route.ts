import {
  NextRequest,
  NextResponse,
} from "next/server";

import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;

    console.log(
      "🔥 ADMIN ORDER DETAILS:",
      id
    );

    /* ==========================================
       GET ORDER
    ========================================== */

    const orderResult =
      await pool.query(
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

        WHERE o.id = $1

        LIMIT 1
        `,
        [id]
      );

    if (
      orderResult.rows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const order =
      orderResult.rows[0];

    /* ==========================================
       GET ORDER ITEMS
    ========================================== */

    const itemsResult =
      await pool.query(
        `
        SELECT
          oi.id,
          oi.product_id,
          oi.quantity,
          oi.size,
          oi.price,

          p.name AS product_name

        FROM order_items oi

        LEFT JOIN products p
          ON oi.product_id = p.id

        WHERE oi.order_id = $1

        ORDER BY oi.id ASC
        `,
        [id]
      );

    /* ==========================================
       RESPONSE
    ========================================== */

    return NextResponse.json({
      success: true,

      order: {
        ...order,
        items: itemsResult.rows,
      },
    });

  } catch (error) {

    console.error(
      "Admin Order Details Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch order",
      },
      {
        status: 500,
      }
    );
  }
}