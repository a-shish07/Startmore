import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { imageProxyPath, storeImage } from "@/lib/image-storage";

/*
==========================================
GET ALL BANNERS
GET /api/admin/banners
==========================================
*/

export async function GET() {
  try {
    const result = await pool.query(`
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
      ORDER BY sort_order ASC
    `);

    return NextResponse.json(
      {
        success: true,
        data: result.rows,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET Banner Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch banners",
      },
      {
        status: 500,
      }
    );
  }
}

/*
==========================================
CREATE BANNER
POST /api/admin/banners
==========================================
*/

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File | null;

    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const button_text = formData.get("button_text") as string;
    const button_link = formData.get("button_link") as string;
    const sort_order = Number(formData.get("sort_order") || 1);
    const status = formData.get("status") === "true";

    if (!title || !file) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and Banner Image are required.",
        },
        {
          status: 400,
        }
      );
    }

    const image = await storeImage(file, "banners");
    const image_url = imageProxyPath(image.id);

    const result = await pool.query(
      `
      INSERT INTO hero_banners
      (
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_link,
        sort_order,
        status
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8
      )
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
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully.",
        banner: result.rows[0],
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("CREATE Banner Error:", error);

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
