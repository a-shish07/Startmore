// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaEdit,
//   FaPlus,
//   FaSearch,
//   FaTrash,
// } from "react-icons/fa";
// import "../../styles/size.css";

// const API_URL = import.meta.env.VITE_API_URL;

// interface Size {
//   id: number;
//   name: string;
//   status: boolean;
//   created_at: string;
// }

// const SizeList = () => {
//   const [sizes, setSizes] = useState<Size[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadSizes();
//   }, []);

//   const loadSizes = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${API_URL}/api/admin/sizes`
//       );

//       const data = await response.json();

//       if (data.success) {
//         setSizes(data.sizes || []);
//       } else {
//         setError(data.message);
//       }
//     } catch {
//       setError("Failed to load sizes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteSize = async (id: number) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this size?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `${API_URL}/api/admin/sizes/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         setMessage(data.message);
//         loadSizes();
//       } else {
//         setError(data.message);
//       }
//     } catch {
//       setError("Failed to delete size.");
//     }
//   };

//   const filteredSizes = useMemo(() => {
//     return sizes.filter((size) =>
//       size.name
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );
//   }, [search, sizes]);

//   if (loading) {
//     return (
//       <div className="page-loading">
//         Loading Sizes...
//       </div>
//     );
//   }

//   return (
//     <div className="shape-page">
//       <div className="page-header">
//         <div>
//           <h2>Sizes</h2>
//           <p>Manage all product sizes.</p>
//         </div>

//         <Link
//           to="/admin/sizes/add"
//           className="add-btn"
//         >
//           <FaPlus />
//           <span>Add Size</span>
//         </Link>
//       </div>

//       {message && (
//         <div className="success-message">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="error-message">
//           {error}
//         </div>
//       )}

//       <div className="search-bar">
//         <FaSearch />
//         <input
//           type="text"
//           placeholder="Search size..."
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//         />
//       </div>

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Status</th>
//               <th>Created</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredSizes.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="empty"
//                 >
//                   No sizes found.
//                 </td>
//               </tr>
//             ) : (
//               filteredSizes.map((size) => (
//                 <tr key={size.id}>
//                   <td>{size.id}</td>

//                   <td>{size.name}</td>

//                   <td>
//                     <span
//                       className={
//                         size.status
//                           ? "badge active"
//                           : "badge inactive"
//                       }
//                     >
//                       {size.status
//                         ? "Active"
//                         : "Inactive"}
//                     </span>
//                   </td>

//                   <td>
//                     {new Date(
//                       size.created_at
//                     ).toLocaleDateString()}
//                   </td>

//                   <td>
//                     <div className="action-buttons">
//                       <Link
//                         to={`/admin/sizes/edit/${size.id}`}
//                         className="edit-btn"
//                       >
//                         <FaEdit />
//                       </Link>

//                       <button
//                         className="delete-btn"
//                         onClick={() =>
//                           deleteSize(size.id)
//                         }
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="mobile-cards">
//         {filteredSizes.map((size) => (
//           <div
//             className="mobile-card"
//             key={size.id}
//           >
//             <div className="mobile-content">
//               <h3>{size.name}</h3>

//               <p>
//                 <strong>Status:</strong>

//                 <span
//                   className={
//                     size.status
//                       ? "badge active"
//                       : "badge inactive"
//                   }
//                 >
//                   {size.status
//                     ? " Active"
//                     : " Inactive"}
//                 </span>
//               </p>

//               <p>
//                 <strong>Created:</strong>{" "}
//                 {new Date(
//                   size.created_at
//                 ).toLocaleDateString()}
//               </p>

//               <div className="card-actions">
//                 <Link
//                   to={`/admin/sizes/edit/${size.id}`}
//                   className="edit-btn"
//                 >
//                   <FaEdit />
//                 </Link>

//                 <button
//                   className="delete-btn"
//                   onClick={() =>
//                     deleteSize(size.id)
//                   }
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SizeList; 


import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
  FaRulerCombined,
} from "react-icons/fa";

import "../../styles/size.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Size {
  id: number;
  name: string;
  status: boolean;
  created_at: string;

  // Optional if backend provides product count
  product_count?: number;
}

