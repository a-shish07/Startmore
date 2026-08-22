import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ success: false, message: "Invalid image ID." }, { status: 400 });
  }

  const result = await pool.query(
    "SELECT url FROM images WHERE id = $1 LIMIT 1",
    [id]
  );

  if (result.rows.length === 0 || !result.rows[0].url) {
    return NextResponse.json({ success: false, message: "Image not found." }, { status: 404 });
  }

  const response = NextResponse.redirect(
    new URL(result.rows[0].url, request.url),
    307
  );
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return response;
}
