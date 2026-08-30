import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const DAY = 24 * 60 * 60 * 1000;

function readDate(value: string | null, fallback: Date) {
  const date = value ? new Date(`${value}T00:00:00.000Z`) : fallback;
  return Number.isNaN(date.getTime()) ? fallback : date;
}

/** Date-scoped metrics used by the admin analytics dashboard. */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const end = readDate(searchParams.get("endDate"), new Date());
    const start = readDate(searchParams.get("startDate"), new Date(end.getTime() - 29 * DAY));

    if (start > end || end.getTime() - start.getTime() > 366 * DAY) {
      return NextResponse.json({ success: false, message: "Choose a valid date range up to 366 days." }, { status: 400 });
    }

    const from = start.toISOString();
    const until = new Date(end.getTime() + DAY).toISOString();
    const [statsResult, summaryResult, trendResult, recentOrdersResult] = await Promise.all([
      pool.query(`SELECT
        (SELECT COUNT(*)::int FROM products WHERE is_deleted = false AND created_at >= $1 AND created_at < $2) AS total_products,
        (SELECT COUNT(*)::int FROM users WHERE role = 'user' AND created_at >= $1 AND created_at < $2) AS total_customers,
        COUNT(*) FILTER (WHERE order_status <> 'Cancelled')::int AS total_orders,
        COALESCE(SUM(total) FILTER (WHERE order_status <> 'Cancelled' AND payment_status NOT IN ('Refunded', 'Cancelled')), 0) AS total_revenue,
        COALESCE(SUM(subtotal) FILTER (WHERE order_status <> 'Cancelled' AND payment_status NOT IN ('Refunded', 'Cancelled')), 0) AS gross_sales,
        COUNT(*) FILTER (WHERE order_status IN ('Shipped', 'Delivered'))::int AS orders_fulfilled
        FROM orders WHERE created_at >= $1 AND created_at < $2`, [from, until]),
      pool.query(`SELECT
        COUNT(*) FILTER (WHERE order_status = 'Placed')::int AS pending,
        COUNT(*) FILTER (WHERE order_status = 'Processing')::int AS processing,
        COUNT(*) FILTER (WHERE order_status = 'Shipped')::int AS shipped,
        COUNT(*) FILTER (WHERE order_status = 'Delivered')::int AS delivered,
        COUNT(*) FILTER (WHERE order_status = 'Cancelled')::int AS cancelled
        FROM orders WHERE created_at >= $1 AND created_at < $2`, [from, until]),
      pool.query(`WITH days AS (
          SELECT generate_series($1::timestamptz::date, ($2::timestamptz - interval '1 millisecond')::date, interval '1 day')::date AS day
        ), order_days AS (
          SELECT created_at::date AS day,
            COALESCE(SUM(total) FILTER (WHERE order_status <> 'Cancelled' AND payment_status NOT IN ('Refunded', 'Cancelled')), 0) AS revenue,
            COALESCE(SUM(subtotal) FILTER (WHERE order_status <> 'Cancelled' AND payment_status NOT IN ('Refunded', 'Cancelled')), 0) AS gross_sales,
            COUNT(*) FILTER (WHERE order_status <> 'Cancelled')::int AS orders,
            COUNT(*) FILTER (WHERE order_status IN ('Shipped', 'Delivered'))::int AS fulfilled
          FROM orders WHERE created_at >= $1 AND created_at < $2 GROUP BY created_at::date
        ), product_days AS (
          SELECT created_at::date AS day, COUNT(*)::int AS products
          FROM products WHERE created_at >= $1 AND created_at < $2 AND is_deleted = false GROUP BY created_at::date
        ), customer_days AS (
          SELECT created_at::date AS day, COUNT(*)::int AS customers
          FROM users WHERE created_at >= $1 AND created_at < $2 AND role = 'user' GROUP BY created_at::date
        )
        SELECT TO_CHAR(days.day, 'YYYY-MM-DD') AS date,
          COALESCE(order_days.revenue, 0) AS revenue, COALESCE(order_days.gross_sales, 0) AS gross_sales,
          COALESCE(order_days.orders, 0)::int AS orders, COALESCE(order_days.fulfilled, 0)::int AS fulfilled,
          COALESCE(product_days.products, 0)::int AS products, COALESCE(customer_days.customers, 0)::int AS customers
        FROM days
        LEFT JOIN order_days ON order_days.day = days.day
        LEFT JOIN product_days ON product_days.day = days.day
        LEFT JOIN customer_days ON customer_days.day = days.day
        ORDER BY days.day`, [from, until]),
      pool.query(`SELECT o.id, o.order_number, o.total, o.order_status, o.created_at,
          u.full_name AS customer_name, u.email AS customer_email
        FROM orders o LEFT JOIN users u ON u.id = o.user_id
        WHERE o.created_at >= $1 AND o.created_at < $2
        ORDER BY o.created_at DESC LIMIT 5`, [from, until]),
    ]);

    const numberRecord = (row: Record<string, unknown>) =>
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key, key === "date" ? value : Number(value)]));

    return NextResponse.json({
      success: true,
      stats: numberRecord(statsResult.rows[0]),
      order_summary: numberRecord(summaryResult.rows[0]),
      series: trendResult.rows.map(numberRecord),
      recent_orders: recentOrdersResult.rows,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ success: false, message: "Failed to load analytics." }, { status: 500 });
  }
}
