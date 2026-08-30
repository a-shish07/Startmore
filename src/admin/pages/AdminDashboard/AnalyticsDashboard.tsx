import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaDollarSign,
  FaShoppingCart,
  FaSyncAlt,
  FaTruck,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "../../styles/admin-dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

type Point = {
  date: string;
  revenue: number;
  products: number;
  customers: number;
  orders: number;
  gross_sales: number;
  fulfilled: number;
};

type DashboardData = {
  stats: Record<string, number>;
  series: Point[];
  recent_orders: any[];
  order_summary: Record<string, number>;
};

const money = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(n || 0);

const range = (preset: string) => {
  const end = new Date();
  const start = new Date(end);

  if (preset === "7d") {
    start.setDate(end.getDate() - 6);
  }

  if (preset === "30d") {
    start.setDate(end.getDate() - 29);
  }

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

/* =========================================================
   CHART
========================================================= */

function AnalyticsChart({
  points,
  field,
  type = "number",
}: {
  points: Point[];
  field: keyof Point;
  type?: "money" | "number";
}) {
  if (!points.length) {
    return (
      <div className="analytics-chart-empty">
        <span>No activity in this range</span>
      </div>
    );
  }

  const formattedData = points.map((point) => ({
    ...point,
    displayDate: new Date(
      `${point.date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <div className="analytics-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 5"
            vertical={false}
            stroke="#eee9e4"
          />

          <XAxis
  dataKey="displayDate"
  axisLine={false}
  tickLine={false}
  tick={{
    fill: "#8b837d",
    fontSize: 10,
  }}
  minTickGap={35}
  tickMargin={8}
  interval="preserveStartEnd"
/>

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#8b837d",
              fontSize: 10,
            }}
            tickFormatter={(value) =>
              type === "money"
                ? `£${value}`
                : value
            }
          />

          <Tooltip
            cursor={{
              stroke: "#d9d2e7",
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              border: "1px solid #e7e1da",
              borderRadius: "10px",
              boxShadow:
                "0 8px 25px rgba(40,30,20,.08)",
              fontSize: "12px",
            }}
            formatter={(value: any) =>
              type === "money"
                ? money(Number(value))
                : Number(value).toLocaleString()
            }
          />

          <Line
            type="monotone"
            dataKey={field}
            stroke="#51477c"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              strokeWidth: 3,
              fill: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* =========================================================
   ANALYTICS CARD
========================================================= */

function AnalyticsCard({
  title,
  value,
  field,
  icon,
  type = "number",
  accent = "purple",
  points,
}: {
  title: string;
  value: number;
  field: keyof Point;
  icon: React.ReactNode;
  type?: "money" | "number";
  accent?: string;
  points: Point[];
}) {
  return (
    <article
      className={`analytics-card analytics-${accent}`}
    >
      <div className="analytics-card-header">
        <div>
          <p className="analytics-card-label">
            {title}
          </p>

          <h3>
            {type === "money"
              ? money(value)
              : value.toLocaleString()}
          </h3>
        </div>

        <div className="analytics-card-icon">
          {icon}
        </div>
      </div>

      <div className="analytics-mini-chart">
        <AnalyticsChart
          points={points}
          field={field}
          type={type}
        />
      </div>
    </article>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function AnalyticsDashboard() {
  const [dates, setDates] = useState({
    ...range("30d"),
    preset: "30d",
  });

  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ANALYTICS
  ======================================================= */

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({
        startDate: dates.startDate,
        endDate: dates.endDate,
      });

      const response = await fetch(
        `${API_URL}/api/admin/dashboard/analytics?${query}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("adminToken") || ""
            }`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const body = await response.text();

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Analytics API returned HTML instead of data (HTTP ${response.status}).`
        );
      }

      const result = JSON.parse(body);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load analytics."
        );
      }

      setData(result);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [dates.startDate, dates.endDate]);

  /* =======================================================
     SELECTED DATE TEXT
  ======================================================= */

  const selected = `${new Date(
    `${dates.startDate}T00:00:00`
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} – ${new Date(
    `${dates.endDate}T00:00:00`
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  /* =======================================================
     OVERVIEW CARDS
  ======================================================= */

  const overviewCards = useMemo(
    () => [
      {
        label: "Total products",
        value: data?.stats.total_products || 0,
        icon: <FaBoxOpen />,
      },
      {
        label: "Customers",
        value: data?.stats.total_customers || 0,
        icon: <FaUsers />,
      },
      {
        label: "Orders",
        value: data?.stats.total_orders || 0,
        icon: <FaShoppingCart />,
      },
      {
        label: "Gross sales",
        value: data?.stats.gross_sales || 0,
        icon: <FaDollarSign />,
        money: true,
      },
      {
        label: "Total revenue",
        value: data?.stats.total_revenue || 0,
        icon: <FaDollarSign />,
        money: true,
      },
      {
        label: "Orders fulfilled",
        value:
          data?.stats.orders_fulfilled || 0,
        icon: <FaTruck />,
      },
    ],
    [data]
  );

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="analytics-dashboard">

      {/* ===================================================
          DATE TOOLBAR
      =================================================== */}

      <section className="date-toolbar">

        <div className="range-current">
          <FaCalendarAlt />

          <span>{selected}</span>
        </div>

        <div className="range-presets">

          {[
            ["today", "Today"],
            ["7d", "Last 7 days"],
            ["30d", "Last 30 days"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={
                dates.preset === key
                  ? "active"
                  : ""
              }
              onClick={() =>
                setDates({
                  ...range(key),
                  preset: key,
                })
              }
            >
              {label}
            </button>
          ))}

        </div>

        <label className="custom-date">
          <span>From</span>

          <input
            type="date"
            value={dates.startDate}
            max={dates.endDate}
            onChange={(e) =>
              setDates({
                ...dates,
                startDate: e.target.value,
                preset: "custom",
              })
            }
          />
        </label>

        <label className="custom-date">
          <span>To</span>

          <input
            type="date"
            value={dates.endDate}
            min={dates.startDate}
            onChange={(e) =>
              setDates({
                ...dates,
                endDate: e.target.value,
                preset: "custom",
              })
            }
          />
        </label>

        <button
          className="refresh-button"
          onClick={load}
          disabled={loading}
        >
          <FaSyncAlt />
        </button>

      </section>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <section className="analytics-message">
          <strong>
            Analytics could not be loaded.
          </strong>

          <span>{error}</span>

          <button onClick={load}>
            Try again
          </button>
        </section>
      )}

      {!error && (
        <>
          {/* ===============================================
              OVERVIEW
          =============================================== */}

          <section className="overview-section">

            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  OVERVIEW
                </span>

                <h2>
                  Store performance
                </h2>

                <p>
                  Key performance metrics for the
                  selected period.
                </p>
              </div>
            </div>

            <div
              className="overview-grid"
              aria-busy={loading}
            >
              {overviewCards.map((card) => (
                <article
                  className="overview-card"
                  key={card.label}
                >
                  <div className="overview-icon">
                    {card.icon}
                  </div>

                  <p>{card.label}</p>

                  <strong>
                    {card.money
                      ? money(card.value)
                      : card.value.toLocaleString()}
                  </strong>
                </article>
              ))}
            </div>

          </section>

          {/* ===============================================
              ANALYTICS
          =============================================== */}

          <section className="analytics-section">

            <div className="analytics-section-header">

              <div>
                <span className="eyebrow">
                  ANALYTICS
                </span>

                <h2>
                  Performance trends over time
                </h2>
              </div>

              <div className="group-by">
                <span>Group by</span>

                <select defaultValue="day">
                  <option value="day">
                    Day
                  </option>

                  <option value="week">
                    Week
                  </option>

                  <option value="month">
                    Month
                  </option>
                </select>
              </div>

            </div>

            <div
              className="analytics-grid"
              aria-busy={loading}
            >

              {/* REVENUE */}

              <AnalyticsCard
                title="Total revenue"
                value={
                  data?.stats.total_revenue || 0
                }
                field="revenue"
                icon={<FaChartLine />}
                type="money"
                accent="purple"
                points={data?.series || []}
              />

              {/* GROSS SALES */}

              <AnalyticsCard
                title="Gross sales"
                value={
                  data?.stats.gross_sales || 0
                }
                field="gross_sales"
                icon={<FaChartLine />}
                type="money"
                accent="blue"
                points={data?.series || []}
              />

              {/* ORDERS */}

              <AnalyticsCard
                title="Orders"
                value={
                  data?.stats.total_orders || 0
                }
                field="orders"
                icon={<FaChartLine />}
                accent="orange"
                points={data?.series || []}
              />

              {/* CUSTOMERS */}

              <AnalyticsCard
                title="Customers"
                value={
                  data?.stats.total_customers || 0
                }
                field="customers"
                icon={<FaChartLine />}
                accent="green"
                points={data?.series || []}
              />

              {/* FULFILLED */}

              <AnalyticsCard
                title="Orders fulfilled"
                value={
                  data?.stats.orders_fulfilled || 0
                }
                field="fulfilled"
                icon={<FaChartLine />}
                accent="purple"
                points={data?.series || []}
              />

              {/* PRODUCTS */}

              <AnalyticsCard
                title="New products"
                value={
                  data?.stats.total_products || 0
                }
                field="products"
                icon={<FaChartLine />}
                accent="pink"
                points={data?.series || []}
              />

            </div>

          </section>

          {/* ===============================================
              BOTTOM CONTENT
          =============================================== */}

          <section className="bottom-dashboard-grid">

            {/* RECENT ORDERS */}

            <article className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Recent orders
                  </h3>

                  <p>
                    Latest orders placed during
                    this period
                  </p>
                </div>

                <Link
                  to="/admin/orders"
                  className="view-all-btn"
                >
                  View all
                </Link>

              </div>

              {loading ? (
                <div className="chart-empty">
                  Loading orders…
                </div>
              ) : !data?.recent_orders.length ? (
                <div className="chart-empty">
                  No orders for this date range.
                </div>
              ) : (
                <div className="dashboard-table-wrapper">

                  <table className="dashboard-orders-table">

                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>

                      {data.recent_orders.map(
                        (order) => (
                          <tr key={order.id}>

                            <td>
                              <strong>
                                {order.order_number ||
                                  `ORD-${order.id}`}
                              </strong>
                            </td>

                            <td>
                              {order.customer_name ||
                                order.customer_email ||
                                "Guest"}
                            </td>

                            <td>
                              <strong>
                                {money(
                                  Number(
                                    order.total
                                  )
                                )}
                              </strong>
                            </td>

                            <td>
                              <span className="order-status">
                                {order.order_status ||
                                  "Placed"}
                              </span>
                            </td>

                            <td>
                              {new Date(
                                order.created_at
                              ).toLocaleDateString()}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            </article>

            {/* ORDER STATUS */}

            <article className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Order status summary
                  </h3>

                  <p>
                    Breakdown of orders by status
                  </p>
                </div>

              </div>

              {[
                ["Placed", "pending"],
                ["Processing", "processing"],
                ["Shipped", "shipped"],
                ["Delivered", "delivered"],
                ["Cancelled", "cancelled"],
              ].map(([label, key]) => (
                <div
                  className="status-row"
                  key={key}
                >
                  <span>{label}</span>

                  <strong>
                    {data?.order_summary[key] ||
                      0}
                  </strong>
                </div>
              ))}

              <div className="fulfilled-note">
                <FaCheckCircle />

                <span>
                  {data?.stats.orders_fulfilled ||
                    0}{" "}
                  orders fulfilled in range
                </span>
              </div>

            </article>

          </section>
        </>
      )}

    </div>
  );
}