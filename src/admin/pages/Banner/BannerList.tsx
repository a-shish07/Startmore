// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_URL;
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";

// import "../../styles/banner.css";

// const BannerList = () => {
//   const navigate = useNavigate();

// const [banners, setBanners] = useState<any[]>([]);

// const [loading, setLoading] = useState(true);
// useEffect(() => {

//   fetchBanners();

// }, []);

// const fetchBanners = async () => {

//   try {

//     const response = await fetch(
//       `${API_URL}/api/admin/banners`
//     );

//     const data = await response.json();

//     if (data.success) {

//       setBanners(data.data);

//     }

//   } catch (error) {

//     console.error(error);

//   } finally {

//     setLoading(false);

//   }

// };
//   const toggleStatus = (id: number) => {
//     setBanners((prev) =>
//       prev.map((banner) =>
//         banner.id === id
//           ? { ...banner, status: !banner.status }
//           : banner
//       )
//     );
//   };

// const deleteBanner = async (id: number) => {

//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this banner?"
//   );

//   if (!confirmDelete) return;

//   try {

//     const response = await fetch(
//       `${API_URL}/api/admin/banners/${id}`,
//       {
//         method: "DELETE",
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message);
//     }

//     alert("Banner deleted successfully.");

//     // Refresh the list
//     fetchBanners();

//   } catch (error: any) {

//     alert(error.message);

//   }

// };

//   return (
//     <div className="banner-page">

//       <div className="page-header">

//         <div>
//           <h2>Hero Banners</h2>
//           <p>Manage homepage hero banners.</p>
//         </div>

//         <button
//           className="add-banner-btn"
//           onClick={() => navigate("/admin/banners/add")}
//         >
//           <FaPlus />
//           <span>Add Banner</span>
//         </button>

//       </div>

//       <div className="banner-table-card">

//         <div className="table-responsive">

//           <table className="banner-table">

//             <thead>

//               <tr>
//                 <th>Image</th>
//                 <th>Title</th>
//                 <th>Subtitle</th>
//                 <th>Button</th>
//                 <th>Sort</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>

//             </thead>

//             <tbody>

//               {banners.map((banner) => (

//                 <tr key={banner.id}>

//                   <td>

//                    <img
//                     src={`${API_URL}${banner.image_url}`}
//                     alt={banner.title}
//                     className="banner-thumbnail"
//                     />

//                   </td>

//                   <td>{banner.title}</td>

//                   <td>{banner.subtitle}</td>

//                   <td>{banner.button_text}</td>

//                   <td>{banner.sort_order}</td>

//                   <td>

//                     <button
//                       className={
//                         banner.status
//                           ? "status-btn active"
//                           : "status-btn inactive"
//                       }
//                       onClick={() => toggleStatus(banner.id)}
//                     >
//                       {banner.status ? (
//                         <>
//                           <FaEye />
//                           <span>Active</span>
//                         </>
//                       ) : (
//                         <>
//                           <FaEyeSlash />
//                           <span>Inactive</span>
//                         </>
//                       )}
//                     </button>

//                   </td>

//                   <td>

//                     <div className="action-buttons">

//                       {/* <button
//                         className="edit-btn"
//                         onClick={() =>
//                           navigate(`/admin/banners/edit/${banner.id}`)
//                         }
//                       >
//                         <FaEdit />
//                       </button> */}

//                       <button
//                         className="delete-btn"
//                         onClick={() => deleteBanner(banner.id)}
//                       >
//                         <FaTrash />
//                       </button>

//                     </div>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default BannerList;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEyeSlash,
} from "react-icons/fa";

import "../../styles/banner.css";

const API_URL = import.meta.env.VITE_API_URL;


/* ==========================================
   BANNER LIST
========================================== */

