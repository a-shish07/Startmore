import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaFilePdf,
} from "react-icons/fa";

import "../../styles/admin-order-details.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  size: string | null;
  price: number;
}

interface Order {
  id: number;
  order_number: string;

  customer_name: string | null;
  customer_email: string | null;

  subtotal: number;
  shipping_charge: number;
  discount: number;
  total: number;

  payment_method: string | null;
  payment_status: string | null;
  order_status: string | null;

  tracking_number: string | null;
  courier: string | null;

  created_at: string;

  shipping_name: string | null;
  shipping_phone: string | null;

  country: string | null;
  state: string | null;
  city: string | null;
  postal_code: string | null;

  address_line1: string | null;
  address_line2: string | null;

  items: OrderItem[];
}

const OrderDetails = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================
     FETCH ORDER DETAILS
  ========================================== */

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/admin/orders/${id}`
        );

        const data = await response.json();

        console.log(
          "Order Details API:",
          data
        );

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch order"
          );
        }

        setOrder(data.order);
      } catch (err) {
        console.error(
          "Order Details Error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  /* ==========================================
     DOWNLOAD SHIPPING LABEL
  ========================================== */

  const downloadShippingLabel = async () => {
    if (!id) return;

    try {
      const response = await fetch(
        `${API_URL}/api/admin/orders/${id}/shipping-label`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate shipping label"
        );
      }

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `shipping-label-${
          order?.order_number || id
        }.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(
        "Shipping Label Error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to download shipping label"
      );
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="page-loading">
        Loading order...
      </div>
    );
  }

  /* ==========================================
     ERROR
  ========================================== */

  if (error) {
    return (
      <div className="order-details-page">

        <Link
          to="/admin/orders"
          className="back-btn"
        >
          <FaArrowLeft />
          Back to Orders
        </Link>

        <div className="error-message">
          {error}
        </div>

      </div>
    );
  }

  /* ==========================================
     ORDER NOT FOUND
  ========================================== */

  if (!order) {
    return (
      <div className="order-details-page">

        <Link
          to="/admin/orders"
          className="back-btn"
        >
          <FaArrowLeft />
          Back to Orders
        </Link>

        <p>
          Order not found.
        </p>

      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="order-details-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="details-header">

        <div>

          <Link
            to="/admin/orders"
            className="back-btn"
          >
            <FaArrowLeft />
            Back to Orders
          </Link>

          <h1>
            {order.order_number}
          </h1>

          <p>
            Order ID: #{order.id}
          </p>

          <p>
            {new Date(
              order.created_at
            ).toLocaleString()}
          </p>

        </div>

        <button
          className="pdf-btn-large"
          onClick={
            downloadShippingLabel
          }
        >
          <FaFilePdf />
          Download Shipping Label
        </button>

      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="details-grid">

        {/* CUSTOMER */}

        <div className="details-card">

          <h3>
            Customer
          </h3>

          <p>
            <strong>
              Name:
            </strong>{" "}
            {order.customer_name ||
              "N/A"}
          </p>

          <p>
            <strong>
              Email:
            </strong>{" "}
            {order.customer_email ||
              "N/A"}
          </p>

        </div>

        {/* PAYMENT */}

        <div className="details-card">

          <h3>
            Payment
          </h3>

          <p>
            <strong>
              Method:
            </strong>{" "}
            {order.payment_method ||
              "N/A"}
          </p>

          <p>
            <strong>
              Status:
            </strong>{" "}
            {order.payment_status ||
              "Pending"}
          </p>

        </div>

        {/* ORDER STATUS */}

        <div className="details-card">

          <h3>
            Order Status
          </h3>

          <p>
            {order.order_status ||
              "Placed"}
          </p>

        </div>

      </div>

      {/* ======================================
          SHIPPING ADDRESS
      ====================================== */}

      <div className="details-card">

        <h3>
          Shipping Address
        </h3>

        <p>
          <strong>
            {order.shipping_name ||
              order.customer_name ||
              "N/A"}
          </strong>
        </p>

        <p>
          {order.address_line1}
        </p>

        {order.address_line2 && (
          <p>
            {order.address_line2}
          </p>
        )}

        <p>
          {order.city},{" "}
          {order.state}
        </p>

        <p>
          {order.country} -{" "}
          {order.postal_code}
        </p>

        <p>
          Phone:{" "}
          {order.shipping_phone ||
            "N/A"}
        </p>

      </div>

      {/* ======================================
          ORDER ITEMS
      ====================================== */}

      <div className="details-card">

        <h3>
          Order Items
        </h3>

        <div className="items-table">

          <table>

            <thead>

              <tr>
                <th>
                  Product
                </th>

                <th>
                  Size
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Price
                </th>

                <th>
                  Total
                </th>
              </tr>

            </thead>

            <tbody>

              {order.items?.map(
                (item) => (

                  <tr
                    key={item.id}
                  >

                    <td>
                      {item.product_name}
                    </td>

                    <td>
                      {item.size ||
                        "N/A"}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      £
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </td>

                    <td>
                      £
                      {(
                        Number(
                          item.price
                        ) *
                        item.quantity
                      ).toFixed(2)}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ======================================
          TOTAL
      ====================================== */}

      <div className="details-card order-total-card">

        <p>
          <span>
            Subtotal
          </span>

          <strong>
            £
            {Number(
              order.subtotal
            ).toFixed(2)}
          </strong>
        </p>

        <p>
          <span>
            Shipping
          </span>

          <strong>
            £
            {Number(
              order.shipping_charge
            ).toFixed(2)}
          </strong>
        </p>

        <p>
          <span>
            Discount
          </span>

          <strong>
            £
            {Number(
              order.discount
            ).toFixed(2)}
          </strong>
        </p>

        <hr />

        <p className="grand-total">

          <span>
            Total
          </span>

          <strong>
            £
            {Number(
              order.total
            ).toFixed(2)}
          </strong>

        </p>

      </div>

    </div>
  );
};

export default OrderDetails;