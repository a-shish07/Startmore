import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ==========================
    // Product Details
    // ==========================

    const productResult = await pool.query(
      `
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
          p.rating,
          p.review_count,
          p.sku,
          p.meta_title,
          p.meta_description,

          c.id AS category_id,
          c.name AS category_name,

          s.id AS shape_id,
          s.name AS shape_name

      FROM products p

      LEFT JOIN categories c
        ON c.id = p.category_id

      LEFT JOIN shapes s
        ON s.id = p.shape_id

      WHERE
          p.id = $1
          AND p.status = true
          AND p.is_deleted = false

      LIMIT 1
      `,
      [id]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    const product = productResult.rows[0];

    // ==========================
    // Product Images
    // ==========================

    const imageResult = await pool.query(
      `
      SELECT
          i.id,
          '/api/images/' || i.id AS image_url

      FROM product_images pi

      INNER JOIN images i
        ON i.id = pi.image_id

      WHERE
          pi.product_id = $1

      ORDER BY pi.sort_order ASC
      `,
      [product.id]
    );

    // ==========================
    // Product Sizes
    // ==========================

    const sizeResult = await pool.query(
      `
      SELECT
          s.id,
          s.name

      FROM product_sizes ps

      INNER JOIN sizes s
        ON s.id = ps.size_id

      WHERE
          ps.product_id = $1

      ORDER BY s.name ASC
      `,
      [product.id]
    );

    // ==========================
    // Response
    // ==========================

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: imageResult.rows,
        sizes: sizeResult.rows,
      },
    });
  } catch (error) {
    console.error("GET Product Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  }
}
