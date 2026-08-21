import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaEye,
  FaEllipsisH,
  FaClock,
  FaCogs,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "../../styles/admin-dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
}

interface RecentOrder {
  id: number;
  order_number?: string;
  total?: number | string;
  payment_method?: string;
  payment_status?: string;
  order_status?: string;
  created_at?: string;

  customer_name?: string;
  customer_email?: string;

  item_count?: number;
  first_product_name?: string | null;
}

interface OrderSummary {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

const AdminDashboard = () => {
  const [stats, setStats] =
    useState<DashboardStats>({
      total_products: 0,
      total_orders: 0,
      total_customers: 0,
      total_revenue: 0,
    });

  const [recentOrders, setRecentOrders] =
    useState<RecentOrder[]>([]);

  const [orderSummary, setOrderSummary] =
    useState<OrderSummary>({
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/dashboard`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load dashboard"
        );
      }

      setStats(
        data.stats || {
          total_products: 0,
          total_orders: 0,
          total_customers: 0,
          total_revenue: 0,
        }
      );

      setRecentOrders(
        data.recent_orders || []
      );

      setOrderSummary(
        data.order_summary || {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        }
      );
    } catch (error) {
      console.error(
        "Dashboard fetch error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="page-loading">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">
          {error}
        </div>

        <button
          type="button"
          onClick={loadDashboard}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // STAT CARDS
  // ==========================================

  const statsCards = [
    {
      title: "Total Products",
      value: stats.total_products,
      icon: <FaBoxOpen />,
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: <FaShoppingCart />,
    },
    {
      title: "Customers",
      value: stats.total_customers,
      icon: <FaUsers />,
    },
    {
      title: "Total Revenue",
      value: `£${Number(
        stats.total_revenue
      ).toFixed(2)}`,
      icon: <FaDollarSign />,
    },
  ];

  // ==========================================
  // ORDER STATUS
  // ==========================================

  const orderStatus = [
    {
      title: "Pending",
      count: orderSummary.pending,
      icon: <FaClock />,
      className: "pending",
    },
    {
      title: "Processing",
      count: orderSummary.processing,
      icon: <FaCogs />,
      className: "processing",
    },
    {
      title: "Shipped",
      count: orderSummary.shipped,
      icon: <FaTruck />,
      className: "shipped",
    },
    {
      title: "Delivered",
      count: orderSummary.delivered,
      icon: <FaCheckCircle />,
      className: "delivered",
    },
    {
      title: "Cancelled",
      count: orderSummary.cancelled,
      icon: <FaTimesCircle />,
      className: "cancelled",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, Administrator
          </p>
        </div>

        <button
          type="button"
          className="dashboard-more-btn"
          onClick={loadDashboard}
          title="Refresh dashboard"
        >
          <FaEllipsisH />
        </button>

      </div>


      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="dashboard-stats">

        {statsCards.map(
          (stat, index) => (

            <div
              className="dashboard-stat-card"
              key={index}
            >

              <div className="stat-card-top">

                <div className="stat-icon">
                  {stat.icon}
                </div>

                <span className="stat-menu">
                  <FaEllipsisH />
                </span>

              </div>


              <div className="stat-content">

                <p>
                  {stat.title}
                </p>

                <h2>
                  {stat.value}
                </h2>

              </div>

            </div>
          )
        )}

      </div>


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="dashboard-content-grid">


        {/* ======================================
            RECENT ORDERS
        ====================================== */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>
                Recent Orders
              </h3>

              <p>
                Latest customer orders
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="view-all-btn"
            >
              View All
            </Link>

          </div>


          <div className="dashboard-table-wrapper">

            {recentOrders.length === 0 ? (

              <div className="empty">
                No orders found.
              </div>

            ) : (

              <table className="dashboard-orders-table">

                <thead>

                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>

                </thead>


                <tbody>

                  {recentOrders.map(
                    (order) => (

                      <tr key={order.id}>

                        {/* ORDER */}

                        <td>
                          <strong>
                            {order.order_number ||
                              `ORD-${order.id}`}
                          </strong>
                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <div className="customer-cell">

                            <div className="customer-avatar">

                              {(
                                order.customer_name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <span>
                              {order.customer_name ||
                                "Unknown"}
                            </span>

                          </div>

                        </td>


                        {/* PRODUCT */}

                        <td>

                          {order.first_product_name ||
                            "Multiple items"}

                        </td>


                        {/* QTY */}

                        <td>
                          x
                          {order.item_count || 0}
                        </td>


                        {/* TOTAL */}

                        <td>

                          <strong>
                            £
                            {Number(
                              order.total || 0
                            ).toFixed(2)}
                          </strong>

                        </td>


                        {/* PAYMENT */}

                        <td>

                          <span className="payment-status">

                            {order.payment_status ||
                              "Pending"}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`order-status ${
                              (
                                order.order_status ||
                                "pending"
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`}
                          >

                            {order.order_status ||
                              "Pending"}

                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleDateString()
                            : "N/A"}

                        </td>


                        {/* VIEW */}

                        <td>

                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="order-view-btn"
                            title="View Order"
                          >
                            <FaEye />
                          </Link>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>


        {/* ======================================
            ORDER SUMMARY
        ====================================== */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h3>
                Order Summary
              </h3>

              <p>
                Current order status
              </p>

            </div>

          </div>


          <div className="summary-list">

            {orderStatus.map(
              (item) => (

                <div
                  className="summary-item"
                  key={item.title}
                >

                  <div className="summary-info">

                    <span
                      className={`summary-dot ${item.className}`}
                    />

                    <span className="summary-icon">
                      {item.icon}
                    </span>

                    <span>
                      {item.title}
                    </span>

                  </div>

                  <strong>
                    {item.count}
                  </strong>

                </div>

              )
            )}

          </div>


          <div className="summary-total">

            <span>
              Total Orders
            </span>

            <strong>
              {stats.total_orders}
            </strong>

          </div>

        </section>

      </div>


      {/* ========================================
          QUICK ACTIONS
      ======================================== */}

      <section className="dashboard-panel quick-actions-panel">

        <div className="panel-header">

          <div>

            <h3>
              Quick Actions
            </h3>

            <p>
              Manage your store quickly
            </p>

          </div>

        </div>


        <div className="quick-actions">

          <Link
            to="/admin/products"
            className="quick-action"
          >

            <FaBoxOpen />

            <div>

              <strong>
                Products
              </strong>

              <span>
                Manage products
              </span>

            </div>

          </Link>


          <Link
            to="/admin/orders"
            className="quick-action"
          >

            <FaShoppingCart />

            <div>

              <strong>
                Orders
              </strong>

              <span>
                Manage customer orders
              </span>

            </div>

          </Link>


          <Link
            to="/admin/customers"
            className="quick-action"
          >

            <FaUsers />

            <div>

              <strong>
                Customers
              </strong>

              <span>
                View customers
              </span>

            </div>

          </Link>

        </div>

      </section>

    </div>
  );
};

export default AdminDashboard;