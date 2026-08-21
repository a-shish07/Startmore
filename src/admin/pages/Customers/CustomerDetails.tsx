// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import {
//   FaArrowLeft,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaShoppingCart,
//   FaEye,
// } from "react-icons/fa";

// import "../../styles/admin-customer-details.css";

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:3000";

// interface Address {
//   id: number;
//   full_name: string;
//   phone: string;
//   country: string;
//   state: string;
//   city: string;
//   postal_code: string;
//   address_line1: string;
//   address_line2?: string | null;
// }

// interface CustomerOrder {
//   id: number;
//   order_number: string;
//   subtotal: number | string;
//   shipping_charge: number | string;
//   discount: number | string;
//   total: number | string;
//   payment_method: string;
//   payment_status: string;
//   order_status: string;
//   tracking_number?: string | null;
//   courier?: string | null;
//   created_at: string;
// }

// interface Customer {
//   id: number;
//   full_name: string;
//   email: string;
//   created_at: string;

//   total_orders: number;
//   total_spent: number | string;
//   last_order: string | null;

//   orders: CustomerOrder[];
//   addresses: Address[];
// }

// const CustomerDetails = () => {
//   const { id } = useParams();

//   const [customer, setCustomer] =
//     useState<Customer | null>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   // ==========================================
//   // LOAD CUSTOMER
//   // ==========================================

//   useEffect(() => {
//     if (id) {
//       loadCustomer();
//     }
//   }, [id]);

//   const loadCustomer = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_URL}/api/admin/customers/${id}`
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message ||
//             "Failed to load customer"
//         );
//       }

//       setCustomer(data.customer);
//     } catch (error) {
//       console.error(
//         "Customer Details Error:",
//         error
//       );

//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to load customer"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return (
//       <div className="customer-details-page">

//         <div className="page-loading">
//           Loading Customer...
//         </div>

//       </div>
//     );
//   }

//   // ==========================================
//   // ERROR
//   // ==========================================

//   if (error || !customer) {
//     return (
//       <div className="customer-details-page">

//         <Link
//           to="/admin/customers"
//           className="back-btn"
//         >
//           <FaArrowLeft />
//           Back to Customers
//         </Link>

//         <div className="error-message">
//           {error || "Customer not found."}
//         </div>

//       </div>
//     );
//   }

//   return (
//     <div className="customer-details-page">

//       {/* ========================================
//           TOP HEADER
//       ======================================== */}

//       <div className="customer-details-header">

//         <div>

//           <Link
//             to="/admin/customers"
//             className="back-btn"
//           >
//             <FaArrowLeft />
//             Back to Customers
//           </Link>

//           <div className="customer-title">

//             <div className="customer-large-avatar">

//               {customer.full_name
//                 ?.charAt(0)
//                 .toUpperCase() || "U"}

//             </div>

//             <div>

//               <h1>
//                 {customer.full_name ||
//                   "Unknown Customer"}
//               </h1>

//               <p>
//                 Customer #{customer.id}
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ========================================
//           CUSTOMER INFORMATION
//       ======================================== */}

//       <div className="customer-info-panel">

//         <div className="panel-title">
//           <h2>Customer Information</h2>
//         </div>

//         <div className="customer-info-grid">

//           <div className="customer-info-item">

//             <FaEnvelope />

//             <div>

//               <span>Email</span>

//               <strong>
//                 {customer.email}
//               </strong>

//             </div>

//           </div>


//           <div className="customer-info-item">

//             <FaShoppingCart />

//             <div>

//               <span>Total Orders</span>

//               <strong>
//                 {Number(
//                   customer.total_orders || 0
//                 )}
//               </strong>

//             </div>

//           </div>


//           <div className="customer-info-item">

//             <span className="currency-icon">
//               £
//             </span>

//             <div>

//               <span>Total Spent</span>

//               <strong>
//                 £
//                 {Number(
//                   customer.total_spent || 0
//                 ).toFixed(2)}
//               </strong>

//             </div>

//           </div>


//           <div className="customer-info-item">

//             <FaCalendarIcon />

//             <div>

//               <span>Joined</span>

//               <strong>
//                 {customer.created_at
//                   ? new Date(
//                       customer.created_at
//                     ).toLocaleDateString()
//                   : "N/A"}
//               </strong>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ========================================
//           CONTACT
//       ======================================== */}

//       <div className="customer-content-grid">

//         {/* ======================================
//             ADDRESSES
//         ====================================== */}

