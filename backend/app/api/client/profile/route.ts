// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const userId = req.headers.get("x-user-id");

//     if (!userId) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User ID is required",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     const result = await pool.query(
//       `
//       SELECT
//         id,
//         full_name,
//         email,
//         role,
//         created_at
//       FROM users
//       WHERE id = $1
//       LIMIT 1
//       `,
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     const user = result.rows[0];

//     return NextResponse.json({
//       success: true,
//       user: {
//         id: user.id,
//         name: user.full_name,
//         email: user.email,
//         role: user.role,
//         joined: user.created_at,
//       },
//     });
//   } catch (error) {
//     console.error("Profile API Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch user profile",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

/* =========================================================
   GET PROFILE
   GET /api/client/profile
========================================================= */

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        {
          status: 401,
        }
      );
    }

    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
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

    const user = result.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        joined: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profile GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user profile",
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================================
   PUT PROFILE
   PUT /api/client/profile

   Updates:
   - Full Name
   - Email
   - Password
========================================================= */

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const {
      name,
      email,
      newPassword,
      confirmPassword,
    } = body;

    /* =====================================================
       Validate User
    ===================================================== */

    const userResult = await pool.query(
      `
      SELECT
        id,
        email
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
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       UPDATE NAME + EMAIL
    ===================================================== */

    if (name !== undefined || email !== undefined) {
      const finalName =
        name !== undefined
          ? String(name).trim()
          : undefined;

      const finalEmail =
        email !== undefined
          ? String(email).trim().toLowerCase()
          : undefined;

      if (finalName !== undefined && !finalName) {
        return NextResponse.json(
          {
            success: false,
            message: "Full name is required",
          },
          {
            status: 400,
          }
        );
      }

      if (finalEmail !== undefined && !finalEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "Email is required",
          },
          {
            status: 400,
          }
        );
      }

      /* Check duplicate email */

      if (finalEmail) {
        const emailResult = await pool.query(
          `
          SELECT id
          FROM users
          WHERE email = $1
            AND id <> $2
          LIMIT 1
          `,
          [finalEmail, userId]
        );

        if (emailResult.rows.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message: "Email address is already in use",
            },
            {
              status: 409,
            }
          );
        }
      }

      await pool.query(
        `
        UPDATE users
        SET
          full_name = COALESCE($1, full_name),
          email = COALESCE($2, email)
        WHERE id = $3
        `,
        [
          finalName || null,
          finalEmail || null,
          userId,
        ]
      );
    }

    /* =====================================================
       CHANGE PASSWORD
       NO CURRENT PASSWORD REQUIRED
    ===================================================== */

    if (newPassword !== undefined) {
      if (!newPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "New password is required",
          },
          {
            status: 400,
          }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "Password must be at least 6 characters",
          },
          {
            status: 400,
          }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Passwords do not match",
          },
          {
            status: 400,
          }
        );
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      await pool.query(
        `
        UPDATE users
        SET password = $1
        WHERE id = $2
        `,
        [
          hashedPassword,
          userId,
        ]
      );
    }

    /* =====================================================
       GET UPDATED USER
    ===================================================== */

    const updatedResult = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [userId]
    );

    const updatedUser = updatedResult.rows[0];

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        joined: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error("Profile PUT Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}