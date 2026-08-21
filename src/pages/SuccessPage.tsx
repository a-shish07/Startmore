// type Page =
//   | "home"
//   | "products"
//   | "detail"
//   | "cart"
//   | "checkout"
//   | "success"
//   | "about"
//   | "contact"
//   | "favorites";

// interface SuccessPageProps {
//   onNavigate: (page: Page) => void;
// }

// export default function SuccessPage({ onNavigate }: SuccessPageProps) {
//   const orderNum = `SR-${Math.floor(100000 + Math.random() * 900000)}`;

//   return (
//     <div className="success-page">

//       {/* ✅ ICON */}
//       <div className="success-icon">✓</div>

//       {/* ✅ TITLE */}
//       <h1>Order Confirmed</h1>

//       <p>
//         Thank you for your order. Your items are now being prepared with care.
//       </p>

//       {/* ✅ ORDER BOX */}
//       <div className="order-box">
//         <p><strong>Order ID:</strong> #{orderNum}</p>
//         <p><strong>Estimated Delivery:</strong> 3–5 business days</p>
//       </div>

//       <p style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-muted)" }}>
//         A confirmation email has been sent with your order details.
//       </p>

//       {/* ✅ ACTION BUTTONS */}
//       {/* ✅ ACTION BUTTONS */}
//       <div className="success-actions">
//         <button
//           className="btn-primary-new"
//           onClick={() => onNavigate("products")}
//         >
//           <span>Continue Shopping</span>
//         </button>

//         <button
//           className="btn-link"
//           onClick={() => onNavigate("home")}
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Page =
  | "home"
  | "products"
  | "detail"
  | "cart"
  | "checkout"
  | "success"
  | "about"
  | "contact"
  | "favorites";

interface SuccessPageProps {
  onNavigate: (page: Page) => void;
}

interface OrderItem {
  id: number;
  quantity: number;
  size: string;
  price: number;
  name: string;
  image_url: string | null;
}

interface Order {
  id: number;
  order_number: string;
  payment_status: string;
  order_status: string;
  payment_method: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export default function SuccessPage({
  onNavigate,
}: SuccessPageProps) {

  const [loading, setLoading] = useState(true);

  const [order, setOrder] =
    useState<Order | null>(null);

  useEffect(() => {

    const orderId =
      localStorage.getItem("lastOrderId");

    if (!orderId) {

      setLoading(false);

      return;

    }

    fetch(`${API_URL}/api/client/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {

          setOrder(data.order);

        }

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);

  if (loading) {

    return (

      <div className="success-page">

        <h2>

          Loading Order...

        </h2>

      </div>

    );

  }

  if (!order) {

    return (

      <div className="success-page">

        <h2>

          Order Not Found

        </h2>

        <button
          className="checkout-btn"
          onClick={() => onNavigate("products")}
        >

          Continue Shopping

        </button>

      </div>

    );

  }

  return (

    <div className="success-page">

      <div className="success-icon">

        ✓

      </div>

      <h1>

        Order Confirmed

      </h1>

      <p>

        Thank you for shopping with
        SR Artémore.

      </p>

      <div className="order-box">

        <div className="summary-row">

          <span>Order Number</span>

          <strong>

            {order.order_number}

          </strong>

        </div>

        <div className="summary-row">

          <span>Payment Status</span>

          <strong>

            {order.payment_status}

          </strong>

        </div>

        <div className="summary-row">

          <span>Order Status</span>

          <strong>

            {order.order_status}

          </strong>

        </div>

        <div className="summary-row">

          <span>Payment Method</span>

          <strong>

            {order.payment_method}

          </strong>

        </div>

        <div className="summary-row">

          <span>Total Paid</span>

          <strong>

            £{Number(order.total).toFixed(2)}

          </strong>

        </div>

        <div className="summary-row">

          <span>Estimated Delivery</span>

          <strong>

            3–5 Business Days

          </strong>

        </div>

      </div>

      <div
        style={{
          marginTop: 30,
        }}
      >

        <h3>

          Ordered Items

        </h3>

        {order.items.map((item) => (

          <div
            key={item.id}
            className="order-item"
          >

            <div className="item-image">

              <img
                src={
                  item.image_url
                    ? `${API_URL}${item.image_url}`
                    : "/placeholder.png"
                }
                alt={item.name}
              />

            </div>

            <div className="item-info">

              <h4>

                {item.name}

              </h4>

              <p>

                Size : {item.size}

              </p>

              <p>

                Qty : {item.quantity}

              </p>

            </div>

            <strong>

              £
              {(
                Number(item.price) *
                item.quantity
              ).toFixed(2)}

            </strong>

          </div>

        ))}

      </div>

      <div
        style={{
          marginTop: 25,
          padding: 20,
          background: "#fafafa",
          borderRadius: 10,
        }}
      >

        Your payment has been received.

        <br />

        Your order is now being prepared.

      </div>

      <div className="success-actions">

        <button
          className="btn-primary-new"
          onClick={() =>
            onNavigate("products")
          }
        >

          Continue Shopping

        </button>

        <button
          className="btn-link"
          onClick={() =>
            onNavigate("home")
          }
        >

          Back to Home

        </button>

      </div>

    </div>

  );

}