const BannerList = () => {

  const navigate = useNavigate();


  /* ==========================================
     STATE
  ========================================== */

  const [banners, setBanners] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);


  /* ==========================================
     IMAGE URL HELPER
  ========================================== */

  const getImageUrl = (
    imagePath: string
  ) => {

    if (!imagePath) {
      return "";
    }


    /* ------------------------------------------
       Already complete URL
    ------------------------------------------ */

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }


    /* ------------------------------------------
       Relative backend path
       
       Example:
       /uploads/banners/banner.jpg
       
       becomes:
       http://localhost:3000/uploads/banners/banner.jpg
    ------------------------------------------ */

    return `${API_URL}${
      imagePath.startsWith("/")
        ? ""
        : "/"
    }${imagePath}`;
  };


  /* ==========================================
     FETCH BANNERS
  ========================================== */

  useEffect(() => {

    fetchBanners();

  }, []);


  const fetchBanners = async () => {

    try {

      setLoading(true);


      const response =
        await fetch(
          `${API_URL}/api/admin/banners`
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load banners."
        );
      }


      if (data.success) {

        setBanners(
          data.data || []
        );

      } else {

        setBanners([]);

      }

    } catch (error) {

      console.error(
        "Fetch banners error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  /* ==========================================
     TOGGLE STATUS
  ========================================== */

  const toggleStatus = (
    id: number
  ) => {

    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              status:
                !banner.status,
            }
          : banner
      )
    );
  };


  /* ==========================================
     DELETE BANNER
  ========================================== */

  const deleteBanner = async (
    id: number
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this banner?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/api/admin/banners/${id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete banner."
        );
      }


      alert(
        "Banner deleted successfully."
      );


      /* Refresh list */

      fetchBanners();

    } catch (error: any) {

      console.error(
        "Delete banner error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete banner."
      );
    }
  };


  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {

    return (
      <div className="banner-page">

        <div className="banner-loading">

          Loading banners...

        </div>

      </div>
    );
  }


  /* ==========================================
     PAGE
  ========================================== */

  return (

    <div className="banner-page">


      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="page-header">

        <div>

          <h2>
            Hero Banner
          </h2>

          <p>
            Manage the homepage banner slides
          </p>

        </div>


        <button
          type="button"
          className="add-banner-btn"
          onClick={() =>
            navigate(
              "/admin/banners/add"
            )
          }
        >

          <FaPlus />

          <span>
            Add Banner
          </span>

        </button>

      </div>


      {/* ========================================
          EMPTY STATE
      ======================================== */}

      {banners.length === 0 ? (

        <div className="empty-banner-state">


          <div className="empty-banner-icon">

            <FaEyeSlash />

          </div>


          <h3>
            No banners found
          </h3>


          <p>
            Create your first homepage banner.
          </p>


          <button
            type="button"
            className="add-banner-btn"
            onClick={() =>
              navigate(
                "/admin/banners/add"
              )
            }
          >

            <FaPlus />

            <span>
              Add Banner
            </span>

          </button>

        </div>

      ) : (


        /* ========================================
           BANNER GRID
        ======================================== */

        <div className="banner-grid">


          {banners.map(
            (banner) => (

              <div
                className="banner-card"
                key={banner.id}
              >


                {/* ==================================
                    IMAGE
                ================================== */}

                <div className="banner-image-wrapper">


                  {banner.image_url ? (

                    <img
                      src={getImageUrl(
                        banner.image_url
                      )}
                      alt={
                        banner.title ||
                        "Banner"
                      }
                      className="banner-image"

                      onError={(e) => {

                        console.error(
                          "Banner image failed:",
                          getImageUrl(
                            banner.image_url
                          )
                        );

                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="preview-placeholder">

                      No Image

                    </div>

                  )}

                </div>


                {/* ==================================
                    CARD BODY
                ================================== */}

                <div className="banner-card-body">


                  <div className="banner-info">


                    <h3>
                      {banner.title}
                    </h3>


                    <p>

                      {banner.subtitle ||
                        "No subtitle available"}

                    </p>


                  </div>


                  {/* ==================================
                      CARD FOOTER
                  ================================== */}

                  <div className="banner-card-footer">


                    {/* ==================================
                        STATUS
                    ================================== */}

                    <button
                      type="button"
                      className={`banner-toggle ${
                        banner.status
                          ? "on"
                          : ""
                      }`}
                      onClick={() =>
                        toggleStatus(
                          banner.id
                        )
                      }
                      aria-label={
                        banner.status
                          ? "Deactivate banner"
                          : "Activate banner"
                      }
                    >

                      <span className="toggle-dot" />

                    </button>


                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div className="banner-actions">


                      {/* EDIT */}

                      <button
                        type="button"
                        className="banner-action-btn edit"
                        onClick={() =>
                          navigate(
                            `/admin/banners/edit/${banner.id}`
                          )
                        }
                        title="Edit Banner"
                      >

                        <FaEdit />

                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        className="banner-action-btn delete"
                        onClick={() =>
                          deleteBanner(
                            banner.id
                          )
                        }
                        title="Delete Banner"
                      >

                        <FaTrash />

                      </button>


                    </div>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
};


export default BannerList;