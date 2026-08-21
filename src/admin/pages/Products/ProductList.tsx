// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaSearch,
// } from "react-icons/fa";

// import "../../styles/product.css";

// const API_URL = import.meta.env.VITE_API_URL;

// /* ==========================================
//    INTERFACE
// ========================================== */

// interface Product {
//   id: number;

//   category_id: number;
//   category_name: string;

//   shape_id: number;
//   shape_name: string;

//   sizes: string | null;



//   name: string;
//   slug: string;
//   description: string;

//   price: number;
//   discount_price: number;

//   stock: number;

//   sku: string;

//   featured: boolean;
//   best_seller: boolean;
//   new_arrival: boolean;
//   on_sale: boolean;

//   status: boolean;

//   rating: number;
//   review_count: number;

//   meta_title: string;
//   meta_description: string;

//   image_url: string | null;
// }

// /* ==========================================
//    COMPONENT
// ========================================== */

// const ProductList = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   /* ==========================================
//      FETCH PRODUCTS
//   ========================================== */

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(`${API_URL}/api/admin/products`);
//       const data = await response.json();

//       if (data.success) {
//         console.log("Products API Response:", data.products);
//         setProducts(data.products);
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* ==========================================
//      FILTER PRODUCTS
//   ========================================== */

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(search.toLowerCase()) ||
//     product.category_name.toLowerCase().includes(search.toLowerCase()) ||
//     product.shape_name.toLowerCase().includes(search.toLowerCase()) ||
//     product.sku.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ==========================================
//      DELETE PRODUCT
//   ========================================== */

//   const deleteProduct = async (id: number) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this product?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();

//       if (data.success) {
//         setMessage(data.message);
//         fetchProducts();

//         setTimeout(() => {
//           setMessage("");
//         }, 3000);
//       } else {
//         setError(data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Failed to delete product.");
//     }
//   };

//   /* ==========================================
//      LOADING
//   ========================================== */

//   if (loading) {
//     return <div className="page-loading">Loading Products...</div>;
//   }

//   /* ==========================================
//      UI START
//   ========================================== */

//   return (
//     <div className="product-page">
//       <div className="page-header">
//         <div>
//           <h2>Products</h2>
//           <p>Manage your products here.</p>
//         </div>

//         <Link to="/admin/products/add" className="add-btn">
//           <FaPlus /> Add Product
//         </Link>
//       </div>

//       {message && <div className="success-message">{message}</div>}
//       {error && <div className="error-message">{error}</div>}

//       <div className="search-bar">
//         <FaSearch />
//         <input
//           type="text"
//           placeholder="Search product..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* ==========================================
//           DESKTOP TABLE
//       ========================================== */}

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>Image</th>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Shape</th>
//               <th>Sizes</th>
//               <th>Price</th>
//               <th>Stock</th>
//               <th>Featured</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredProducts.length === 0 ? (
//               <tr>
//                 <td colSpan={10} className="empty">
//                   No products found.
//                 </td>
//               </tr>
//             ) : (
//               filteredProducts.map((product) => (
//                 <tr key={product.id}>
//                   <td>
//                     {product.image_url ? (
//                     //   <img
//                     //     src={`http://localhost:3000${product.image_url}`}
//                     //     alt={product.name}
//                     //     className="table-image"
//                     //   />
//                     <img
//                         src={`${API_URL}${product.image_url}`}
//                         alt={product.name}
//                         className="table-image"
//                     />
//                     ) : (
//                       <div className="no-image">No Image</div>
//                     )}
//                   </td>

//                   <td>
//                     <strong>{product.name}</strong>
//                     <br />
//                     <small>{product.sku}</small>
//                   </td>

//                   <td>{product.category_name}</td>
//                   <td>{product.shape_name}</td>
//                   <td>{product.sizes ? product.sizes : "-"}</td>

//                   <td>
//                     £{Number(product.price).toLocaleString()}
//                     {product.discount_price && (
//                       <>
//                         <br />
//                         <small style={{ color: "green" }}>
//                           £{Number(product.discount_price).toLocaleString()}
//                         </small>
//                       </>
//                     )}
//                   </td>

//                   <td>{product.stock}</td>

//                   <td>
//                     <span
//                       className={
//                         product.featured ? "badge active" : "badge inactive"
//                       }
//                     >
//                       {product.featured ? "Yes" : "No"}
//                     </span>
//                   </td>

//                   <td>
//                     <span
//                       className={
//                         product.status ? "badge active" : "badge inactive"
//                       }
//                     >
//                       {product.status ? "Active" : "Inactive"}
//                     </span>
//                   </td>

