import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          p.id,
          p.name,
          p.slug,
          p.description,
          p.price,
          p.discount_price,
          p.shipping_cost,
          p.stock,
          p.featured,
          p.best_seller,
          p.new_arrival,
          p.on_sale,

          c.name AS category_name,
          c.slug AS category_slug,

          s.name AS shape_name,
          s.slug AS shape_slug,

          CASE WHEN i.id IS NULL THEN NULL ELSE '/api/images/' || i.id END AS image_url

      FROM products p

      LEFT JOIN categories c
      ON p.category_id = c.id

      LEFT JOIN shapes s
      ON p.shape_id = s.id

      LEFT JOIN product_images pi
      ON p.id = pi.product_id
      AND pi.sort_order = 1

      LEFT JOIN images i
      ON pi.image_id = i.id

      WHERE p.status = true

      ORDER BY p.created_at DESC;
    `);

    return NextResponse.json({
      success: true,
      products: result.rows,
    });

  } catch (error) {
    console.error("GET Client Products Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
      },
      {
        status: 500,
      }
    );
  }
}
