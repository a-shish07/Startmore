import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET ALL SHAPES
   GET /api/admin/shapes
========================================== */

export async function GET() {
  try {

    const result = await pool.query(`
      SELECT
        s.id,
        s.name,
        s.slug,
        s.image_id,
        CASE WHEN i.id IS NULL THEN NULL ELSE '/api/images/' || i.id END AS image_url,
        s.status,
        s.created_at
      FROM shapes s
      LEFT JOIN images i
      ON s.image_id = i.id
      ORDER BY s.id ASC
    `);

    return NextResponse.json(
      {
        success: true,
        shapes: result.rows,
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
        message: "Failed to fetch shapes.",
      },
      {
        status: 500,
      }
    );

  }
}

/* ==========================================
   CREATE SHAPE
   POST /api/admin/shapes
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
          message: "Shape name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO shapes
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
        message: "Shape created successfully.",
        shape: result.rows[0],
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
