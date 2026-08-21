// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";

// import {
//   FaEye,
//   FaSearch,
//   FaUserShield,
// } from "react-icons/fa";

// import "../../styles/admin-users.css";

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:3000";

// interface User {
//   id: number;
//   full_name: string;
//   email: string;
//   role: string;
//   status: boolean;
//   created_at: string;

//   total_orders: number;
//   total_spent: number | string;
//   last_order: string | null;
// }

// const UserList = () => {
//   const [users, setUsers] =
//     useState<User[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [search, setSearch] =
//     useState("");

//   const [error, setError] =
//     useState("");

//   const [updatingUserId, setUpdatingUserId] =
//     useState<number | null>(null);

//   // ==========================================
//   // LOAD USERS
//   // ==========================================

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_URL}/api/admin/users`
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message ||
//             "Failed to load users."
//         );
//       }

//       setUsers(data.users || []);
//     } catch (error) {
//       console.error(
//         "User Load Error:",
//         error
//       );

//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to load users."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // ACTIVATE / DEACTIVATE USER
//   // ==========================================

//   const toggleUserStatus = async (
//     user: User
//   ) => {
//     // Admin account cannot be deactivated
//     if (
//       user.role?.toLowerCase() === "admin"
//     ) {
//       return;
//     }

//     const newStatus = !user.status;

//     const action = newStatus
//       ? "activate"
//       : "deactivate";

//     const confirmed = window.confirm(
//       `Are you sure you want to ${action} ${user.full_name}?`
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setUpdatingUserId(user.id);
//       setError("");

//       const response = await fetch(
//         `${API_URL}/api/admin/users/${user.id}`,
//         {
//           method: "PUT",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             status: newStatus,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message ||
//             "Failed to update user status."
//         );
//       }

//       // Update UI immediately
//       setUsers((previousUsers) =>
//         previousUsers.map((item) =>
//           item.id === user.id
//             ? {
//                 ...item,
//                 status: newStatus,
//               }
//             : item
//         )
//       );
//     } catch (error) {
//       console.error(
//         "User Status Error:",
//         error
//       );

//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to update user status."
//       );
//     } finally {
//       setUpdatingUserId(null);
//     }
//   };

//   // ==========================================
//   // FILTER USERS
//   // ==========================================

//   const filteredUsers = useMemo(() => {
//     const keyword =
//       search.trim().toLowerCase();

//     if (!keyword) {
//       return users;
//     }

//     return users.filter((user) => {
//       const name =
//         user.full_name?.toLowerCase() ||
//         "";

//       const email =
//         user.email?.toLowerCase() ||
//         "";

//       const role =
//         user.role?.toLowerCase() ||
//         "";

//       return (
//         name.includes(keyword) ||
//         email.includes(keyword) ||
//         role.includes(keyword)
//       );
//     });
//   }, [search, users]);

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return (
//       <div className="page-loading">
//         Loading Users...
//       </div>
//     );
//   }

//   return (
//     <div className="user-page">

//       {/* ========================================
//           HEADER
//       ======================================== */}

//       <div className="page-header">

//         <div>
//           <h2>Users</h2>

//           <p>
//             Manage registered user accounts.
//           </p>
//         </div>

//       </div>


//       {/* ========================================
//           ERROR
//       ======================================== */}

//       {error && (
//         <div className="error-message">
//           {error}
//         </div>
//       )}


//       {/* ========================================
//           SEARCH
//       ======================================== */}

//       <div className="search-bar">

//         <FaSearch />

//         <input
//           type="text"
//           placeholder="Search user by name, email or role..."
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//         />

//       </div>


//       {/* ========================================
//           DESKTOP TABLE
//       ======================================== */}

//       <div className="table-wrapper">

//         <table>

//           <thead>

//             <tr>

//               <th>ID</th>

//               <th>User</th>

//               <th>Email</th>

//               <th>Role</th>

//               <th>Status</th>

//               <th>Orders</th>

//               <th>Total Spent</th>

//               <th>Joined</th>

//               <th>Action</th>

//             </tr>

//           </thead>


//           <tbody>

//             {filteredUsers.length === 0 ? (

//               <tr>

//                 <td
//                   colSpan={9}
//                   className="empty"
//                 >
//                   No users found.
//                 </td>

//               </tr>

//             ) : (

//               filteredUsers.map((user) => (

//                 <tr key={user.id}>

//                   {/* ID */}

//                   <td>
//                     {user.id}
//                   </td>


//                   {/* USER */}

//                   <td>

//                     <div className="user-cell">

//                       <div className="user-avatar">

//                         {user.full_name
//                           ?.charAt(0)
//                           .toUpperCase() ||
//                           "U"}

//                       </div>

//                       <strong>
//                         {user.full_name ||
//                           "Unknown"}
//                       </strong>

//                     </div>

//                   </td>


//                   {/* EMAIL */}

//                   <td>
//                     {user.email}
//                   </td>


//                   {/* ROLE */}

//                   <td>

//                     <span
//                       className={`role-badge ${
//                         user.role
//                           ?.toLowerCase() ===
//                         "admin"
//                           ? "admin"
//                           : "user"
//                       }`}
//                     >

//                       {user.role
//                         ?.toLowerCase() ===
//                         "admin" && (
//                         <FaUserShield />
//                       )}

//                       {user.role || "user"}

//                     </span>

//                   </td>


//                   {/* STATUS */}

//                   <td>

//                     <span
//                       className={`status-badge ${
//                         user.status
//                           ? "active"
//                           : "inactive"
//                       }`}
//                     >

//                       {user.status
//                         ? "Active"
//                         : "Inactive"}

//                     </span>

//                   </td>


//                   {/* ORDERS */}

//                   <td>

//                     <span className="order-count">

//                       {Number(
//                         user.total_orders || 0
//                       )}

//                     </span>

//                   </td>


//                   {/* TOTAL SPENT */}

//                   <td>

//                     £
//                     {Number(
//                       user.total_spent || 0
//                     ).toFixed(2)}

//                   </td>


//                   {/* JOINED */}

//                   <td>

//                     {user.created_at
//                       ? new Date(
//                           user.created_at
//                         ).toLocaleDateString()
//                       : "N/A"}

//                   </td>


//                   {/* ACTIONS */}

//                   <td>

//                     <div className="user-actions">

//                       {/* VIEW */}

//                       <Link
//                         to={`/admin/users/${user.id}`}
//                         className="view-btn"
//                         title="View User"
//                       >

//                         <FaEye />

//                       </Link>


//                       {/* ACTIVATE / DEACTIVATE */}

//                       {user.role
//                         ?.toLowerCase() !==
//                         "admin" && (

//                         <button
//                           type="button"
//                           className={
//                             user.status
//                               ? "deactivate-btn"
//                               : "activate-btn"
//                           }
//                           disabled={
//                             updatingUserId ===
//                             user.id
//                           }
//                           onClick={() =>
//                             toggleUserStatus(
//                               user
//                             )
//                           }
//                         >

//                           {updatingUserId ===
//                           user.id
//                             ? "..."
//                             : user.status
//                             ? "Deactivate"
//                             : "Activate"}

//                         </button>

//                       )}

//                     </div>

//                   </td>

//                 </tr>

//               ))

//             )}

//           </tbody>

//         </table>

//       </div>


//       {/* ========================================
//           MOBILE CARDS
//       ======================================== */}

//       <div className="mobile-cards">

//         {filteredUsers.length === 0 ? (

//           <div className="empty">
//             No users found.
//           </div>

//         ) : (

//           filteredUsers.map((user) => (

//             <div
//               className="mobile-card"
//               key={user.id}
//             >

//               {/* USER HEADER */}

//               <div className="mobile-card-header">

//                 <div className="user-cell">

//                   <div className="user-avatar">

//                     {user.full_name
//                       ?.charAt(0)
//                       .toUpperCase() ||
//                       "U"}

//                   </div>

//                   <div>

//                     <h3>
//                       {user.full_name ||
//                         "Unknown"}
//                     </h3>

//                     <span>
//                       #{user.id}
//                     </span>

//                   </div>

//                 </div>


//                 {/* VIEW */}

//                 <Link
//                   to={`/admin/users/${user.id}`}
//                   className="view-btn"
//                   title="View User"
//                 >

//                   <FaEye />

//                 </Link>

//               </div>


//               {/* USER DETAILS */}

//               <div className="mobile-content">

//                 {/* EMAIL */}

//                 <p>

//                   <strong>
//                     Email:
//                   </strong>{" "}

//                   {user.email}

//                 </p>


//                 {/* ROLE */}

//                 <p>

//                   <strong>
//                     Role:
//                   </strong>{" "}

//                   <span
//                     className={`role-badge ${
//                       user.role
//                         ?.toLowerCase() ===
//                       "admin"
//                         ? "admin"
//                         : "user"
//                     }`}
//                   >

//                     {user.role
//                       ?.toLowerCase() ===
//                       "admin" && (
//                       <FaUserShield />
//                     )}

//                     {user.role || "user"}

//                   </span>

//                 </p>


//                 {/* STATUS */}

//                 <p>

//                   <strong>
//                     Status:
//                   </strong>{" "}

//                   <span
//                     className={`status-badge ${
//                       user.status
//                         ? "active"
//                         : "inactive"
//                     }`}
//                   >

//                     {user.status
//                       ? "Active"
//                       : "Inactive"}

//                   </span>

//                 </p>


//                 {/* ORDERS */}

//                 <p>

//                   <strong>
//                     Orders:
//                   </strong>{" "}

//                   {Number(
//                     user.total_orders || 0
//                   )}

//                 </p>


//                 {/* TOTAL SPENT */}

//                 <p>

//                   <strong>
//                     Total Spent:
//                   </strong>{" "}

//                   £
//                   {Number(
//                     user.total_spent || 0
//                   ).toFixed(2)}

//                 </p>


//                 {/* JOINED */}

//                 <p>

//                   <strong>
//                     Joined:
//                   </strong>{" "}

//                   {user.created_at
//                     ? new Date(
//                         user.created_at
//                       ).toLocaleDateString()
//                     : "N/A"}

//                 </p>


//                 {/* MOBILE ACTION */}

//                 {user.role
//                   ?.toLowerCase() !==
//                   "admin" && (

//                   <div className="user-actions">

//                     <button
//                       type="button"
//                       className={
//                         user.status
//                           ? "deactivate-btn"
//                           : "activate-btn"
//                       }
//                       disabled={
//                         updatingUserId ===
//                         user.id
//                       }
//                       onClick={() =>
//                         toggleUserStatus(
//                           user
//                         )
//                       }
//                     >

//                       {updatingUserId ===
//                       user.id
//                         ? "Updating..."
//                         : user.status
//                         ? "Deactivate User"
//                         : "Activate User"}

//                     </button>

//                   </div>

//                 )}

//               </div>

//             </div>

//           ))

//         )}

//       </div>

//     </div>
//   );
// };

// export default UserList;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaEye,
  FaSearch,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

import "../../styles/admin-users.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";


/* ==========================================
   USER INTERFACE
========================================== */

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
}


