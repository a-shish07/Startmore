import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(
      Number(searchParams.get("page") || 1),
      1
    );

    const limit = 15;
    const offset = (page - 1) * limit;

    // ==========================================
    // SEARCH CONDITION
    // ==========================================

    const searchValue = `%${search}%`;

    // ==========================================
    // TOTAL CUSTOMERS
    // ==========================================

    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM users u
      WHERE u.role = 'user'
        AND (
          u.full_name ILIKE $1
          OR u.email ILIKE $1
        )
      `,
      [searchValue]
    );

    const totalCustomers = Number(
      countResult.rows[0].total
    );

    // ==========================================
    // GET CUSTOMERS
    // ==========================================

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.created_at,

        COUNT(o.id)::INTEGER AS total_orders,

        COALESCE(
          SUM(
            CASE
              WHEN o.payment_status = 'Paid'
              THEN o.total
              ELSE 0
            END
          ),
          0
        ) AS total_spent,

        MAX(o.created_at) AS last_order

      FROM users u

      LEFT JOIN orders o
        ON u.id = o.user_id

      WHERE u.role = 'user'

        AND (
          u.full_name ILIKE $1
          OR u.email ILIKE $1
        )

      GROUP BY
        u.id,
        u.full_name,
        u.email,
        u.created_at

      ORDER BY
        last_order DESC NULLS LAST,
        u.created_at DESC

      LIMIT $2
      OFFSET $3
      `,
      [searchValue, limit, offset]
    );

    const totalPages = Math.ceil(
      totalCustomers / limit
    );

    return NextResponse.json({
      success: true,

      customers: result.rows,

      pagination: {
        page,
        limit,
        total: totalCustomers,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "Admin Customers GET Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
      },
      {
        status: 500,
      }
    );
  }
}