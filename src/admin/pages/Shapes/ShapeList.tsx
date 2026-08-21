// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaEdit,
//   FaPlus,
//   FaSearch,
//   FaTrash,
// } from "react-icons/fa";
// import "../../styles/shape.css";

// const API_URL = import.meta.env.VITE_API_URL;

// interface Shape {
//   id: number;
//   name: string;
//   slug: string;
//   image_id: number | null;
//   image_url: string;
//   status: boolean;
//   created_at: string;
// }

// const ShapeList = () => {
//   const [shapes, setShapes] = useState<Shape[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadShapes();
//   }, []);

//   const loadShapes = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${API_URL}/api/admin/shapes`
//       );

//       const data = await response.json();

//       if (data.success) {
//         setShapes(data.shapes || []);
//       } else {
//         setError(data.message);
//       }
//     } catch {
//       setError("Failed to load shapes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteShape = async (id: number) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this shape?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `${API_URL}/api/admin/shapes/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         setMessage(data.message);
//         loadShapes();
//       } else {
//         setError(data.message);
//       }
//     } catch {
//       setError("Failed to delete shape.");
//     }
//   };

//   const filteredShapes = useMemo(() => {
//     return shapes.filter((shape) => {
//       const keyword = search.toLowerCase();

//       return (
//         shape.name.toLowerCase().includes(keyword) ||
//         shape.slug.toLowerCase().includes(keyword)
//       );
//     });
//   }, [search, shapes]);

//   if (loading) {
//     return (
//       <div className="page-loading">
//         Loading Shapes...
//       </div>
//     );
//   }

//   return (
//     <div className="shape-page">
//       <div className="page-header">
//         <div>
//           <h2>Shapes</h2>
//           <p>Manage all product shapes.</p>
//         </div>

//         <Link
//           to="/admin/shapes/add"
//           className="add-btn"
//         >
//           <FaPlus />
//           <span>Add Shape</span>
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
//           placeholder="Search shape..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Image</th>
//               <th>Name</th>
//               <th>Slug</th>
//               <th>Status</th>
//               <th>Created</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredShapes.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={7}
//                   className="empty"
//                 >
//                   No shapes found.
//                 </td>
//               </tr>
//             ) : (
//               filteredShapes.map((shape) => (
//                 <tr key={shape.id}>
//                   <td>{shape.id}</td>
//                   <td>
//                     {shape.image_url ? (
//                       <img
//                         src={`${API_URL}${shape.image_url}`}
//                         alt={shape.name}
//                         className="table-image"
//                       />
//                     ) : (
//                       <div className="no-image">
//                         No Image
//                       </div>
//                     )}
//                   </td>
//                   <td>{shape.name}</td>
//                   <td>{shape.slug}</td>
//                   <td>
//                     <span
//                       className={
//                         shape.status
//                           ? "badge active"
//                           : "badge inactive"
//                       }
//                     >
//                       {shape.status ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td>
//                     {new Date(
//                       shape.created_at
//                     ).toLocaleDateString()}
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       <Link
//                         to={`/admin/shapes/edit/${shape.id}`}
//                         className="edit-btn"
//                       >
//                         <FaEdit />
//                       </Link>

//                       <button
//                         className="delete-btn"
//                         onClick={() => deleteShape(shape.id)}
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
//         {filteredShapes.length === 0 ? (
//           <div className="empty">
//             No shapes found.
//           </div>
//         ) : (
//           filteredShapes.map((shape) => (
//             <div
//               className="mobile-card"
//               key={shape.id}
//             >
//               <div className="mobile-image">
//                 {shape.image_url ? (
//                   <img
//                     src={`${API_URL}${shape.image_url}`}
//                     alt={shape.name}
//                   />
//                 ) : (
//                   <div className="no-image">
//                     No Image
//                   </div>
//                 )}
//               </div>

//               <div className="mobile-content">
//                 <h3>{shape.name}</h3>
//                 <p>
//                   <strong>Slug:</strong> {shape.slug}
//                 </p>
//                 <p>
//                   <strong>Status:</strong>
//                   <span
//                     className={
//                       shape.status
//                         ? "badge active"
//                         : "badge inactive"
//                     }
//                   >
//                     {shape.status ? " Active" : " Inactive"}
//                   </span>
//                 </p>
//                 <p>
//                   <strong>Created:</strong>{" "}
//                   {new Date(
//                     shape.created_at
//                   ).toLocaleDateString()}
//                 </p>

//                 <div className="card-actions">
//                   <Link
//                     to={`/admin/shapes/edit/${shape.id}`}
//                     className="edit-btn"
//                   >
//                     <FaEdit />
//                   </Link>

//                   <button
//                     className="delete-btn"
//                     onClick={() => deleteShape(shape.id)}
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShapeList;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
  FaShapes,
} from "react-icons/fa";

import "../../styles/shape.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Shape {
  id: number;
  name: string;
  slug: string;
  image_id: number | null;
  image_url: string;
  status: boolean;
  created_at: string;

  // Optional - if your backend provides it
  product_count?: number;
}

