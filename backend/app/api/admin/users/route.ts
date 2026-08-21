// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/db";

// /* ==========================================
//    GET ALL USERS
//    GET /api/admin/users
// ========================================== */

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const search =
//       searchParams.get("search")?.trim() || "";

//     // ==========================================
//     // GET USERS
//     // ==========================================

//     const result = await pool.query(
//       `
//       SELECT
//         u.id,
//         u.full_name,
//         u.email,
//         u.role,
//         u.created_at,

//         COUNT(o.id)::INTEGER AS total_orders,

//         COALESCE(
//           SUM(
//             CASE
//               WHEN o.payment_status = 'Paid'
//               THEN o.total
//               ELSE 0
//             END
//           ),
//           0
//         ) AS total_spent,

//         MAX(o.created_at) AS last_order

//       FROM users u

//       LEFT JOIN orders o
//         ON u.id = o.user_id

//       WHERE
//         (
//           u.full_name ILIKE $1
//           OR u.email ILIKE $1
//           OR u.role ILIKE $1
//         )

//       GROUP BY
//         u.id,
//         u.full_name,
//         u.email,
//         u.role,
//         u.created_at

//       ORDER BY
//         u.created_at DESC
//       `,
//       [`%${search}%`]
//     );

//     return NextResponse.json({
//       success: true,
//       users: result.rows,
//     });
//   } catch (error) {
//     console.error(
//       "Admin Users GET Error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch users",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET ALL USERS
   GET /api/admin/users
========================================== */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.role,
        u.status,
        u.created_at,

        COUNT(o.id)::INTEGER AS total_orders,

        COALESCE(
          SUM(
            CASE
              WHEN LOWER(o.payment_status) = 'paid'
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

      WHERE
        u.full_name ILIKE $1
        OR u.email ILIKE $1
        OR u.role ILIKE $1

      GROUP BY
        u.id,
        u.full_name,
        u.email,
        u.role,
        u.status,
        u.created_at

      ORDER BY
        u.created_at DESC
      `,
      [`%${search}%`]
    );

    return NextResponse.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error(
      "Admin Users GET Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}