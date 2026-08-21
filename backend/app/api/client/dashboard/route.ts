// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function GET(req: NextRequest) {
//   const client = await pool.connect();

//   try {
//     const { searchParams } = new URL(req.url);

//     const userId = searchParams.get("user_id");

//     if (!userId) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User ID is required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // ==========================
//     // Dashboard Stats
//     // ==========================

//     const statsResult = await client.query(
//       `
//       SELECT

//         COUNT(*) AS total_orders,

//         COUNT(*) FILTER (
//           WHERE order_status = 'Processing'
//         ) AS processing_orders,

//         COUNT(*) FILTER (
//           WHERE order_status = 'Delivered'
//         ) AS delivered_orders,

//         COALESCE(SUM(total),0) AS total_spent

//       FROM orders

//       WHERE user_id = $1
//       `,
//       [userId]
//     );

//     // ==========================
//     // Address Count
//     // ==========================

//     const addressResult = await client.query(
//       `
//       SELECT COUNT(*) AS address_count
//       FROM addresses
//       WHERE user_id = $1
//       `,
//       [userId]
//     );

//     // ==========================
//     // Recent Orders
//     // ==========================

//     const ordersResult = await client.query(
//       `
//       SELECT

//         id,
//         order_number,
//         total,
//         payment_status,
//         order_status,
//         created_at

//       FROM orders

//       WHERE user_id = $1

//       ORDER BY created_at DESC

//       LIMIT 5
//       `,
//       [userId]
//     );

//     return NextResponse.json({
//       success: true,

//       stats: {
//         totalOrders: Number(
//           statsResult.rows[0].total_orders
//         ),

//         processingOrders: Number(
//           statsResult.rows[0].processing_orders
//         ),

//         deliveredOrders: Number(
//           statsResult.rows[0].delivered_orders
//         ),

//         totalSpent: Number(
//           statsResult.rows[0].total_spent
//         ),

//         addressCount: Number(
//           addressResult.rows[0].address_count
//         ),

//         wishlistCount: 0,
//       },

//       recentOrders: ordersResult.rows,
//     });

//   } catch (error) {

//     console.error("Dashboard Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to load dashboard",
//       },
//       {
//         status: 500,
//       }
//     );

//   } finally {

//     client.release();

//   }
// }

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 401 }
      );
    }

    // ==========================
    // Validate User
    // ==========================

    const userResult = await pool.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // ==========================
    // Dashboard Statistics
    // ==========================

    const statsResult = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total_orders,

        COUNT(*) FILTER (
          WHERE order_status IN ('Placed', 'Processing')
        )::int AS pending_orders

      FROM orders
      WHERE user_id = $1
      `,
      [userId]
    );

    // ==========================
    // Saved Addresses
    // ==========================

    const addressResult = await pool.query(
      `
      SELECT COUNT(*)::int AS saved_addresses
      FROM addresses
      WHERE user_id = $1
      `,
      [userId]
    );

    // ==========================
    // Recent Orders
    // ==========================

    const recentOrdersResult = await pool.query(
      `
      SELECT
        id,
        order_number,
        total,
        payment_method,
        payment_status,
        order_status,
        created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    const stats = statsResult.rows[0];

    return NextResponse.json({
      success: true,

      stats: {
        total_orders: stats.total_orders,
        pending_orders: stats.pending_orders,
        saved_addresses:
          addressResult.rows[0].saved_addresses,
      },

      recent_orders: recentOrdersResult.rows,
    });
  } catch (error) {
    console.error(
      "Dashboard API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard",
      },
      { status: 500 }
    );
  }
}