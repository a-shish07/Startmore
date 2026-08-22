import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET SINGLE SHAPE
   GET /api/admin/shapes/:id
========================================== */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const result = await pool.query(
      `
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
      WHERE s.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Shape not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        shape: result.rows[0],
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
        message: "Failed to fetch shape.",
      },
      {
        status: 500,
      }
    );

  }
}

/* ==========================================
   UPDATE SHAPE
   PUT /api/admin/shapes/:id
========================================== */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const formData = await req.formData();

    const name = formData.get("name") as string;

    const slug = formData.get("slug") as string;

    const image_id = Number(formData.get("image_id")) || null;

    const status =
      formData.get("status") === "true";

    const result = await pool.query(
      `
      UPDATE shapes
      SET
        name = $1,
        slug = $2,
        image_id = $3,
        status = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        name,
        slug,
        image_id,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Shape not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Shape updated successfully.",
        shape: result.rows[0],
      },
      {
        status: 200,
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

/* ==========================================
   DELETE SHAPE
   DELETE /api/admin/shapes/:id
========================================== */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const result = await pool.query(
      `
      DELETE FROM shapes
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Shape not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Shape deleted successfully.",
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
        message: "Failed to delete shape.",
      },
      {
        status: 500,
      }
    );

  }
}
