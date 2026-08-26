import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

const SUCCESS_RESPONSE = {
  success: true,
  message: "If an account exists for that email, a password reset link has been sent.",
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const userResult = await pool.query(
      "SELECT id, full_name, email FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(SUCCESS_RESPONSE);
    }

    const user = userResult.rows[0] as { id: number; full_name: string | null; email: string };
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");

    if (!frontendUrl) {
      console.error("FRONTEND_URL is not configured for password reset links");
      return NextResponse.json(
        { success: false, message: "Password reset is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    await pool.query(
      `DELETE FROM password_reset_tokens
       WHERE user_id = $1 AND used_at IS NULL`,
      [user.id]
    );

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 minutes')`,
      [user.id, tokenHash]
    );

    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendPasswordResetEmail({
      customerEmail: user.email,
      customerName: user.full_name,
      resetUrl,
    });

    return NextResponse.json(SUCCESS_RESPONSE);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Password reset is temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
