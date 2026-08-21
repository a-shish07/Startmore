import { NextResponse } from "next/server";
import { sendAdminTestEmail } from "@/lib/email";

export async function GET() {
  try {
    const result = await sendAdminTestEmail();

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result,
    });
  } catch (error) {
    console.error("Test Email Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send test email",
      },
      {
        status: 500,
      }
    );
  }
}