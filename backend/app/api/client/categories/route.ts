import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.slug,
        CASE WHEN i.id IS NULL THEN NULL ELSE '/api/images/' || i.id END AS image_url
      FROM categories c
      LEFT JOIN images i
        ON c.image_id = i.id
      WHERE c.status = true
      ORDER BY c.name ASC;
    `);

    return NextResponse.json(
      {
        success: true,
        categories: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Client Categories Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories.",
      },
      { status: 500 }
    );
  }
}
