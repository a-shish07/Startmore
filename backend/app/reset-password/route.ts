import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (typeof token !== "string" || token.length !== 64) {
      return NextResponse.json(
        { success: false, message: "This password reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const tokenResult = await client.query(
        `SELECT id, user_id
         FROM password_reset_tokens
         WHERE token_hash = $1
           AND used_at IS NULL
           AND expires_at > NOW()
         FOR UPDATE`,
        [tokenHash]
      );

      if (tokenResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, message: "This password reset link is invalid or has expired." },
          { status: 400 }
        );
      }

      const resetToken = tokenResult.rows[0] as { id: number; user_id: number };
      const passwordHash = await bcrypt.hash(password, 10);

      await client.query("UPDATE users SET password = $1 WHERE id = $2", [passwordHash, resetToken.user_id]);
      await client.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1", [resetToken.id]);
      await client.query(
        "DELETE FROM password_reset_tokens WHERE user_id = $1 AND id <> $2",
        [resetToken.user_id, resetToken.id]
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true, message: "Your password has been reset. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Password reset is temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
