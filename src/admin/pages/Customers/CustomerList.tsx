import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaEye,
  FaSearch,
} from "react-icons/fa";

import "../../styles/admin-customers.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

interface Customer {
  id: number;
  full_name: string;
  email: string;
  created_at: string;

  total_orders: number;
  total_spent: number | string;

  last_order: string | null;
}

const CustomerList = () => {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD CUSTOMERS
  // ==========================================

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/customers`
      );

      const data = await response.json();

      if (data.success) {
        setCustomers(
          data.customers || []
        );
      } else {
        setError(
          data.message ||
            "Failed to load customers."
        );
      }
    } catch (error) {
      console.error(
        "Customer Load Error:",
        error
      );

      setError(
        "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER CUSTOMERS
  // ==========================================

  const filteredCustomers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return customers;
      }

      return customers.filter(
        (customer) => {
          const name =
            customer.full_name
              ?.toLowerCase() || "";

          const email =
            customer.email
              ?.toLowerCase() || "";

          return (
            name.includes(keyword) ||
            email.includes(keyword)
          );
        }
      );
    }, [search, customers]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="page-loading">
        Loading Customers...
      </div>
    );
  }

  return (
    <div className="customers-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="customers-header">

        <div>
          <h2>Customers</h2>

          <p>
            Manage all store customers.
          </p>
        </div>

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
          SEARCH
      ======================================== */}

      <div className="search-bar">

        <FaSearch />

        <input
          type="text"
          placeholder="Search customer by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ========================================
          DESKTOP TABLE
      ======================================== */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>Customer</th>

              <th>Email</th>

              <th>Orders</th>

              <th>Total Spent</th>

              <th>Last Order</th>

              <th>Joined</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {filteredCustomers.length ===
            0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="empty"
                >
                  No customers found.
                </td>

              </tr>

            ) : (

              filteredCustomers.map(
                (customer) => (

                  <tr
                    key={customer.id}
                  >

                    {/* ID */}

                    <td>
                      {customer.id}
                    </td>


                    {/* CUSTOMER */}

                    <td>

                      <div className="customer-cell">

                        <div className="customer-avatar">

                          {customer.full_name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}

                        </div>

                        <strong>
                          {customer.full_name ||
                            "Unknown"}
                        </strong>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>
                      {customer.email}
                    </td>


                    {/* ORDERS */}

                    <td>

                      <span className="order-count">

                        {Number(
                          customer.total_orders ||
                            0
                        )}

                      </span>

                    </td>


                    {/* TOTAL SPENT */}

                    <td>

                      £
                      {Number(
                        customer.total_spent ||
                          0
                      ).toFixed(2)}

                    </td>


                    {/* LAST ORDER */}

                    <td>

                      {customer.last_order
                        ? new Date(
                            customer.last_order
                          ).toLocaleDateString()
                        : "No Orders"}

                    </td>


                    {/* JOINED */}

                    <td>

                      {customer.created_at
                        ? new Date(
                            customer.created_at
                          ).toLocaleDateString()
                        : "N/A"}

                    </td>


                    {/* VIEW */}

                    <td>

                      <Link
                        to={`/admin/customers/${customer.id}`}
                        className="view-btn"
                        title="View Customer"
                      >
                        <FaEye />
                      </Link>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ========================================
          MOBILE CARDS
      ======================================== */}

      <div className="mobile-cards">

        {filteredCustomers.length ===
        0 ? (

          <div className="empty">
            No customers found.
          </div>

        ) : (

          filteredCustomers.map(
            (customer) => (

              <div
                className="mobile-card"
                key={customer.id}
              >

                {/* CUSTOMER HEADER */}

                <div className="mobile-card-header">

                  <div className="customer-cell">

                    <div className="customer-avatar">

                      {customer.full_name
                        ?.charAt(0)
                        .toUpperCase() ||
                        "U"}

                    </div>

                    <div>

                      <h3>
                        {customer.full_name ||
                          "Unknown"}
                      </h3>

                      <span>
                        #{customer.id}
                      </span>

                    </div>

                  </div>


                  <Link
                    to={`/admin/customers/${customer.id}`}
                    className="view-btn"
                    title="View Customer"
                  >
                    <FaEye />
                  </Link>

                </div>


                {/* CUSTOMER DETAILS */}

                <div className="mobile-content">

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {customer.email}
                  </p>

                  <p>
                    <strong>
                      Orders:
                    </strong>{" "}
                    {Number(
                      customer.total_orders ||
                        0
                    )}
                  </p>

                  <p>
                    <strong>
                      Total Spent:
                    </strong>{" "}
                    £
                    {Number(
                      customer.total_spent ||
                        0
                    ).toFixed(2)}
                  </p>

                  <p>
                    <strong>
                      Last Order:
                    </strong>{" "}
                    {customer.last_order
                      ? new Date(
                          customer.last_order
                        ).toLocaleDateString()
                      : "No Orders"}
                  </p>

                  <p>
                    <strong>
                      Joined:
                    </strong>{" "}
                    {customer.created_at
                      ? new Date(
                          customer.created_at
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
};

export default CustomerList;