//                   <td>
//                     <div className="action-buttons">
//                       <Link
//                         to={`/admin/products/edit/${product.id}`}
//                         className="edit-btn"
//                       >
//                         <FaEdit />
//                       </Link>

//                       <button
//                         className="delete-btn"
//                         onClick={() => deleteProduct(product.id)}
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

//       {/* ==========================================
//           MOBILE CARDS
//       ========================================== */}

//       <div className="mobile-cards">
//         {filteredProducts.length === 0 ? (
//           <div className="empty">No products found.</div>
//         ) : (
//           filteredProducts.map((product) => (
//             <div className="mobile-card" key={product.id}>
//               <div className="mobile-image">
//                 {product.image_url ? (
//                 //   <img
//                 //     src={`http://localhost:3000${product.image_url}`}
//                 //     alt={product.name}
//                 //   />
//                 <img
//                     src={`${API_URL}${product.image_url}`}
//                     alt={product.name}
//                 />
//                 ) : (
//                   <div className="no-image">No Image</div>
//                 )}
//               </div>

//               <div className="mobile-content">
//                 <h3>{product.name}</h3>
//                 <p>
//                   <strong>SKU:</strong> {product.sku}
//                 </p>
//                 <p>
//                   <strong>Category:</strong> {product.category_name}
//                 </p>
//                 <p>
//                   <strong>Shape:</strong> {product.shape_name}
//                 </p>
//                 <p><strong>Sizes:</strong>{" "}{product.sizes ? product.sizes : "-"}</p>
//                 <p>
//                   <strong>Price:</strong> £
//                   {Number(product.price).toLocaleString()}
//                 </p>
//                 {product.discount_price && (
//                   <p>
//                     <strong>Discount:</strong> £
//                     {Number(product.discount_price).toLocaleString()}
//                   </p>
//                 )}
//                 <p>
//                   <strong>Stock:</strong> {product.stock}
//                 </p>
//                 <p>
//                   <strong>Featured:</strong>{" "}
//                   <span
//                     className={
//                       product.featured ? "badge active" : "badge inactive"
//                     }
//                   >
//                     {product.featured ? "Yes" : "No"}
//                   </span>
//                 </p>
//                 <p>
//                   <strong>Status:</strong>{" "}
//                   <span
//                     className={
//                       product.status ? "badge active" : "badge inactive"
//                     }
//                   >
//                     {product.status ? "Active" : "Inactive"}
//                   </span>
//                 </p>
//               </div>

//               <div className="card-actions">
//                 <Link
//                   to={`/admin/products/edit/${product.id}`}
//                   className="edit-btn"
//                 >
//                   <FaEdit />
//                 </Link>

//                 <button
//                   className="delete-btn"
//                   onClick={() => deleteProduct(product.id)}
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductList;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

import "../../styles/product.css";

const API_URL = import.meta.env.VITE_API_URL;

/* ==========================================
   INTERFACE
========================================== */

interface Product {
  id: number;

  category_id: number;
  category_name: string;

  shape_id: number;
  shape_name: string;

  sizes: string | null;

  name: string;
  slug: string;
  description: string;

  price: number;
  discount_price: number;

  stock: number;

  sku: string;

  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  on_sale: boolean;

  status: boolean;

  rating: number;
  review_count: number;

  meta_title: string;
  meta_description: string;

  image_url: string | null;
}