const ShapeList = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==========================================
     LOAD SHAPES
  ========================================== */

  useEffect(() => {
    loadShapes();
  }, []);

  const loadShapes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/shapes`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load shapes."
        );
      }

      setShapes(data.shapes || []);
    } catch (error: any) {
      console.error("Load Shapes:", error);
      setError(
        error.message || "Failed to load shapes."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     DELETE SHAPE
  ========================================== */

  const deleteShape = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shape?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/admin/shapes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete shape."
        );
      }

      setMessage(
        data.message || "Shape deleted successfully."
      );

      loadShapes();
    } catch (error: any) {
      console.error("Delete Shape:", error);

      setError(
        error.message || "Failed to delete shape."
      );
    }
  };

  /* ==========================================
     SEARCH
  ========================================== */

  const filteredShapes = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return shapes;
    }

    return shapes.filter((shape) => {
      return (
        shape.name
          .toLowerCase()
          .includes(keyword) ||
        shape.slug
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [search, shapes]);

  /* ==========================================
     PRODUCT COUNT
  ========================================== */

  const getProductCount = (shape: Shape) => {
    if (
      typeof shape.product_count === "number"
    ) {
      return `${shape.product_count} ${
        shape.product_count === 1
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
      <div className="shape-page">
        <div className="shape-loading">
          <div className="loading-spinner"></div>
          <span>Loading Shapes...</span>
        </div>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="shape-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="shape-header">

        <div className="shape-header-content">

          <h2>Shapes</h2>

          <p>
            Nail shape options available at checkout
          </p>

        </div>

        <Link
          to="/admin/shapes/add"
          className="shape-add-btn"
        >
          <FaPlus />
          <span>Add Shape</span>
        </Link>

      </div>


      {/* ======================================
          MESSAGES
      ====================================== */}

      {message && (
        <div className="shape-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="shape-message error">
          {error}
        </div>
      )}


      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="shape-search-wrapper">

        <FaSearch className="shape-search-icon" />

        <input
          type="text"
          className="shape-search-input"
          placeholder="Search shapes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ======================================
          DESKTOP / TABLET TABLE
      ====================================== */}

      <div className="shape-table-card">

        <div className="shape-table-wrapper">

          <table className="shape-table">

            <thead>

              <tr>

                <th className="shape-column">
                  Shape
                </th>

                <th className="products-column">
                  Products
                </th>

                <th className="status-column">
                  Status
                </th>

                <th className="actions-column">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredShapes.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="shape-empty"
                  >

                    <div className="shape-empty-icon">
                      <FaShapes />
                    </div>

                    <h3>
                      No shapes found
                    </h3>

                    <p>
                      {search
                        ? "Try a different search."
                        : "Create your first shape."
                      }
                    </p>

                  </td>

                </tr>

              ) : (

                filteredShapes.map((shape) => (

                  <tr
                    key={shape.id}
                    className="shape-row"
                  >

                    {/* ==========================
                        SHAPE
                    ========================== */}

                    <td className="shape-name-cell">

                      <div className="shape-name-wrapper">

                        <div className="shape-icon-box">

                          {shape.image_url ? (

                            <img
                              src={`${API_URL}${shape.image_url}`}
                              alt={shape.name}
                              className="shape-image"
                            />

                          ) : (

                            <FaShapes className="shape-default-icon" />

                          )}

                        </div>

                        <div className="shape-name-content">

                          <strong>
                            {shape.name}
                          </strong>

                          <span>
                            {shape.slug}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* ==========================
                        PRODUCTS
                    ========================== */}

                    <td className="products-cell">

                      {getProductCount(shape)}

                    </td>


                    {/* ==========================
                        STATUS
                    ========================== */}

                    <td className="status-cell">

                      <span
                        className={
                          shape.status
                            ? "shape-status active"
                            : "shape-status inactive"
                        }
                      >

                        <span className="status-dot"></span>

                        {shape.status
                          ? "Active"
                          : "Inactive"
                        }

                      </span>

                    </td>


                    {/* ==========================
                        ACTIONS
                    ========================== */}

                    <td className="actions-cell">

                      <div className="shape-actions">

                        <Link
                          to={`/admin/shapes/edit/${shape.id}`}
                          className="shape-action edit"
                          title="Edit Shape"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          type="button"
                          className="shape-action delete"
                          onClick={() =>
                            deleteShape(shape.id)
                          }
                          title="Delete Shape"
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

      <div className="shape-mobile-list">

        {filteredShapes.length === 0 ? (

          <div className="shape-mobile-empty">

            <div className="shape-empty-icon">
              <FaShapes />
            </div>

            <h3>
              No shapes found
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Create your first shape."
              }
            </p>

          </div>

        ) : (

          filteredShapes.map((shape) => (

            <div
              className="shape-mobile-card"
              key={shape.id}
            >

              {/* TOP */}

              <div className="shape-mobile-top">

                <div className="shape-icon-box">

                  {shape.image_url ? (

                    <img
                      src={`${API_URL}${shape.image_url}`}
                      alt={shape.name}
                      className="shape-image"
                    />

                  ) : (

                    <FaShapes className="shape-default-icon" />

                  )}

                </div>

                <div className="shape-name-content">

                  <strong>
                    {shape.name}
                  </strong>

                  <span>
                    {shape.slug}
                  </span>

                </div>

              </div>


              {/* DETAILS */}

              <div className="shape-mobile-details">

                <div className="mobile-detail">

                  <span>
                    Products
                  </span>

                  <strong>
                    {getProductCount(shape)}
                  </strong>

                </div>


                <div className="mobile-detail">

                  <span>
                    Status
                  </span>

                  <span
                    className={
                      shape.status
                        ? "shape-status active"
                        : "shape-status inactive"
                    }
                  >

                    <span className="status-dot"></span>

                    {shape.status
                      ? "Active"
                      : "Inactive"
                    }

                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="shape-mobile-actions">

                <Link
                  to={`/admin/shapes/edit/${shape.id}`}
                  className="shape-mobile-action edit"
                >
                  <FaEdit />
                  <span>Edit</span>
                </Link>

                <button
                  type="button"
                  className="shape-mobile-action delete"
                  onClick={() =>
                    deleteShape(shape.id)
                  }
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default ShapeList;