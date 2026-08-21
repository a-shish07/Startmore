import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥🔥 SHIPPING LABEL API REACHED 🔥🔥");

  try {
    const { id } = await params;

    console.log("📄 Order ID:", id);
    // ==========================================
    // GET ORDER + CUSTOMER + ADDRESS
    // ==========================================

    const orderResult = await pool.query(
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
        o.created_at,

        u.full_name AS customer_name,
        u.email AS customer_email,

        a.full_name AS shipping_name,
        a.phone AS shipping_phone,
        a.country,
        a.state,
        a.city,
        a.postal_code,
        a.address_line1,
        a.address_line2

      FROM orders o

      INNER JOIN users u
        ON o.user_id = u.id

      INNER JOIN addresses a
        ON o.address_id = a.id

      WHERE o.id = $1

      LIMIT 1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const order = orderResult.rows[0];

    // ==========================================
    // GET ORDER ITEMS
    // ==========================================

    const itemsResult = await pool.query(
      `
      SELECT
        oi.quantity,
        oi.size,
        oi.price,
        p.name AS product_name

      FROM order_items oi

      INNER JOIN products p
        ON oi.product_id = p.id

      WHERE oi.order_id = $1

      ORDER BY oi.id ASC
      `,
      [id]
    );

    const items = itemsResult.rows;

    // ==========================================
    // CREATE 4 x 6 INCH PDF
    // ==========================================

    const doc = new PDFDocument({
      size: [288, 432],
      margins: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    const pdfPromise = new Promise<Buffer>(
      (resolve, reject) => {
        doc.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);
      }
    );

    // ==========================================
    // HEADER
    // ==========================================

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("SR ARTÉMORE", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .fontSize(9)
      .font("Helvetica")
      .text("SHIPPING LABEL", {
        align: "center",
      });

    doc.moveDown();

    doc
      .moveTo(20, doc.y)
      .lineTo(268, doc.y)
      .stroke();

    doc.moveDown();

    // ==========================================
    // SHIP TO
    // ==========================================

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("SHIP TO");

    doc.moveDown(0.3);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(
        order.shipping_name ||
          order.customer_name ||
          "Customer"
      );

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(order.address_line1 || "");

    if (order.address_line2) {
      doc.text(order.address_line2);
    }

    doc.text(
      `${order.city || ""}, ${order.state || ""}`
    );

    doc.text(
      `${order.country || ""} - ${
        order.postal_code || ""
      }`
    );

    if (order.shipping_phone) {
      doc.text(
        `Phone: ${order.shipping_phone}`
      );
    }

    doc.moveDown();

    doc
      .moveTo(20, doc.y)
      .lineTo(268, doc.y)
      .stroke();

    doc.moveDown();

    // ==========================================
    // ORDER INFORMATION
    // ==========================================

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("ORDER INFORMATION");

    doc.moveDown(0.3);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `Order: ${order.order_number}`
      );

    doc.text(
      `Payment: ${order.payment_status}`
    );

    doc.text(
      `Status: ${order.order_status}`
    );

    doc.text(
      `Items: ${items.length}`
    );

    doc.moveDown();

    // ==========================================
    // ITEMS
    // ==========================================

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("ITEMS");

    doc.moveDown(0.3);

    items.forEach((item) => {
      const sizeText = item.size
        ? ` | Size: ${item.size}`
        : "";

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(
          `${item.product_name}${sizeText}`
        );

      doc.text(
        `Qty: ${item.quantity}   Price: £${Number(
          item.price
        ).toFixed(2)}`
      );

      doc.moveDown(0.3);
    });

    doc.moveDown();

    // ==========================================
    // TOTAL
    // ==========================================

    doc
      .moveTo(20, doc.y)
      .lineTo(268, doc.y)
      .stroke();

    doc.moveDown();

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text(
        `TOTAL: £${Number(
          order.total
        ).toFixed(2)}`,
        {
          align: "right",
        }
      );

    doc.moveDown();

    // ==========================================
    // FOOTER
    // ==========================================

    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        "Thank you for shopping with SR Artémore.",
        {
          align: "center",
        }
      );

    doc.moveDown(0.5);

    doc
      .fontSize(7)
      .text(
        `Generated for Order ${order.order_number}`,
        {
          align: "center",
        }
      );

    // ==========================================
    // FINISH PDF
    // ==========================================

    doc.end();

    const pdfBuffer = await pdfPromise;

    console.log(
      "✅ Shipping label generated:",
      order.order_number
    );

    // ==========================================
    // RETURN PDF
    // ==========================================

    return new NextResponse(
      new Uint8Array(pdfBuffer),
      {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",

          "Content-Disposition": `attachment; filename="shipping-label-${order.order_number}.pdf"`,

          "Content-Length":
            pdfBuffer.length.toString(),
        },
      }
    );
  } catch (error) {
    console.error(
      "❌ Shipping Label PDF Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate shipping label",
      },
      {
        status: 500,
      }
    );
  }
}