/* ==========================================
   COMPONENT
========================================== */

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==========================================
     FETCH PRODUCTS
  ========================================== */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/products`
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(
          data.message || "Failed to load products."
        );
      }
    } catch (err) {
      console.error(err);

      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ==========================================
     FILTER PRODUCTS
  ========================================== */

  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase().trim();

    return (
      product.name
        .toLowerCase()
        .includes(keyword) ||

      product.category_name
        .toLowerCase()
        .includes(keyword) ||

      product.shape_name
        .toLowerCase()
        .includes(keyword) ||

      product.sku
        .toLowerCase()
        .includes(keyword)
    );
  });

  /* ==========================================
     DELETE PRODUCT
  ========================================== */

  const deleteProduct = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/admin/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(
          data.message || "Product deleted successfully."
        );

        await fetchProducts();

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setError(
          data.message || "Failed to delete product."
        );
      }
    } catch (err) {
      console.error(err);

      setError("Failed to delete product.");
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <span>Loading Products...</span>
      </div>
    );
  }

  /* ==========================================
     UI
  ========================================== */

  return (
    <div className="product-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="page-header">

        <div>
          <h2>Products</h2>

          <p>
            Manage your products here.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="add-btn"
        >
          <FaPlus />

          <span>
            Add Product
          </span>
        </Link>

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
          placeholder="Search product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ==========================================
          DESKTOP TABLE
      ========================================== */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Shape</th>
              <th>Sizes</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

            {filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan={10}
                  className="empty"
                >
                  No products found.
                </td>

              </tr>

            ) : (

              filteredProducts.map(
                (product) => (

                  <tr key={product.id}>

                    {/* IMAGE */}

                    <td>

                      {product.image_url ? (

                        <img
                          src={`${API_URL}${product.image_url}`}
                          alt={product.name}
                          className="table-image"
                        />

                      ) : (

                        <div className="no-image">
                          No Image
                        </div>

                      )}

                    </td>


                    {/* NAME */}

                    <td>

                      <div className="product-name">

                        <strong>
                          {product.name}
                        </strong>

                        <small>
                          {product.sku}
                        </small>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>
                      {product.category_name}
                    </td>


                    {/* SHAPE */}

                    <td>
                      {product.shape_name}
                    </td>


                    {/* SIZES */}

                    <td>

                      {product.sizes
                        ? product.sizes
                        : "-"}

                    </td>


                    {/* PRICE */}

                    <td>

                      <div className="price-box">

                        <span className="current-price">
                          £
                          {Number(
                            product.price
                          ).toLocaleString()}
                        </span>

                        {product.discount_price ? (

                          <span className="discount-price">
                            £
                            {Number(
                              product.discount_price
                            ).toLocaleString()}
                          </span>

                        ) : null}

                      </div>

                    </td>


                    {/* STOCK */}

                    <td>

                      <span
                        className={
                          product.stock > 0
                            ? "stock-available"
                            : "stock-empty"
                        }
                      >
                        {product.stock}
                      </span>

                    </td>


                    {/* FEATURED */}

                    <td>

                      <span
                        className={
                          product.featured
                            ? "badge active"
                            : "badge inactive"
                        }
                      >

                        {product.featured
                          ? "Yes"
                          : "No"}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          product.status
                            ? "badge active"
                            : "badge inactive"
                        }
                      >

                        {product.status
                          ? "Active"
                          : "Inactive"}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="edit-btn"
                          title="Edit Product"
                        >
                          <FaEdit />
                        </Link>


                        <button
                          type="button"
                          className="delete-btn"
                          title="Delete Product"
                          onClick={() =>
                            deleteProduct(
                              product.id
                            )
                          }
                        >
                          <FaTrash />
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

        {filteredProducts.length === 0 ? (

          <div className="empty">
            No products found.
          </div>

        ) : (

          filteredProducts.map(
            (product) => (

              <div
                className="mobile-card"
                key={product.id}
              >

                {/* IMAGE */}

                <div className="mobile-image">

                  {product.image_url ? (

                    <img
                      src={`${API_URL}${product.image_url}`}
                      alt={product.name}
                    />

                  ) : (

                    <div className="no-image">
                      No Image
                    </div>

                  )}

                </div>


                {/* CONTENT */}

                <div className="mobile-content">

                  <h3>
                    {product.name}
                  </h3>


                  <p>
                    <strong>
                      SKU:
                    </strong>{" "}
                    {product.sku}
                  </p>


                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {product.category_name}
                  </p>


                  <p>
                    <strong>
                      Shape:
                    </strong>{" "}
                    {product.shape_name}
                  </p>


                  <p>
                    <strong>
                      Sizes:
                    </strong>{" "}
                    {product.sizes
                      ? product.sizes
                      : "-"}
                  </p>


                  <p>
                    <strong>
                      Price:
                    </strong>{" "}
                    £
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </p>


                  {product.discount_price ? (

                    <p>

                      <strong>
                        Discount:
                      </strong>{" "}

                      £
                      {Number(
                        product.discount_price
                      ).toLocaleString()}

                    </p>

                  ) : null}


                  <p>

                    <strong>
                      Stock:
                    </strong>{" "}

                    <span
                      className={
                        product.stock > 0
                          ? "stock-available"
                          : "stock-empty"
                      }
                    >
                      {product.stock}
                    </span>

                  </p>


                  <p>

                    <strong>
                      Featured:
                    </strong>{" "}

                    <span
                      className={
                        product.featured
                          ? "badge active"
                          : "badge inactive"
                      }
                    >
                      {product.featured
                        ? "Yes"
                        : "No"}
                    </span>

                  </p>


                  <p>

                    <strong>
                      Status:
                    </strong>{" "}

                    <span
                      className={
                        product.status
                          ? "badge active"
                          : "badge inactive"
                      }
                    >
                      {product.status
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </p>

                </div>


                {/* ACTIONS */}

                <div className="card-actions">

                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="edit-btn"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </Link>


                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      deleteProduct(
                        product.id
                      )
                    }
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>

                </div>

              </div>

            )

          )

        )}

      </div>

    </div>
  );
};

export default ProductList;