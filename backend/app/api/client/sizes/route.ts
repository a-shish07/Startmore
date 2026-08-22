import { NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET ACTIVE SIZES
   GET /api/client/sizes
========================================== */

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        status
      FROM sizes
      WHERE status = true
      ORDER BY id ASC
    `);

    return NextResponse.json({
      success: true,
      sizes: result.rows,
    });
  } catch (error) {
    console.error("GET Client Sizes Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sizes.",
      },
      { status: 500 }
    );
  }
}