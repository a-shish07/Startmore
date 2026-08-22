import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET SINGLE BANNER
   GET /api/admin/banners/:id
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
        id,
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_link,
        sort_order,
        status,
        created_at
      FROM hero_banners
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        banner: result.rows[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET Banner:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

/* ==========================================
   UPDATE BANNER
   PUT /api/admin/banners/:id
========================================== */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const {
      title,
      subtitle,
      description,
      image_url,
      button_text,
      button_link,
      sort_order,
      status,
    } = body;

    const result = await pool.query(
      `
      UPDATE hero_banners
      SET
        title = $1,
        subtitle = $2,
        description = $3,
        image_url = $4,
        button_text = $5,
        button_link = $6,
        sort_order = $7,
        status = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_link,
        sort_order,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Banner updated successfully",
        banner: result.rows[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("UPDATE Banner:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

/* ==========================================
   DELETE BANNER
   DELETE /api/admin/banners/:id
========================================== */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `
      DELETE FROM hero_banners
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Banner deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE Banner:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}