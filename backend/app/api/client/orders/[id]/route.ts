import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ==========================
    // Get Order
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
          o.tracking_number,
          o.courier,
          o.created_at,

          a.id AS address_id,
          a.full_name,
          a.phone,
          a.country,
          a.state,
          a.city,
          a.postal_code,
          a.address_line1,
          a.address_line2

      FROM orders o

      LEFT JOIN addresses a
        ON a.id = o.address_id

      WHERE o.id = $1

      LIMIT 1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
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

    const order = orderResult.rows[0];

    // ==========================
    // Get Order Items
    // ==========================

    const itemResult = await pool.query(
      `
      SELECT

          oi.id,
          oi.quantity,
          oi.size,
          oi.price,

          p.id AS product_id,
          p.name,
          p.slug,

          CASE WHEN i.id IS NULL THEN NULL ELSE '/api/images/' || i.id END AS image_url

      FROM order_items oi

      INNER JOIN products p
          ON p.id = oi.product_id

      LEFT JOIN product_images pi
          ON pi.product_id = p.id
          AND pi.sort_order = 1

      LEFT JOIN images i
          ON i.id = pi.image_id

      WHERE oi.order_id = $1

      ORDER BY oi.id
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,

        subtotal: order.subtotal,
        shipping_charge: order.shipping_charge,
        discount: order.discount,
        total: order.total,

        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,

        tracking_number: order.tracking_number,
        courier: order.courier,

        created_at: order.created_at,

        address: {
          id: order.address_id,
          full_name: order.full_name,
          phone: order.phone,
          country: order.country,
          state: order.state,
          city: order.city,
          postal_code: order.postal_code,
          address_line1: order.address_line1,
          address_line2: order.address_line2,
        },

        items: itemResult.rows,
      },
    });
  } catch (error) {
    console.error("GET Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
      },
      {
        status: 500,
      }
    );
  }
}
