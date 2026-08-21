import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// ============================================================
// GET - Get all addresses for logged-in user
// ============================================================

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

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        full_name,
        phone,
        country,
        state,
        city,
        postal_code,
        address_line1,
        address_line2,
        created_at
      FROM addresses
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return NextResponse.json({
      success: true,
      addresses: result.rows,
    });
  } catch (error) {
    console.error("GET Addresses Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch addresses",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST - Add new address
// ============================================================

export async function POST(req: NextRequest) {
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

    const body = await req.json();

    const {
      full_name,
      phone,
      country,
      state,
      city,
      postal_code,
      address_line1,
      address_line2,
    } = body;

    // --------------------------
    // Validate
    // --------------------------

    if (
      !full_name ||
      !phone ||
      !country ||
      !state ||
      !city ||
      !postal_code ||
      !address_line1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide complete address",
        },
        { status: 400 }
      );
    }

    // --------------------------
    // Check user
    // --------------------------

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

    // --------------------------
    // Insert
    // --------------------------

    const result = await pool.query(
      `
      INSERT INTO addresses
      (
        user_id,
        full_name,
        phone,
        country,
        state,
        city,
        postal_code,
        address_line1,
        address_line2
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      RETURNING
        id,
        user_id,
        full_name,
        phone,
        country,
        state,
        city,
        postal_code,
        address_line1,
        address_line2,
        created_at
      `,
      [
        userId,
        full_name,
        phone,
        country,
        state,
        city,
        postal_code,
        address_line1,
        address_line2 || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        address: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Address Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add address",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT - Update address
// ============================================================

export async function PUT(req: NextRequest) {
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

    const body = await req.json();

    const {
      id,
      full_name,
      phone,
      country,
      state,
      city,
      postal_code,
      address_line1,
      address_line2,
    } = body;

    // --------------------------
    // Validate ID
    // --------------------------

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Address ID is required",
        },
        { status: 400 }
      );
    }

    // --------------------------
    // Validate fields
    // --------------------------

    if (
      !full_name ||
      !phone ||
      !country ||
      !state ||
      !city ||
      !postal_code ||
      !address_line1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide complete address",
        },
        { status: 400 }
      );
    }

    // --------------------------
    // Check address belongs
    // to logged-in user
    // --------------------------

    const existingAddress = await pool.query(
      `
      SELECT id
      FROM addresses
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [id, userId]
    );

    if (existingAddress.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found",
        },
        { status: 404 }
      );
    }

    // --------------------------
    // Update
    // --------------------------

    const result = await pool.query(
      `
      UPDATE addresses
      SET
        full_name = $1,
        phone = $2,
        country = $3,
        state = $4,
        city = $5,
        postal_code = $6,
        address_line1 = $7,
        address_line2 = $8
      WHERE id = $9
        AND user_id = $10
      RETURNING
        id,
        user_id,
        full_name,
        phone,
        country,
        state,
        city,
        postal_code,
        address_line1,
        address_line2,
        created_at
      `,
      [
        full_name,
        phone,
        country,
        state,
        city,
        postal_code,
        address_line1,
        address_line2 || null,
        id,
        userId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      address: result.rows[0],
    });
  } catch (error) {
    console.error("PUT Address Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update address",
      },
      { status: 500 }
    );
  }
}
// ============================================================
// DELETE - Delete address
// ============================================================

export async function DELETE(req: NextRequest) {
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

    const body = await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Address ID is required",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // Check address belongs to logged-in user
    // ========================================================

    const addressResult = await pool.query(
      `
      SELECT id
      FROM addresses
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [id, userId]
    );

    if (addressResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found",
        },
        { status: 404 }
      );
    }

    // ========================================================
    // Check whether this address is used by an order
    // ========================================================

    const orderResult = await pool.query(
      `
      SELECT id, order_number
      FROM orders
      WHERE address_id = $1
      LIMIT 1
      `,
      [id]
    );

    if (orderResult.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This address cannot be deleted because it is already associated with an order.",
          order_number:
            orderResult.rows[0].order_number,
        },
        { status: 409 }
      );
    }

    // ========================================================
    // Delete address
    // ========================================================

    await pool.query(
      `
      DELETE FROM addresses
      WHERE id = $1
        AND user_id = $2
      `,
      [id, userId]
    );

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE Address Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete address",
      },
      { status: 500 }
    );
  }
}