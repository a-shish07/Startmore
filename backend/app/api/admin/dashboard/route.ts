import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // ==========================================
    // Dashboard Statistics
    // ==========================================

    const statsResult = await pool.query(`
      SELECT

        -- =====================================
        -- Total Products
        -- =====================================
        (
          SELECT COUNT(*)::int
          FROM products
          WHERE is_deleted = false
        ) AS total_products,


        -- =====================================
        -- Total Orders
        -- Exclude Cancelled Orders
        -- =====================================
        (
          SELECT COUNT(*)::int
          FROM orders
          WHERE order_status <> 'Cancelled'
        ) AS total_orders,


        -- =====================================
        -- Total Customers
        -- Only normal users
        -- =====================================
        (
          SELECT COUNT(*)::int
          FROM users
          WHERE role = 'user'
        ) AS total_customers,


        -- =====================================
        -- Total Revenue
        -- Exclude Cancelled / Refunded Orders
        -- =====================================
        (
          SELECT COALESCE(
            SUM(total),
            0
          )
          FROM orders
          WHERE order_status <> 'Cancelled'
            AND payment_status NOT IN (
              'Refunded',
              'Cancelled'
            )
        ) AS total_revenue
    `);


    // ==========================================
    // Recent Orders
    // ==========================================

    const recentOrdersResult =
      await pool.query(`
        SELECT
          o.id,
          o.order_number,
          o.total,
          o.payment_method,
          o.payment_status,
          o.order_status,
          o.created_at,

          -- Customer
          u.full_name AS customer_name,
          u.email AS customer_email,

          -- Number of items
          COALESCE(
            SUM(oi.quantity),
            0
          )::int AS item_count,

          -- First product name
          MIN(p.name) AS first_product_name

        FROM orders o

        LEFT JOIN users u
          ON u.id = o.user_id

        LEFT JOIN order_items oi
          ON oi.order_id = o.id

        LEFT JOIN products p
          ON p.id = oi.product_id

        GROUP BY
          o.id,
          o.order_number,
          o.total,
          o.payment_method,
          o.payment_status,
          o.order_status,
          o.created_at,
          u.full_name,
          u.email

        ORDER BY
          o.created_at DESC

        LIMIT 5
      `);


    // ==========================================
    // Order Summary
    // ==========================================

    const orderSummaryResult =
      await pool.query(`
        SELECT

          COUNT(*) FILTER (
            WHERE order_status = 'Placed'
          )::int AS pending,

          COUNT(*) FILTER (
            WHERE order_status = 'Processing'
          )::int AS processing,

          COUNT(*) FILTER (
            WHERE order_status = 'Shipped'
          )::int AS shipped,

          COUNT(*) FILTER (
            WHERE order_status = 'Delivered'
          )::int AS delivered,

          COUNT(*) FILTER (
            WHERE order_status = 'Cancelled'
          )::int AS cancelled

        FROM orders
      `);


    // ==========================================
    // Prepare Data
    // ==========================================

    const stats = statsResult.rows[0];

    const summary =
      orderSummaryResult.rows[0];


    // ==========================================
    // Response
    // ==========================================

    return NextResponse.json({
      success: true,

      stats: {
        total_products:
          Number(stats.total_products || 0),

        total_orders:
          Number(stats.total_orders || 0),

        total_customers:
          Number(stats.total_customers || 0),

        total_revenue:
          Number(stats.total_revenue || 0),
      },

      recent_orders:
        recentOrdersResult.rows || [],

      order_summary: {
        pending:
          Number(summary.pending || 0),

        processing:
          Number(summary.processing || 0),

        shipped:
          Number(summary.shipped || 0),

        delivered:
          Number(summary.delivered || 0),

        cancelled:
          Number(summary.cancelled || 0),
      },
    });

  } catch (error) {

    console.error(
      "Admin Dashboard API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load admin dashboard",
      },
      {
        status: 500,
      }
    );
  }
}