const SizeList = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==========================================
     LOAD SIZES
  ========================================== */

  useEffect(() => {
    loadSizes();
  }, []);

  const loadSizes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/sizes`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load sizes."
        );
      }

      setSizes(data.sizes || []);
    } catch (err: any) {
      console.error("Load Sizes:", err);

      setError(
        err.message || "Failed to load sizes."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     DELETE SIZE
  ========================================== */

  const deleteSize = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this size?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/admin/sizes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete size."
        );
      }

      setMessage(
        data.message || "Size deleted successfully."
      );

      loadSizes();
    } catch (err: any) {
      console.error("Delete Size:", err);

      setError(
        err.message || "Failed to delete size."
      );
    }
  };

  /* ==========================================
     SEARCH
  ========================================== */

  const filteredSizes = useMemo(() => {
    const keyword = search
      .toLowerCase()
      .trim();

    if (!keyword) {
      return sizes;
    }

    return sizes.filter((size) =>
      size.name
        .toLowerCase()
        .includes(keyword)
    );
  }, [search, sizes]);

  /* ==========================================
     PRODUCT COUNT
  ========================================== */

  const getProductCount = (size: Size) => {
    if (
      typeof size.product_count === "number"
    ) {
      return `${size.product_count} ${
        size.product_count === 1
          ? "product"
          : "products"
      }`;
    }

    return "Products";
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="size-page">

        <div className="size-loading">

          <div className="size-loading-spinner"></div>

          <span>
            Loading Sizes...
          </span>

        </div>

      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="size-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="size-header">

        <div className="size-header-content">

          <h2>Sizes</h2>

          <p>
            Size options available for your
            products
          </p>

        </div>

        <Link
          to="/admin/sizes/add"
          className="size-add-btn"
        >
          <FaPlus />

          <span>
            Add Size
          </span>
        </Link>

      </div>


      {/* ======================================
          MESSAGES
      ====================================== */}

      {message && (
        <div className="size-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="size-message error">
          {error}
        </div>
      )}


      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="size-search-wrapper">

        <FaSearch className="size-search-icon" />

        <input
          type="text"
          className="size-search-input"
          placeholder="Search sizes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ======================================
          DESKTOP TABLE
      ====================================== */}

      <div className="size-table-card">

        <div className="size-table-wrapper">

          <table className="size-table">

            <thead>

              <tr>

                <th className="size-name-column">
                  Size
                </th>

                <th className="size-products-column">
                  Products
                </th>

                <th className="size-status-column">
                  Status
                </th>

                <th className="size-actions-column">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSizes.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="size-empty"
                  >

                    <div className="size-empty-icon">
                      <FaRulerCombined />
                    </div>

                    <h3>
                      No sizes found
                    </h3>

                    <p>
                      {search
                        ? "Try a different search."
                        : "Create your first size."
                      }
                    </p>

                  </td>

                </tr>

              ) : (

                filteredSizes.map((size) => (

                  <tr
                    key={size.id}
                    className="size-row"
                  >

                    {/* ==========================
                        SIZE
                    ========================== */}

                    <td className="size-name-cell">

                      <div className="size-name-wrapper">

                        <div className="size-icon-box">

                          <FaRulerCombined />

                        </div>

                        <div className="size-name-content">

                          <strong>
                            {size.name}
                          </strong>

                          <span>
                            Size option
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* ==========================
                        PRODUCTS
                    ========================== */}

                    <td className="size-products-cell">

                      {getProductCount(size)}

                    </td>


                    {/* ==========================
                        STATUS
                    ========================== */}

                    <td className="size-status-cell">

                      <span
                        className={
                          size.status
                            ? "size-status active"
                            : "size-status inactive"
                        }
                      >

                        <span className="size-status-dot"></span>

                        {size.status
                          ? "Active"
                          : "Inactive"
                        }

                      </span>

                    </td>


                    {/* ==========================
                        ACTIONS
                    ========================== */}

                    <td className="size-actions-cell">

                      <div className="size-actions">

                        <Link
                          to={`/admin/sizes/edit/${size.id}`}
                          className="size-action edit"
                          title="Edit Size"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          type="button"
                          className="size-action delete"
                          onClick={() =>
                            deleteSize(size.id)
                          }
                          title="Delete Size"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================
          MOBILE CARDS
      ====================================== */}

      <div className="size-mobile-list">

        {filteredSizes.length === 0 ? (

          <div className="size-mobile-empty">

            <div className="size-empty-icon">
              <FaRulerCombined />
            </div>

            <h3>
              No sizes found
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Create your first size."
              }
            </p>

          </div>

        ) : (

          filteredSizes.map((size) => (

            <div
              className="size-mobile-card"
              key={size.id}
            >

              {/* TOP */}

              <div className="size-mobile-top">

                <div className="size-icon-box">

                  <FaRulerCombined />

                </div>

                <div className="size-name-content">

                  <strong>
                    {size.name}
                  </strong>

                  <span>
                    Size option
                  </span>

                </div>

              </div>


              {/* DETAILS */}

              <div className="size-mobile-details">

                <div className="size-mobile-detail">

                  <span>
                    Products
                  </span>

                  <strong>
                    {getProductCount(size)}
                  </strong>

                </div>


                <div className="size-mobile-detail">

                  <span>
                    Status
                  </span>

                  <span
                    className={
                      size.status
                        ? "size-status active"
                        : "size-status inactive"
                    }
                  >

                    <span className="size-status-dot"></span>

                    {size.status
                      ? "Active"
                      : "Inactive"
                    }

                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="size-mobile-actions">

                <Link
                  to={`/admin/sizes/edit/${size.id}`}
                  className="size-mobile-action edit"
                >

                  <FaEdit />

                  <span>
                    Edit
                  </span>

                </Link>

                <button
                  type="button"
                  className="size-mobile-action delete"
                  onClick={() =>
                    deleteSize(size.id)
                  }
                >

                  <FaTrash />

                  <span>
                    Delete
                  </span>

                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default SizeList;