//         <div className="customer-panel">

//           <div className="panel-title">

//             <h2>
//               Shipping Addresses
//             </h2>

//           </div>

//           <div className="addresses-list">

//             {customer.addresses.length ===
//             0 ? (

//               <div className="empty-panel">

//                 <FaMapMarkerAlt />

//                 <p>
//                   No address found.
//                 </p>

//               </div>

//             ) : (

//               customer.addresses.map(
//                 (address) => (

//                   <div
//                     className="address-card"
//                     key={address.id}
//                   >

//                     <div className="address-icon">

//                       <FaMapMarkerAlt />

//                     </div>

//                     <div className="address-content">

//                       <strong>
//                         {address.full_name}
//                       </strong>

//                       <p>
//                         {address.address_line1}
//                       </p>

//                       {address.address_line2 && (
//                         <p>
//                           {address.address_line2}
//                         </p>
//                       )}

//                       <p>
//                         {address.city},{" "}
//                         {address.state}
//                       </p>

//                       <p>
//                         {address.country} -{" "}
//                         {address.postal_code}
//                       </p>

//                       {address.phone && (
//                         <div className="address-phone">

//                           <FaPhone />

//                           {address.phone}

//                         </div>
//                       )}

//                     </div>

//                   </div>

//                 )
//               )

//             )}

//           </div>

//         </div>


//         {/* ======================================
//             CUSTOMER SUMMARY
//         ====================================== */}

//         <div className="customer-panel">

//           <div className="panel-title">

//             <h2>
//               Order Summary
//             </h2>

//           </div>

//           <div className="summary-content">

//             <div className="summary-row">

//               <span>
//                 Total Orders
//               </span>

//               <strong>
//                 {customer.orders.length}
//               </strong>

//             </div>


//             <div className="summary-row">

//               <span>
//                 Total Spent
//               </span>

//               <strong className="cyan-text">
//                 £
//                 {Number(
//                   customer.total_spent || 0
//                 ).toFixed(2)}
//               </strong>

//             </div>


//             <div className="summary-row">

//               <span>
//                 Last Order
//               </span>

//               <strong>

//                 {customer.last_order
//                   ? new Date(
//                       customer.last_order
//                     ).toLocaleDateString()
//                   : "No Orders"}

//               </strong>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ========================================
//           ORDER HISTORY
//       ======================================== */}

//       <div className="customer-panel orders-panel">

//         <div className="panel-title">

//           <div>

//             <h2>
//               Order History
//             </h2>

//             <p>
//               All orders placed by this customer
//             </p>

//           </div>

//           <span className="order-total-badge">

//             {customer.orders.length} Orders

//           </span>

//         </div>


//         {customer.orders.length === 0 ? (

//           <div className="empty-orders">

//             <FaShoppingCart />

//             <h3>
//               No Orders Yet
//             </h3>

//             <p>
//               This customer has not placed
//               any orders.
//             </p>

//           </div>

//         ) : (

//           <div className="orders-table-wrapper">

//             <table className="customer-orders-table">

//               <thead>

//                 <tr>

//                   <th>Order</th>

//                   <th>Total</th>

//                   <th>Payment</th>

//                   <th>Status</th>

//                   <th>Date</th>

//                   <th>Action</th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {customer.orders.map(
//                   (order) => (

//                     <tr
//                       key={order.id}
//                     >

//                       <td>

//                         <strong className="order-number">

//                           {order.order_number}

//                         </strong>

//                       </td>


//                       <td>

//                         <strong className="order-price">

//                           £
//                           {Number(
//                             order.total || 0
//                           ).toFixed(2)}

//                         </strong>

//                       </td>


//                       <td>

//                         <span
//                           className={`payment-badge ${order.payment_status
//                             ?.toLowerCase()
//                             .replace(
//                               /\s+/g,
//                               "-"
//                             )}`}
//                         >
//                           {order.payment_status ||
//                             "Pending"}
//                         </span>

//                       </td>


//                       <td>

//                         <span
//                           className={`status-badge ${order.order_status
//                             ?.toLowerCase()
//                             .replace(
//                               /\s+/g,
//                               "-"
//                             )}`}
//                         >
//                           {order.order_status ||
//                             "Pending"}
//                         </span>

//                       </td>


//                       <td>

//                         {order.created_at
//                           ? new Date(
//                               order.created_at
//                             ).toLocaleDateString()
//                           : "N/A"}

//                       </td>


//                       <td>

