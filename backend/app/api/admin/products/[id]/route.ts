import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET SINGLE PRODUCT
   GET /api/admin/products/:id
========================================== */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const productResult = await pool.query(
      `
      SELECT
        p.*,
        c.name AS category_name,
        s.name AS shape_name
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN shapes s
        ON p.shape_id = s.id
      WHERE p.id = $1
        AND p.is_deleted = FALSE
      `,
      [id]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const imageResult = await pool.query(
      `
      SELECT
        pi.id,
        pi.image_id,
        pi.sort_order,
        '/api/images/' || i.id AS url
      FROM product_images pi
      JOIN images i
        ON pi.image_id = i.id
      WHERE pi.product_id = $1
      ORDER BY pi.sort_order ASC
      `,
      [id]
    );
    const sizeResult = await pool.query(
  `
  SELECT
    s.id,
    s.name
  FROM product_sizes ps
  JOIN sizes s
    ON ps.size_id = s.id
  WHERE ps.product_id = $1
  ORDER BY s.name
  `,
  [id]
);

    return NextResponse.json({
      success: true,
      product: {
        ...productResult.rows[0],
        images: imageResult.rows,
        sizes: sizeResult.rows,
      },
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

/* ==========================================
   UPDATE PRODUCT
   PUT /api/admin/products/:id
========================================== */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    const formData = await req.formData();

    const category_id = Number(formData.get("category_id"));
    const shape_id = Number(formData.get("shape_id"));

    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim();

    const description = formData.get("description")?.toString() || "";

    const price = Number(formData.get("price"));

    const discount_price = formData.get("discount_price")
      ? Number(formData.get("discount_price"))
      : null;

    const shipping_cost = Number(formData.get("shipping_cost") ?? 0);

    if (isNaN(shipping_cost) || shipping_cost < 0) {
      return NextResponse.json(
        { success: false, message: "Shipping cost must be a non-negative number." },
        { status: 400 }
      );
    }

    const stock = formData.get("stock")
      ? Number(formData.get("stock"))
      : 0;

    const sku = formData.get("sku")?.toString() || "";

    const featured = formData.get("featured") === "true";
    const best_seller = formData.get("best_seller") === "true";
    const new_arrival = formData.get("new_arrival") === "true";
    const on_sale = formData.get("on_sale") === "true";
    const status = formData.get("status") === "true";

    const meta_title = formData.get("meta_title")?.toString() || "";
    const meta_description =
      formData.get("meta_description")?.toString() || "";

    const images = JSON.parse(
      formData.get("images")?.toString() || "[]"
    );
    const sizes = JSON.parse(
  formData.get("sizes")?.toString() || "[]"
);

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE products
      SET
        category_id=$1,
        shape_id=$2,
        name=$3,
        slug=$4,
        description=$5,
        price=$6,
        discount_price=$7,
        shipping_cost=$8,
        stock=$9,
        sku=$10,
        featured=$11,
        best_seller=$12,
        new_arrival=$13,
        on_sale=$14,
        status=$15,
        meta_title=$16,
        meta_description=$17,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$18
      `,
      [
        category_id,
        shape_id,
        name,
        slug,
        description,
        price,
        discount_price,
        shipping_cost,
        stock,
        sku,
        featured,
        best_seller,
        new_arrival,
        on_sale,
        status,
        meta_title,
        meta_description,
        id,
      ]
    );

    await client.query(
      `
      DELETE FROM product_images
      WHERE product_id=$1
      `,
      [id]
    );
await client.query(
  `
  DELETE FROM product_sizes
  WHERE product_id=$1
  `,
  [id]
);
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await client.query(
          `
          INSERT INTO product_images
          (
            product_id,
            image_id,
            sort_order
          )
          VALUES ($1,$2,$3)
          `,
          [
            id,
            images[i],
            i + 1,
          ]
        );
      }
    }
if (sizes.length > 0) {
  for (const sizeId of sizes) {
    await client.query(
      `
      INSERT INTO product_sizes
      (
        product_id,
        size_id
      )
      VALUES
      ($1,$2)
      `,
      [
        id,
        sizeId,
      ]
    );
  }
}
    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );

  } finally {

    client.release();

  }
}
/* ==========================================
   DELETE PRODUCT
   DELETE /api/admin/products/:id
========================================== */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    await client.query("BEGIN");

    // Delete image mappings first
    await client.query(
      `
      DELETE FROM product_images
      WHERE product_id = $1
      `,
      [id]
    );

    // Delete product
    await client.query(
      `
      DELETE FROM products
      WHERE id = $1
      `,
      [id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product.",
      },
      { status: 500 }
    );

  } finally {
    client.release();
  }
}
