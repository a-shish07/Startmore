import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type QuoteItem = { product_id: number; quantity: number };

// The cart uses this endpoint to display the same shipping calculation that
// will be saved on the order. Shipping is charged per product unit.
export async function POST(req: NextRequest) {
  try {
    const { items }: { items?: QuoteItem[] } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, shipping: 0, shipping_rates: {} });
    }

    let shipping = 0;
    const shipping_rates: Record<number, number> = {};

    for (const item of items) {
      if (!Number.isInteger(item.product_id) || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid cart item." },
          { status: 400 }
        );
      }

      const result = await pool.query(
        `SELECT name, shipping_cost, status, is_deleted FROM products WHERE id = $1`,
        [item.product_id]
      );

      if (result.rows.length === 0 || !result.rows[0].status || result.rows[0].is_deleted) {
        return NextResponse.json(
          { success: false, message: "A product in your cart is unavailable." },
          { status: 400 }
        );
      }

      const shippingCost = Number(result.rows[0].shipping_cost || 0);
      shipping_rates[item.product_id] = shippingCost;
      shipping += shippingCost * item.quantity;
    }

    return NextResponse.json({ success: true, shipping, shipping_rates });
  } catch (error) {
    console.error("Shipping quote error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to calculate shipping." },
      { status: 500 }
    );
  }
}