//                         <Link
//                           to={`/admin/orders/${order.id}`}
//                           className="view-order-btn"
//                           title="View Order"
//                         >

//                           <FaEye />

//                         </Link>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>

//     </div>
//   );
// };


// // ==========================================
// // SMALL CALENDAR ICON COMPONENT
// // ==========================================

// const FaCalendarIcon = () => (
//   <span className="calendar-icon">
//     📅
//   </span>
// );

// export default CustomerDetails;


import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";

import "../../styles/admin-customer-details.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

/* ==========================================
   ADDRESS
========================================== */

interface Address {
  id: number;
  full_name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  address_line1: string;
  address_line2?: string | null;
}


/* ==========================================
   CUSTOMER ORDER
========================================== */

interface CustomerOrder {
  id: number;
  order_number: string;

  subtotal: number | string;
  shipping_charge: number | string;
  discount: number | string;
  total: number | string;

  payment_method: string;
  payment_status: string;
  order_status: string;

  tracking_number?: string | null;
  courier?: string | null;

  created_at: string;
}


/* ==========================================
   CUSTOMER
========================================== */

interface Customer {
  id: number;

  full_name: string;
  email: string;
  created_at: string;

  total_orders: number;
  total_spent: number | string;
  last_order: string | null;

  orders: CustomerOrder[];
  addresses: Address[];
}


/* ==========================================
   CUSTOMER DETAILS
========================================== */

