import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaEye,
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "../../styles/admin-orders.css";

const API_URL = import.meta.env.VITE_API_URL;

/* ==========================================
   CONSTANTS
========================================== */

const ORDERS_PER_PAGE = 15;

/* ==========================================
   INTERFACE
========================================== */

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
}

/* ==========================================
   COMPONENT
========================================== */

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* ==========================================
     PAGINATION STATE
  ========================================== */

  const [currentPage, setCurrentPage] = useState(1);

  /* ==========================================
     FETCH ORDERS
  ========================================== */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/orders`
      );

      const data = await response.json();

      console.log("Orders API Response:", data);

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(
          data.message || "Failed to load orders."
        );
      }
    } catch (err) {
      console.error("Orders fetch error:", err);

      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

/* ==========================================
   FILTER ORDERS
========================================== */

/* ==========================================
   FILTER ORDERS
========================================== */

const searchText = search.trim().toLowerCase();

const filteredOrders = orders.filter((order) => {
  if (!searchText) {
    return true;
  }

  const orderNumber = String(
    order.order_number || ""
  ).toLowerCase();

  const customerName = String(
    order.customer_name || ""
  ).toLowerCase();

  const customerEmail = String(
    order.customer_email || ""
  ).toLowerCase();

  const paymentStatus = String(
    order.payment_status || ""
  ).toLowerCase();

  const orderStatus = String(
    order.order_status || ""
  ).toLowerCase();

  const paymentMethod = String(
    order.payment_method || ""
  ).toLowerCase();

  return (
    orderNumber.includes(searchText) ||
    customerName.includes(searchText) ||
    customerEmail.includes(searchText) ||
    paymentStatus.includes(searchText) ||
    orderStatus.includes(searchText) ||
    paymentMethod.includes(searchText)
  );
});

  /* ==========================================
     PAGINATION CALCULATIONS
  ========================================== */

  const totalOrders = filteredOrders.length;

  const totalPages = Math.ceil(
    totalOrders / ORDERS_PER_PAGE
  );

  /*
    Example:

    Page 1
    0 - 14

    Page 2
    15 - 29

    Page 3
    30 - 44
  */

  const startIndex =
    (currentPage - 1) * ORDERS_PER_PAGE;

  const endIndex =
    startIndex + ORDERS_PER_PAGE;

  const paginatedOrders =
    filteredOrders.slice(
      startIndex,
      endIndex
    );

  /* ==========================================
     RESET PAGE WHEN SEARCH CHANGES
  ========================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ==========================================
     PROTECT CURRENT PAGE
  ========================================== */

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ==========================================
     PAGINATION BUTTONS
  ========================================== */

  const getPaginationPages = () => {
    const pages: (
      | number
      | "ellipsis-left"
      | "ellipsis-right"
    )[] = [];

    /*
      If pages are small, show everything.

      Example:
      1 2 3 4 5
    */

    if (totalPages <= 7) {
      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pages.push(page);
      }

      return pages;
    }

    /*
      Beginning

      1 2 3 ... 20
    */

    if (currentPage <= 4) {
      pages.push(1);
      pages.push(2);
      pages.push(3);
      pages.push(4);
      pages.push(5);
      pages.push("ellipsis-right");
      pages.push(totalPages);

      return pages;
    }

    /*
      Ending

      1 ... 18 19 20
    */

    if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("ellipsis-left");
      pages.push(totalPages - 4);
      pages.push(totalPages - 3);
      pages.push(totalPages - 2);
      pages.push(totalPages - 1);
      pages.push(totalPages);

      return pages;
    }

    /*
      Middle

      1 ... 7 8 9 ... 20
    */

    pages.push(1);

    pages.push("ellipsis-left");

    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);

    pages.push("ellipsis-right");

    pages.push(totalPages);

    return pages;
  };

  /* ==========================================
     DOWNLOAD SHIPPING LABEL
  ========================================== */

  const downloadShippingLabel = async (
    orderId: number
  ) => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/shipping-label`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate shipping label."
        );
      }

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `shipping-label-${orderId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage(
        "Shipping label downloaded successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Shipping label error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to download shipping label."
      );
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="page-loading">
        Loading Orders...
      </div>
    );
  }

  /* ==========================================
     UI
  ========================================== */

  return (
    <div className="order-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="page-header">

        <div>
          <h2>Orders</h2>

          <p>
            Manage customer orders here.
          </p>
        </div>

        {/* TOTAL */}

        <div className="order-total-count">
          <strong>
            {totalOrders}
          </strong>

          <span>
            {search
              ? "Matching Orders"
              : "Total Orders"}
          </span>
        </div>

      </div>

      {/* ==========================================
          MESSAGES
      ========================================== */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ==========================================
          SEARCH
      ========================================== */}

      <div className="search-bar">

        <FaSearch />

        <input
          type="text"
          placeholder="Search order, customer or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ==========================================
          RESULT INFORMATION
      ========================================== */}

      {totalOrders > 0 && (
        <div className="pagination-info-top">

          <span>
            Showing{" "}
            <strong>
              {startIndex + 1}
            </strong>
            {" – "}
            <strong>
              {Math.min(
                endIndex,
                totalOrders
              )}
            </strong>{" "}
            of{" "}
            <strong>
              {totalOrders}
            </strong>{" "}
            orders
          </span>

        </div>
      )}

      {/* ==========================================
          DESKTOP TABLE
      ========================================== */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Order</th>

              <th>Customer</th>

              <th>Email</th>

              <th>Total</th>

              <th>Payment</th>

              <th>Status</th>

              <th>Method</th>

              <th>Date</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {paginatedOrders.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  className="empty"
                >
                  No orders found.
                </td>

              </tr>

            ) : (

              paginatedOrders.map(
                (order) => (

                  <tr key={order.id}>

                    {/* ORDER */}

                    <td>

                      <strong>
                        {order.order_number}
                      </strong>

                      <br />

                      <small>
                        ID: {order.id}
                      </small>

                    </td>

                    {/* CUSTOMER */}

                    <td>
                      {order.customer_name ||
                        "N/A"}
                    </td>

                    {/* EMAIL */}

                    <td>
                      {order.customer_email ||
                        "N/A"}
                    </td>

                    {/* TOTAL */}

                    <td>

                      £
                      {Number(
                        order.total || 0
                      ).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}

                    </td>

                    {/* PAYMENT */}

                    <td>

                      <span
                        className={
                          order.payment_status ===
                          "Paid"
                            ? "badge active"
                            : "badge inactive"
                        }
                      >
                        {order.payment_status ||
                          "Pending"}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          order.order_status ===
                          "Delivered"
                            ? "badge active"
                            : "badge inactive"
                        }
                      >
                        {order.order_status ||
                          "Placed"}
                      </span>

                    </td>

                    {/* PAYMENT METHOD */}

                    <td>
                      {order.payment_method ||
                        "N/A"}
                    </td>

                    {/* DATE */}

                    <td>

                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleDateString()
                        : "N/A"}

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">

                        {/* VIEW */}

                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="view-btn"
                          title="View Order"
                        >
                          <FaEye />
                        </Link>

                        {/* PDF */}

                        <button
                          className="pdf-btn"
                          title="Download Shipping Label"
                          onClick={() =>
                            downloadShippingLabel(
                              order.id
                            )
                          }
                        >
                          <FaFilePdf />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

      {/* ==========================================
          MOBILE CARDS
      ========================================== */}

      <div className="mobile-cards">

        {paginatedOrders.length === 0 ? (

          <div className="empty">
            No orders found.
          </div>

        ) : (

          paginatedOrders.map(
            (order) => (

              <div
                className="mobile-card"
                key={order.id}
              >

                <div className="mobile-content">

                  <h3>
                    {order.order_number}
                  </h3>

                  <p>
                    <strong>
                      Order ID:
                    </strong>{" "}
                    {order.id}
                  </p>

                  <p>
                    <strong>
                      Customer:
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

                  <p>
                    <strong>
                      Total:
                    </strong>{" "}
                    £
                    {Number(
                      order.total || 0
                    ).toLocaleString()}
                  </p>

                  <p>
                    <strong>
                      Payment:
                    </strong>{" "}

                    <span
                      className={
                        order.payment_status ===
                        "Paid"
                          ? "badge active"
                          : "badge inactive"
                      }
                    >
                      {order.payment_status ||
                        "Pending"}
                    </span>

                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}

                    <span
                      className={
                        order.order_status ===
                        "Delivered"
                          ? "badge active"
                          : "badge inactive"
                      }
                    >
                      {order.order_status ||
                        "Placed"}
                    </span>

                  </p>

                  <p>
                    <strong>
                      Payment Method:
                    </strong>{" "}
                    {order.payment_method ||
                      "N/A"}
                  </p>

                  <p>
                    <strong>
                      Date:
                    </strong>{" "}

                    {order.created_at
                      ? new Date(
                          order.created_at
                        ).toLocaleDateString()
                      : "N/A"}

                  </p>

                </div>

                {/* MOBILE ACTIONS */}

                <div className="card-actions">

                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="view-btn"
                    title="View Order"
                  >
                    <FaEye />
                  </Link>

                  <button
                    className="pdf-btn"
                    title="Download Shipping Label"
                    onClick={() =>
                      downloadShippingLabel(
                        order.id
                      )
                    }
                  >
                    <FaFilePdf />
                  </button>

                </div>

              </div>
            )
          )

        )}

      </div>

      {/* ==========================================
          MODERN PAGINATION
      ========================================== */}

      {totalPages > 1 && (

        <div className="pagination-container">

          {/* PREVIOUS */}

          <button
            className="pagination-arrow"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                (page) => page - 1
              )
            }
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>

          {/* PAGE NUMBERS */}

          <div className="pagination-pages">

            {getPaginationPages().map(
              (page, index) => {

                if (
                  page ===
                    "ellipsis-left" ||
                  page ===
                    "ellipsis-right"
                ) {
                  return (
                    <span
                      key={`${page}-${index}`}
                      className="pagination-ellipsis"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    className={`pagination-page ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                  >
                    {page}
                  </button>
                );
              }
            )}

          </div>

          {/* NEXT */}

          <button
            className="pagination-arrow"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (page) => page + 1
              )
            }
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>

        </div>

      )}

    </div>
  );
};

export default OrderList;