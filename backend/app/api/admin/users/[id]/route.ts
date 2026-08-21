import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET SINGLE USER DETAILS
   GET /api/admin/users/:id
========================================== */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ==========================================
    // GET USER
    // ==========================================

    const userResult = await pool.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.role,
        u.status,
        u.created_at

      FROM users u

      WHERE u.id = $1

      LIMIT 1
      `,
      [id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const user = userResult.rows[0];

    // ==========================================
    // GET USER ORDERS
    // ==========================================

    const ordersResult = await pool.query(
      `
      SELECT
        o.id,
        o.order_number,
        o.subtotal,
        o.shipping_charge,
        o.discount,
        o.total,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.tracking_number,
        o.courier,
        o.created_at

      FROM orders o

      WHERE o.user_id = $1

      ORDER BY o.created_at DESC
      `,
      [id]
    );

    // ==========================================
    // GET USER ADDRESSES
    // ==========================================

    const addressesResult = await pool.query(
      `
      SELECT
        a.id,
        a.full_name,
        a.phone,
        a.country,
        a.state,
        a.city,
        a.postal_code,
        a.address_line1,
        a.address_line2

      FROM addresses a

      WHERE a.user_id = $1

      ORDER BY a.id DESC
      `,
      [id]
    );

    // ==========================================
    // CALCULATE USER STATISTICS
    // ==========================================

    const totalOrders =
      ordersResult.rows.length;

    const totalSpent =
      ordersResult.rows.reduce(
        (sum, order) => {
          return (
            sum + Number(order.total || 0)
          );
        },
        0
      );

    const lastOrder =
      ordersResult.rows.length > 0
        ? ordersResult.rows[0].created_at
        : null;

    // ==========================================
    // RETURN USER DETAILS
    // ==========================================

    return NextResponse.json({
      success: true,

      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.created_at,

        total_orders: totalOrders,

        total_spent: totalSpent,

        last_order: lastOrder,

        addresses:
          addressesResult.rows,

        orders:
          ordersResult.rows,
      },
    });
  } catch (error) {
    console.error(
      "Admin User Details GET Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch user details",
      },
      {
        status: 500,
      }
    );
  }
}


/* ==========================================
   UPDATE USER STATUS
   PUT /api/admin/users/:id
========================================== */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const status =
      body.status === true;

    // ==========================================
    // CHECK USER
    // ==========================================

    const userResult = await pool.query(
      `
      SELECT
        id,
        role,
        status

      FROM users

      WHERE id = $1

      LIMIT 1
      `,
      [id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const existingUser =
      userResult.rows[0];

    // ==========================================
    // DO NOT DEACTIVATE ADMIN
    // ==========================================

    if (
      existingUser.role === "admin" &&
      status === false
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin accounts cannot be deactivated.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    const updateResult =
      await pool.query(
        `
        UPDATE users

        SET status = $1

        WHERE id = $2

        RETURNING
          id,
          full_name,
          email,
          role,
          status,
          created_at
        `,
        [status, id]
      );

    return NextResponse.json({
      success: true,

      message: status
        ? "User activated successfully."
        : "User deactivated successfully.",

      user: updateResult.rows[0],
    });
  } catch (error) {
    console.error(
      "Admin User Status PUT Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update user status",
      },
      {
        status: 500,
      }
    );
  }
}