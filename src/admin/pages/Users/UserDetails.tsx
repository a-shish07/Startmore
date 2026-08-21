import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaEnvelope,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingBag,
  FaUser,
  FaUserShield,
} from "react-icons/fa";

import "../../styles/admin-user-details.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Address {
  id: number;
  full_name?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
  address_line1?: string;
  address_line2?: string;
}

interface Order {
  id: number;
  order_number?: string;
  subtotal?: number | string;
  shipping_charge?: number | string;
  discount?: number | string;
  total?: number | string;
  payment_method?: string;
  payment_status?: string;
  order_status?: string;
  tracking_number?: string | null;
  courier?: string | null;
  created_at?: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: boolean;
  created_at: string;

  total_orders: number;
  total_spent: number | string;
  last_order: string | null;

  addresses: Address[];
  orders: Order[];
}

const UserDetails = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // ==========================================
  // LOAD USER DETAILS
  // ==========================================

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/users/${id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load user details."
        );
      }

      setUser(data.user);
    } catch (error) {
      console.error(
        "User Details Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load user details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  const toggleStatus = async () => {
    if (!user) return;

    // Do not deactivate admin
    if (
      user.role?.toLowerCase() ===
        "admin" &&
      user.status
    ) {
      return;
    }

    const newStatus = !user.status;

    const action = newStatus
      ? "activate"
      : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.full_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/users/${user.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update user status."
        );
      }

      setUser((previousUser) =>
        previousUser
          ? {
              ...previousUser,
              status: newStatus,
            }
          : previousUser
      );
    } catch (error) {
      console.error(
        "User Status Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update user status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="page-loading">
        Loading User Details...
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !user) {
    return (
      <div className="user-details-page">

        <div className="error-message">
          {error || "User not found."}
        </div>

        <Link
          to="/admin/users"
          className="back-btn"
        >
          <FaArrowLeft />
          Back to Users
        </Link>

      </div>
    );
  }

  return (
    <div className="user-details-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="details-header">

        <div className="details-header-left">

          <Link
            to="/admin/users"
            className="back-btn"
          >
            <FaArrowLeft />
          </Link>

          <div>
            <h2>User Details</h2>

            <p>
              View customer account information
              and order history.
            </p>
          </div>

        </div>


        {/* STATUS ACTION */}

        {user.role?.toLowerCase() !==
          "admin" && (

          <button
            type="button"
            className={
              user.status
                ? "deactivate-btn"
                : "activate-btn"
            }
            disabled={updatingStatus}
            onClick={toggleStatus}
          >
            {updatingStatus
              ? "Updating..."
              : user.status
              ? "Deactivate User"
              : "Activate User"}
          </button>

        )}

      </div>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* ========================================
          PROFILE + SUMMARY
      ======================================== */}

      <div className="details-grid">

        {/* USER PROFILE */}

        <div className="details-card">

          <div className="card-title">
            <FaUser />
            <h3>User Information</h3>
          </div>


          <div className="profile-section">

            <div className="large-avatar">

              {user.full_name
                ?.charAt(0)
                .toUpperCase() || "U"}

            </div>


            <div className="profile-name">

              <h2>
                {user.full_name ||
                  "Unknown User"}
              </h2>

              <span
                className={`status-badge ${
                  user.status
                    ? "active"
                    : "inactive"
                }`}
              >
                {user.status
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

          </div>


          <div className="info-list">

            <div className="info-item">

              <FaEnvelope />

              <div>
                <span>Email</span>

                <strong>
                  {user.email}
                </strong>
              </div>

            </div>


            <div className="info-item">

              <FaUserShield />

              <div>
                <span>Role</span>

                <strong>
                  {user.role || "user"}
                </strong>
              </div>

            </div>


            <div className="info-item">

              <FaUser />

              <div>
                <span>User ID</span>

                <strong>
                  #{user.id}
                </strong>
              </div>

            </div>


            <div className="info-item">

              <FaShoppingBag />

              <div>
                <span>Joined</span>

                <strong>
                  {user.created_at
                    ? new Date(
                        user.created_at
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* STATISTICS */}

        <div className="details-card">

          <div className="card-title">

            <FaShoppingBag />

            <h3>Account Summary</h3>

          </div>


          <div className="summary-grid">

            <div className="summary-box">

              <span>
                Total Orders
              </span>

              <strong>
                {Number(
                  user.total_orders || 0
                )}
              </strong>

            </div>


            <div className="summary-box">

              <span>
                Total Spent
              </span>

              <strong>
                £
                {Number(
                  user.total_spent || 0
                ).toFixed(2)}
              </strong>

            </div>


            <div className="summary-box">

              <span>
                Last Order
              </span>

              <strong>

                {user.last_order
                  ? new Date(
                      user.last_order
                    ).toLocaleDateString()
                  : "No orders"}

              </strong>

            </div>


            <div className="summary-box">

              <span>
                Account Status
              </span>

              <strong
                className={
                  user.status
                    ? "text-active"
                    : "text-inactive"
                }
              >

                {user.status
                  ? "Active"
                  : "Inactive"}

              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          ADDRESSES
      ======================================== */}

      <div className="details-card">

        <div className="card-title">

          <FaMapMarkerAlt />

          <h3>
            Saved Addresses
          </h3>

        </div>


        {user.addresses.length === 0 ? (

          <div className="empty-state">
            No saved addresses.
          </div>

        ) : (

          <div className="address-grid">

            {user.addresses.map(
              (address) => (

                <div
                  className="address-card"
                  key={address.id}
                >

                  <div className="address-header">

                    <strong>
                      {address.full_name ||
                        user.full_name}
                    </strong>

                  </div>


                  {address.phone && (
                    <p>
                      <FaPhone />
                      {address.phone}
                    </p>
                  )}


                  <p>
                    <FaMapMarkerAlt />

                    <span>

                      {address.address_line1}

                      {address.address_line2 && (
                        <>
                          <br />
                          {
                            address.address_line2
                          }
                        </>
                      )}

                      <br />

                      {address.city},{" "}
                      {address.state}

                      <br />

                      {
                        address.postal_code
                      }

                      <br />

                      {address.country}

                    </span>

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ========================================
          ORDER HISTORY
      ======================================== */}

      <div className="details-card">

        <div className="card-title">

          <FaShoppingBag />

          <h3>
            Order History
          </h3>

        </div>


        {user.orders.length === 0 ? (

          <div className="empty-state">
            This user has not placed
            any orders yet.
          </div>

        ) : (

          <div className="orders-table-wrapper">

            <table className="user-orders-table">

              <thead>

                <tr>

                  <th>Order</th>

                  <th>Total</th>

                  <th>Payment</th>

                  <th>Status</th>

                  <th>Date</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {user.orders.map(
                  (order) => (

                    <tr key={order.id}>

                      {/* ORDER */}

                      <td>

                        <strong>
                          {order.order_number ||
                            `ORD-${order.id}`}
                        </strong>

                      </td>


                      {/* TOTAL */}

                      <td>

                        £
                        {Number(
                          order.total || 0
                        ).toFixed(2)}

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <span className="payment-badge">

                          {order.payment_status ||
                            "Pending"}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`order-status ${
                            order.order_status
                              ?.toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              ) ||
                            "pending"
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

          </div>

        )}

      </div>

    </div>
  );
};

export default UserDetails;