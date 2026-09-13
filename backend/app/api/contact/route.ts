import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!name || !emailPattern.test(email) || !subject || !message || name.length > 120 || subject.length > 160 || message.length > 4000 || phone.length > 50) {
      return NextResponse.json({ success: false, message: "Please provide a valid name, email, subject and message." }, { status: 400 });
    }
    await sendContactEmails({ name, email, phone, subject, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ success: false, message: "We could not send your message right now. Please try again shortly." }, { status: 500 });
  }
}