/* ==========================================
   USER LIST
========================================== */

const UserList = () => {

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const [updatingUserId, setUpdatingUserId] =
    useState<number | null>(null);


  /* ==========================================
     LOAD USERS
  ========================================== */

  useEffect(() => {
    loadUsers();
  }, []);


  const loadUsers = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/users`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
            "Failed to load users."
        );

      }

      setUsers(data.users || []);

    } catch (error) {

      console.error(
        "User Load Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users."
      );

    } finally {

      setLoading(false);

    }

  };


  /* ==========================================
     ACTIVATE / DEACTIVATE
  ========================================== */

  const toggleUserStatus = async (
    user: User
  ) => {

    /*
      Admin account cannot be deactivated
    */

    if (
      user.role?.toLowerCase() ===
      "admin"
    ) {
      return;
    }


    const newStatus =
      !user.status;


    const action = newStatus
      ? "activate"
      : "deactivate";


    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} ${user.full_name}?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setUpdatingUserId(
        user.id
      );

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


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
            "Failed to update user status."
        );

      }


      /*
        Update UI immediately
      */

      setUsers(
        (previousUsers) =>
          previousUsers.map(
            (item) =>
              item.id === user.id
                ? {
                    ...item,
                    status:
                      newStatus,
                  }
                : item
          )
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

      setUpdatingUserId(null);

    }

  };


  /* ==========================================
     SEARCH / FILTER
  ========================================== */

  const filteredUsers =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();


      if (!keyword) {
        return users;
      }


      return users.filter(
        (user) => {

          const name =
            user.full_name
              ?.toLowerCase() ||
            "";

          const email =
            user.email
              ?.toLowerCase() ||
            "";

          const role =
            user.role
              ?.toLowerCase() ||
            "";


          return (
            name.includes(keyword) ||
            email.includes(keyword) ||
            role.includes(keyword)
          );

        }
      );

    }, [search, users]);


  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {

    return (

      <div className="user-page">

        <div className="user-loading">

          <FaUsers />

          <span>
            Loading Users...
          </span>

        </div>

      </div>

    );

  }


  /* ==========================================
     MAIN
  ========================================== */

  return (

    <div className="user-page">


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="user-header">

        <div>

          <h1>
            Users
          </h1>

          <p>
            Manage registered user accounts.
          </p>

        </div>


        {/* TOTAL USERS */}

        <div className="user-total">

          <FaUsers />

          <div>

            <span>
              {users.length}
            </span>

            <small>
              Total Users
            </small>

          </div>

        </div>

      </div>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (

        <div className="user-error">

          {error}

        </div>

      )}


      {/* ========================================
          TOOLBAR
      ======================================== */}

      <div className="user-toolbar">

        <div className="user-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search user by name, email or role..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (

            <button
              type="button"
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
            >
              ×
            </button>

          )}

        </div>

      </div>


      {/* ========================================
          DESKTOP TABLE
      ======================================== */}

      <div className="users-table-container">

        <table className="users-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>User</th>

              <th>Email</th>

              <th>Role</th>

              <th>Status</th>

              <th>Orders</th>

              <th>Total Spent</th>

              <th>Joined</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  className="users-empty-row"
                >

                  <div className="users-empty">

                    <FaUsers />

                    <h3>
                      No Users Found
                    </h3>

                    <p>
                      No users match your search.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredUsers.map(
                (user) => (

                  <tr key={user.id}>


                    {/* ID */}

                    <td>
                      {user.id}
                    </td>


                    {/* USER */}

                    <td>

                      <div className="user-name-cell">

                        <div className="user-avatar">

                          {user.full_name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}

                        </div>

                        <strong>

                          {user.full_name ||
                            "Unknown"}

                        </strong>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>

                      <span className="user-email">

                        {user.email}

                      </span>

                    </td>


                    {/* ROLE */}

                    <td>

                      <span
                        className={`role-badge ${
                          user.role
                            ?.toLowerCase() ===
                          "admin"
                            ? "admin"
                            : "user"
                        }`}
                      >

                        {user.role
                          ?.toLowerCase() ===
                          "admin" && (
                          <FaUserShield />
                        )}

                        {user.role ||
                          "user"}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

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

                    </td>


                    {/* ORDERS */}

                    <td>

                      <span className="user-order-count">

                        {Number(
                          user.total_orders ||
                            0
                        )}

                      </span>

                    </td>


                    {/* TOTAL SPENT */}

                    <td>

                      <strong className="user-spent">

                        £
                        {Number(
                          user.total_spent ||
                            0
                        ).toFixed(2)}

                      </strong>

                    </td>


                    {/* JOINED */}

                    <td>

                      <span className="user-date">

                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString()
                          : "N/A"}

                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <div className="user-actions">

                        <Link
                          to={`/admin/users/${user.id}`}
                          className="user-view-btn"
                          title="View User"
                          aria-label="View User"
                        >

                          <FaEye />

                        </Link>


                        {user.role
                          ?.toLowerCase() !==
                          "admin" && (

                          <button
                            type="button"
                            className={
                              user.status
                                ? "user-deactivate-btn"
                                : "user-activate-btn"
                            }
                            disabled={
                              updatingUserId ===
                              user.id
                            }
                            onClick={() =>
                              toggleUserStatus(
                                user
                              )
                            }
                          >

                            {updatingUserId ===
                            user.id
                              ? "..."
                              : user.status
                              ? "Deactivate"
                              : "Activate"}

                          </button>

                        )}

                      </div>

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

      <div className="user-mobile-list">

        {filteredUsers.length === 0 ? (

          <div className="users-empty">

            <FaUsers />

            <h3>
              No Users Found
            </h3>

            <p>
              No users match your search.
            </p>

          </div>

        ) : (

          filteredUsers.map(
            (user) => (

              <div
                className="user-mobile-card"
                key={user.id}
              >


                {/* CARD HEADER */}

                <div className="user-mobile-header">

                  <div className="user-name-cell">

                    <div className="user-avatar">

                      {user.full_name
                        ?.charAt(0)
                        .toUpperCase() ||
                        "U"}

                    </div>


                    <div>

                      <strong>

                        {user.full_name ||
                          "Unknown"}

                      </strong>

                      <small>
                        #{user.id}
                      </small>

                    </div>

                  </div>


                  <Link
                    to={`/admin/users/${user.id}`}
                    className="user-view-btn"
                    title="View User"
                  >

                    <FaEye />

                  </Link>

                </div>


                {/* CARD CONTENT */}

                <div className="user-mobile-content">


                  <div className="user-mobile-row">

                    <span>
                      Email
                    </span>

                    <strong className="mobile-email">

                      {user.email}

                    </strong>

                  </div>


                  <div className="user-mobile-row">

                    <span>
                      Role
                    </span>

                    <span
                      className={`role-badge ${
                        user.role
                          ?.toLowerCase() ===
                        "admin"
                          ? "admin"
                          : "user"
                      }`}
                    >

                      {user.role
                        ?.toLowerCase() ===
                        "admin" && (
                        <FaUserShield />
                      )}

                      {user.role ||
                        "user"}

                    </span>

                  </div>


                  <div className="user-mobile-row">

                    <span>
                      Status
                    </span>

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


                  <div className="user-mobile-row">

                    <span>
                      Orders
                    </span>

                    <span className="user-order-count">

                      {Number(
                        user.total_orders ||
                          0
                      )}

                    </span>

                  </div>


                  <div className="user-mobile-row">

                    <span>
                      Total Spent
                    </span>

                    <strong className="user-spent">

                      £
                      {Number(
                        user.total_spent ||
                          0
                      ).toFixed(2)}

                    </strong>

                  </div>


                  <div className="user-mobile-row">

                    <span>
                      Joined
                    </span>

                    <span>

                      {user.created_at
                        ? new Date(
                            user.created_at
                          ).toLocaleDateString()
                        : "N/A"}

                    </span>

                  </div>


                  {/* MOBILE ACTION */}

                  {user.role
                    ?.toLowerCase() !==
                    "admin" && (

                    <div className="user-mobile-actions">

                      <button
                        type="button"
                        className={
                          user.status
                            ? "user-deactivate-btn"
                            : "user-activate-btn"
                        }
                        disabled={
                          updatingUserId ===
                          user.id
                        }
                        onClick={() =>
                          toggleUserStatus(
                            user
                          )
                        }
                      >

                        {updatingUserId ===
                        user.id
                          ? "Updating..."
                          : user.status
                          ? "Deactivate User"
                          : "Activate User"}

                      </button>

                    </div>

                  )}

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>

  );
};

export default UserList;