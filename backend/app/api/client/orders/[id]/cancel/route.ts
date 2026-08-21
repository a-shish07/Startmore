import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    await client.query("BEGIN");

    // ==========================
    // Get Order
    // ==========================

    const orderResult = await client.query(
      `
      SELECT
          id,
          order_status
      FROM orders
      WHERE id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderResult.rows[0];

    // ==========================
    // Check Order Status
    // ==========================

    if (order.order_status === "Cancelled") {
      throw new Error("Order is already cancelled");
    }

    if (
      order.order_status === "Shipped" ||
      order.order_status === "Delivered"
    ) {
      throw new Error(
        `Cannot cancel ${order.order_status.toLowerCase()} order`
      );
    }

    // ==========================
    // Get Order Items
    // ==========================

    const itemResult = await client.query(
      `
      SELECT
          product_id,
          quantity
      FROM order_items
      WHERE order_id = $1
      `,
      [id]
    );

    // ==========================
    // Restore Product Stock
    // ==========================

    for (const item of itemResult.rows) {
      await client.query(
        `
        UPDATE products
        SET stock = stock + $1
        WHERE id = $2
        `,
        [
          item.quantity,
          item.product_id,
        ]
      );
    }

    // ==========================
    // Update Order Status
    // ==========================

    await client.query(
      `
      UPDATE orders
      SET
          order_status = 'Cancelled'
      WHERE id = $1
      `,
      [id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Cancel Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to cancel order",
      },
      {
        status: 500,
      }
    );

  } finally {

    client.release();

  }
}