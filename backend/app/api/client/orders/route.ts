import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const client = await pool.connect();
 
  try {

    const body = await req.json();

await client.query("BEGIN");

// ==========================
// Read Data
// ==========================

const {
  user_id,
  payment_method,
  address,
  items,
} = body;

console.log("Creating Order:", {
  user_id,
  total_items: items.length,
  payment_method,
});
if (!user_id) {
  throw new Error("User ID is required");
}

if (!address) {
  throw new Error("Address is required");
}

if (!Array.isArray(items)) {
  throw new Error("Invalid cart items");
}

if (items.length === 0) {
  throw new Error("Cart is empty");
}

if (!payment_method) {
  throw new Error("Payment method is required");
}
if (
  !address.full_name ||
  !address.phone ||
  !address.country ||
  !address.state ||
  !address.city ||
  !address.postal_code ||
  !address.address_line1
) {
  throw new Error("Please provide complete address");
}
// ==========================
// Validate User
// ==========================

const userResult = await client.query(
  `
  SELECT id
  FROM users
  WHERE id = $1
  `,
  [user_id]
);

if (userResult.rows.length === 0) {
  throw new Error("User not found");
}
// ==========================
// Validate Products
// ==========================

for (const item of items) {
    if (!item.product_id) {
  throw new Error("Product ID is required");
}

if (!item.quantity || item.quantity <= 0) {
  throw new Error("Invalid product quantity");
}

if (!item.size) {
  throw new Error("Product size is required");
}
  const productResult = await client.query(
    `
    SELECT
      id,
      name,
      stock,
      price,
      discount_price,
      shipping_cost,
      status,
      is_deleted
    FROM products
    WHERE id = $1
    `,
    [item.product_id]
  );

  if (productResult.rows.length === 0) {
    throw new Error(`Product ${item.product_id} not found`);
  }

  const product = productResult.rows[0];

  if (!product.status || product.is_deleted) {
    throw new Error(`${product.name} is unavailable`);
  }

  if (product.stock < item.quantity) {
    throw new Error(
      `Only ${product.stock} quantity available for ${product.name}`
    );
  }
}
// ==========================
// Insert Address
// ==========================

const addressResult = await client.query(
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
  RETURNING id
  `,
  [
    user_id,
    address.full_name,
    address.phone,
    address.country,
    address.state,
    address.city,
    address.postal_code,
    address.address_line1,
    address.address_line2,
  ]
);
const addressId = addressResult.rows[0].id;
// ==========================
// Calculate Total
// ==========================

let calculatedSubtotal = 0;
let calculatedShipping = 0;

for (const item of items) {
  const productResult = await client.query(
    `
    SELECT
      price,
      discount_price,
      shipping_cost
    FROM products
    WHERE id = $1
    `,
    [item.product_id]
  );

  const product = productResult.rows[0];

  const finalPrice = Number(
    product.discount_price || product.price
  );

  calculatedSubtotal += finalPrice * item.quantity;
  calculatedShipping += Number(product.shipping_cost || 0) * item.quantity;
}

const calculatedDiscount = 0;

const calculatedTotal =
  calculatedSubtotal +
  calculatedShipping -
  calculatedDiscount;


// ==========================
// Generate Order Number
// ==========================

const orderNumber =
  "ORD-" + Date.now();

// ==========================
// Insert Order
// ==========================

const orderResult = await client.query(
  `
 INSERT INTO orders
(
    order_number,
    user_id,
    address_id,
    subtotal,
    shipping_charge,
    discount,
    total,
    payment_method,
    payment_status,
    order_status
)
  VALUES
  (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
  )
  RETURNING id
  `,
[
  orderNumber,
  user_id,
  addressId,
  calculatedSubtotal,
  calculatedShipping,
  calculatedDiscount,
  calculatedTotal,
  payment_method,
  "Pending",
  "Placed",
]
);
const orderId = orderResult.rows[0].id;
// ==========================
// Insert Order Items
// ==========================

for (const item of items) {

  const productResult = await client.query(
    `
    SELECT
      price,
      discount_price
    FROM products
    WHERE id = $1
    `,
    [item.product_id]
  );

  const product = productResult.rows[0];
  

  const finalPrice = Number(
    product.discount_price || product.price
  );

  await client.query(
    `
    INSERT INTO order_items
    (
      order_id,
      product_id,
      quantity,
      size,
      price
    )
    VALUES
    (
      $1,$2,$3,$4,$5
    )
    `,
    [
      orderId,
      item.product_id,
      item.quantity,
      item.size,
      finalPrice,
    ]
  );

  const updateResult = await client.query(
    `
    UPDATE products
    SET stock = stock - $1
    WHERE id = $2
      AND stock >= $1
    RETURNING id
    `,
    [
      item.quantity,
      item.product_id,
    ]
  );

  if (updateResult.rows.length === 0) {
    throw new Error("Insufficient stock");
  }

}
await client.query("COMMIT");

return NextResponse.json({
  success: true,
  message: "Order Created Successfully",
  order: {
    id: orderId,
    order_number: orderNumber,
    subtotal: calculatedSubtotal,
    shipping: calculatedShipping,
    discount: calculatedDiscount,
    total: calculatedTotal,
    payment_status: "Pending",
    order_status: "Placed",
  },
});

} catch (error) {

  await client.query("ROLLBACK");

  console.error(error);

  return NextResponse.json(
    {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Transaction Failed",
    },
    {
      status: 500,
    }
  );

} finally {

  client.release();

}

}

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
      FROM public.orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    return NextResponse.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Orders GET API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
