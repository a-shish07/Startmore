import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET ALL CATEGORIES
   GET /api/admin/categories
========================================== */
export async function GET() {
  try {

    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.image_id,
        CASE WHEN i.id IS NULL THEN NULL ELSE '/api/images/' || i.id END AS image_url,
        c.status,
        c.created_at
      FROM categories c
      LEFT JOIN images i
      ON c.image_id = i.id
      ORDER BY c.id ASC
    `);

    return NextResponse.json(
      {
        success: true,
        categories: result.rows,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories.",
      },
      {
        status: 500,
      }
    );

  }
}

/* ==========================================
   CREATE CATEGORY
   POST /api/admin/categories
========================================== */
export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();

    const name = formData.get("name") as string;

    const slug = formData.get("slug") as string;

    const image_id = Number(formData.get("image_id")) || null;

    const status =
      formData.get("status") === "true";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO categories
      (
        name,
        slug,
        image_id,
        status
      )
      VALUES
      (
        $1,$2,$3,$4
      )
      RETURNING *
      `,
      [
        name,
        slug,
        image_id,
        status,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        category: result.rows[0],
      },
      {
        status: 201,
      }
    );

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );

  }
}