const CustomerDetails = () => {
  const { id } = useParams();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ==========================================
     LOAD CUSTOMER
  ========================================== */

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);


  const loadCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/customers/${id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load customer."
        );
      }

      setCustomer(data.customer);

    } catch (error) {

      console.error(
        "Customer Details Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customer."
      );

    } finally {
      setLoading(false);
    }
  };


  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="customer-details-page">

        <div className="page-loading">
          Loading Customer...
        </div>

      </div>
    );
  }


  /* ==========================================
     ERROR
  ========================================== */

  if (error || !customer) {
    return (
      <div className="customer-details-page">

        <div className="customer-details-header">

          <Link
            to="/admin/customers"
            className="back-btn"
          >
            <FaArrowLeft />

            <span>
              Back to Customers
            </span>
          </Link>

        </div>

        <div className="error-message">
          {error || "Customer not found."}
        </div>

      </div>
    );
  }


  /* ==========================================
     MAIN
  ========================================== */

  return (
    <div className="customer-details-page">


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="customer-details-header">

        <Link
          to="/admin/customers"
          className="back-btn"
        >
          <FaArrowLeft />

          <span>
            Back to Customers
          </span>
        </Link>


        <div className="customer-title">

          <div className="customer-large-avatar">

            {customer.full_name
              ?.charAt(0)
              .toUpperCase() || "U"}

          </div>


          <div>

            <h1>
              {customer.full_name ||
                "Unknown Customer"}
            </h1>

            <p>
              Customer #{customer.id}
            </p>

          </div>

        </div>

      </div>


      {/* ========================================
          CUSTOMER INFORMATION
      ======================================== */}

      <div className="customer-info-panel">

        <div className="panel-title">

          <div>

            <h2>
              Customer Information
            </h2>

            <p>
              Customer account information
            </p>

          </div>

        </div>


        <div className="customer-info-grid">


          {/* EMAIL */}

          <div className="customer-info-item">

            <FaEnvelope />

            <div>

              <span>
                Email
              </span>

              <strong>
                {customer.email || "N/A"}
              </strong>

            </div>

          </div>


          {/* TOTAL ORDERS */}

          <div className="customer-info-item">

            <FaShoppingCart />

            <div>

              <span>
                Total Orders
              </span>

              <strong>
                {Number(
                  customer.total_orders || 0
                )}
              </strong>

            </div>

          </div>


          {/* TOTAL SPENT */}

          <div className="customer-info-item">

            <span className="currency-icon">
              £
            </span>

            <div>

              <span>
                Total Spent
              </span>

              <strong>
                £
                {Number(
                  customer.total_spent || 0
                ).toFixed(2)}
              </strong>

            </div>

          </div>


          {/* JOINED */}

          <div className="customer-info-item">

            <FaCalendarIcon />

            <div>

              <span>
                Joined
              </span>

              <strong>

                {customer.created_at
                  ? new Date(
                      customer.created_at
                    ).toLocaleDateString()
                  : "N/A"}

              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          ADDRESS + SUMMARY
      ======================================== */}

      <div className="customer-content-grid">


        {/* ======================================
            SHIPPING ADDRESSES
        ====================================== */}

        <div className="customer-panel">

          <div className="panel-title">

            <div>

              <h2>
                Shipping Addresses
              </h2>

              <p>
                Saved customer addresses
              </p>

            </div>

          </div>


          <div className="addresses-list">

            {customer.addresses.length === 0 ? (

              <div className="empty-panel">

                <FaMapMarkerAlt />

                <p>
                  No address found.
                </p>

              </div>

            ) : (

              customer.addresses.map(
                (address) => (

                  <div
                    className="address-card"
                    key={address.id}
                  >

                    <div className="address-icon">

                      <FaMapMarkerAlt />

                    </div>


                    <div className="address-content">

                      <strong>
                        {address.full_name}
                      </strong>


                      <p>
                        {address.address_line1}
                      </p>


                      {address.address_line2 && (
                        <p>
                          {address.address_line2}
                        </p>
                      )}


                      <p>

                        {address.city}

                        {address.state &&
                          `, ${address.state}`}

                      </p>


                      <p>

                        {address.country}

                        {address.postal_code &&
                          ` - ${address.postal_code}`}

                      </p>


                      {address.phone && (
                        <div className="address-phone">

                          <FaPhone />

                          <span>
                            {address.phone}
                          </span>

                        </div>
                      )}

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>


        {/* ======================================
            ORDER SUMMARY
        ====================================== */}

        <div className="customer-panel">

          <div className="panel-title">

            <div>

              <h2>
                Order Summary
              </h2>

              <p>
                Customer order statistics
              </p>

            </div>

          </div>


          <div className="summary-content">


            {/* TOTAL ORDERS */}

            <div className="summary-row">

              <span>
                Total Orders
              </span>

              <strong>
                {Number(
                  customer.total_orders ||
                    customer.orders.length ||
                    0
                )}
              </strong>

            </div>


            {/* TOTAL SPENT */}

            <div className="summary-row">

              <span>
                Total Spent
              </span>

              <strong>
                £
                {Number(
                  customer.total_spent || 0
                ).toFixed(2)}
              </strong>

            </div>


            {/* LAST ORDER */}

            <div className="summary-row">

              <span>
                Last Order
              </span>

              <strong>

                {customer.last_order
                  ? new Date(
                      customer.last_order
                    ).toLocaleDateString()
                  : "No Orders"}

              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          ORDER HISTORY
      ======================================== */}

      <div className="customer-panel orders-panel">


        {/* PANEL HEADER */}

        <div className="panel-title">

          <div>

            <h2>
              Order History
            </h2>

            <p>
              All orders placed by this customer
            </p>

          </div>


          <span className="order-total-badge">

            {customer.orders.length}

            {" "}

            {customer.orders.length === 1
              ? "Order"
              : "Orders"}

          </span>

        </div>


        {/* ======================================
            NO ORDERS
        ====================================== */}

        {customer.orders.length === 0 ? (

          <div className="empty-orders">

            <FaShoppingCart />

            <h3>
              No Orders Yet
            </h3>

            <p>
              This customer has not placed
              any orders.
            </p>

          </div>

        ) : (


          /* ====================================
             ORDER TABLE
          ==================================== */

          <div className="orders-table-wrapper">

            <table className="customer-orders-table">


              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {customer.orders.map(
                  (order) => (

                    <tr
                      key={order.id}
                    >


                      {/* ORDER NUMBER */}

                      <td>

                        <strong className="order-number">

                          {order.order_number ||
                            `#${order.id}`}

                        </strong>

                      </td>


                      {/* TOTAL */}

                      <td>

                        <strong className="order-price">

                          £
                          {Number(
                            order.total || 0
                          ).toFixed(2)}

                        </strong>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <span
                          className={`payment-badge ${
                            order.payment_status
                              ?.toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              ) ||
                            "pending"
                          }`}
                        >

                          {order.payment_status ||
                            "Pending"}

                        </span>

                      </td>


                      {/* ORDER STATUS */}

                      <td>

                        <span
                          className={`status-badge ${
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


                      {/* ACTION */}

                      <td>

                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="view-order-btn"
                          title="View Order"
                          aria-label="View Order"
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


/* ==========================================
   CALENDAR ICON
========================================== */

const FaCalendarIcon = () => (
  <span
    className="calendar-icon"
    aria-hidden="true"
  >
    📅
  </span>
);


export default CustomerDetails;