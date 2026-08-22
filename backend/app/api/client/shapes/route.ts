import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.name,
        s.slug,
        CASE WHEN i.id IS NULL THEN NULL ELSE '/api/images/' || i.id END AS image_url
      FROM shapes s
      LEFT JOIN images i
        ON s.image_id = i.id
      WHERE s.status = true
      ORDER BY s.name ASC;
    `);

    return NextResponse.json(
      {
        success: true,
        shapes: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Client Shapes Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch shapes.",
      },
      { status: 500 }
    );
  }
}
