// import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../../styles/category.css";

// const API_URL = import.meta.env.VITE_API_URL;

// const EditCategory = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [status, setStatus] = useState(true);

//   const [imageId, setImageId] = useState<number | null>(null);
//   const [preview, setPreview] = useState("");

//   const [image, setImage] = useState<File | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ----------------------------
//   // Load Category
//   // ----------------------------
//   useEffect(() => {
//     fetchCategory();
//   }, []);

//   const fetchCategory = async () => {
//     try {
//       const response = await fetch(
//         `${API_URL}/api/admin/categories/${id}`
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Unable to load category.");
//       }

//       const category = data.category;

//       setName(category.name);
//       setSlug(category.slug);
//       setStatus(category.status);
//       setImageId(category.image_id);

//       if (category.image_url) {
//         setPreview(`${API_URL}${category.image_url}`);
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setPageLoading(false);
//     }
//   };

//   // ----------------------------
//   // Slug Generator
//   // ----------------------------
//   const generateSlug = (value: string) => {
//     return value
//       .toLowerCase()
//       .trim()
//       .replace(/\s+/g, "-")
//       .replace(/[^\w-]+/g, "");
//   };

//   // ----------------------------
//   // Name Change
//   // ----------------------------
//   const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setName(value);
//     setSlug(generateSlug(value));
//   };

//   // ----------------------------
//   // Image Change
//   // ----------------------------
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;

//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   // ----------------------------
//   // Update Category
//   // ----------------------------
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!name.trim()) {
//       setError("Category name is required.");
//       return;
//     }

//     try {
//       setLoading(true);
//       let finalImageId = imageId;

//       // Upload new image if selected
//       if (image) {
//         const uploadData = new FormData();
//         uploadData.append("image", image);
//         uploadData.append("folder", "categories");

//         const uploadResponse = await fetch(
//           `${API_URL}/api/admin/upload`,
//           {
//             method: "POST",
//             body: uploadData,
//           }
//         );

//         const uploadJson = await uploadResponse.json();

//         if (!uploadResponse.ok || !uploadJson.success) {
//           throw new Error(
//             uploadJson.message || "Image upload failed."
//           );
//         }

//         finalImageId = uploadJson.image.id;
//       }

//       // Update Category
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("slug", slug);
//       formData.append("image_id", String(finalImageId));
//       formData.append("status", status.toString());

//       const response = await fetch(
//         `${API_URL}/api/admin/categories/${id}`,
//         {
//           method: "PUT",
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message || "Category update failed."
//         );
//       }

//       setSuccess("Category updated successfully.");

//       setTimeout(() => {
//         navigate("/admin/categories");
//       }, 1200);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (pageLoading) {
//     return (
//       <div className="category-page">
//         <div className="loading-box">Loading category...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="category-page">
//       <div className="page-header">
//         <div>
//           <h2>Edit Category</h2>
//           <p>Update category information.</p>
//         </div>

//         <button
//           className="btn-secondary"
//           onClick={() => navigate("/admin/categories")}
//         >
//           &larr; Back
//         </button>
//       </div>

//       <form className="category-form" onSubmit={handleSubmit}>
//         <div className="category-grid">
//           {/* Left Side */}
//           <div className="category-left">
//             <div className="form-group">
//               <label>Category Name *</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={handleNameChange}
//                 placeholder="Category Name"
//               />
//             </div>

//             <div className="form-group">
//               <label>Slug</label>
//               <input
//                 type="text"
//                 value={slug}
//                 onChange={(e) => setSlug(e.target.value)}
//               />
//             </div>

//             <div className="form-group">
//               <label>Status</label>
//               <select
//                 value={status ? "true" : "false"}
//                 onChange={(e) => setStatus(e.target.value === "true")}
//               >
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>

//             {error && <div className="alert error">{error}</div>}

//             {success && <div className="alert success">{success}</div>}

//             <div className="button-group">
//               <button
//                 type="submit"
//                 className="btn-primary"
//                 disabled={loading}
//               >
//                 {loading ? "Updating..." : "Update Category"}
//               </button>

//               <button
//                 type="button"
//                 className="btn-secondary"
//                 onClick={() => navigate("/admin/categories")}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>

//           {/* Right Side */}
//           <div className="category-right">
//             <div className="upload-card">
//               <label className="upload-label">Category Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />

//               {preview ? (
//                 <div className="preview-box">
//                   <img src={preview} alt="Category Preview" />
//                 </div>
//               ) : (
//                 <div className="preview-placeholder">
//                   No Image Available
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditCategory;


import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../../styles/category.css";

const API_URL = import.meta.env.VITE_API_URL;

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* =====================================================
     STATE
  ===================================================== */

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState(true);

  const [imageId, setImageId] =
    useState<number | null>(null);

  const [preview, setPreview] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =====================================================
     LOAD CATEGORY
  ===================================================== */

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setPageLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/categories/${id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load category."
        );
      }

      const category = data.category;

      /* -----------------------------
         Category Information
      ----------------------------- */

      setName(
        category.name || ""
      );

      setSlug(
        category.slug || ""
      );

      setStatus(
        Boolean(category.status)
      );

      setImageId(
        category.image_id ?? null
      );

      /* -----------------------------
         Existing Image
      ----------------------------- */

      if (category.image_url) {
        setPreview(
          `${API_URL}${category.image_url}`
        );
      } else {
        setPreview("");
      }

    } catch (err: any) {

      console.error(
        "Fetch Category Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load category."
      );

    } finally {

      setPageLoading(false);

    }
  };

  /* =====================================================
     SLUG GENERATOR
  ===================================================== */

  const generateSlug = (
    value: string
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  /* =====================================================
     NAME CHANGE
  ===================================================== */

  const handleNameChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      e.target.value;

    setName(value);

    setSlug(
      generateSlug(value)
    );
  };

  /* =====================================================
     IMAGE CHANGE
  ===================================================== */

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {

    if (
      !e.target.files ||
      e.target.files.length === 0
    ) {
      return;
    }

    const file =
      e.target.files[0];

    setImage(file);

    /*
      Show the newly selected
      image immediately.
    */

    setPreview(
      URL.createObjectURL(file)
    );
  };

  /* =====================================================
     UPDATE CATEGORY
  ===================================================== */

  const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    /* -----------------------------
       Validate Name
    ----------------------------- */

    if (!name.trim()) {

      setError(
        "Category name is required."
      );

      return;
    }

    if (!slug.trim()) {

      setError(
        "Category slug is required."
      );

      return;
    }

    try {

      setLoading(true);

      let finalImageId =
        imageId;

      /* =================================================
         UPLOAD NEW IMAGE
      ================================================= */

      if (image) {

        const uploadData =
          new FormData();

        uploadData.append(
          "image",
          image
        );

        uploadData.append(
          "folder",
          "categories"
        );

        const uploadResponse =
          await fetch(
            `${API_URL}/api/admin/upload`,
            {
              method: "POST",
              body: uploadData,
            }
          );

        const uploadJson =
          await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadJson.success
        ) {

          throw new Error(
            uploadJson.message ||
              "Image upload failed."
          );
        }

        finalImageId =
          uploadJson.image.id;
      }

      /* =================================================
         VALIDATE IMAGE
      ================================================= */

      if (
        finalImageId === null ||
        finalImageId === undefined
      ) {

        throw new Error(
          "Category image is required."
        );
      }

      /* =================================================
         UPDATE CATEGORY
      ================================================= */

      const formData =
        new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "slug",
        slug.trim()
      );

      formData.append(
        "image_id",
        String(finalImageId)
      );

      formData.append(
        "status",
        String(status)
      );

      const response =
        await fetch(
          `${API_URL}/api/admin/categories/${id}`,
          {
            method: "PUT",
            body: formData,
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
            "Category update failed."
        );
      }

      /* =================================================
         SUCCESS
      ================================================= */

      setSuccess(
        "Category updated successfully."
      );

      setTimeout(() => {

        navigate(
          "/admin/categories"
        );

      }, 1200);

    } catch (err: any) {

      console.error(
        "Update Category Error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  /* =====================================================
     PAGE LOADING
  ===================================================== */

  if (pageLoading) {

    return (
      <div className="category-page">

        <div className="category-loading">
          Loading category...
        </div>

      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="category-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="category-page-header">

        <div className="category-header-content">

          <h2>
            Edit Category
          </h2>

          <p>
            Update category information.
          </p>

        </div>

        <button
          type="button"
          className="category-back-btn"
          onClick={() =>
            navigate(
              "/admin/categories"
            )
          }
        >
          <span>←</span>

          Back to Categories

        </button>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="category-form"
        onSubmit={handleSubmit}
      >

        <div className="category-form-layout">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="category-left">

            <div className="form-card-title">
              Category Details
            </div>

            {/* CATEGORY NAME */}

            <div className="form-group">

              <label>
                Category Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={
                  handleNameChange
                }
                placeholder="Enter category name"
              />

            </div>

            {/* SLUG */}

            <div className="form-group">

              <label>
                Slug
              </label>

              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                  )
                }
                placeholder="category-slug"
              />

              <small className="field-help">
                This will be used in the category URL.
              </small>

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={
                  status
                    ? "true"
                    : "false"
                }
                onChange={(e) =>
                  setStatus(
                    e.target.value ===
                      "true"
                  )
                }
              >

                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>

              </select>

            </div>

            {/* ERROR */}

            {error && (

              <div className="category-alert error">
                {error}
              </div>

            )}

            {/* SUCCESS */}

            {success && (

              <div className="category-alert success">
                {success}
              </div>

            )}

            {/* BUTTONS */}

            <div className="button-group">

              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  navigate(
                    "/admin/categories"
                  )
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Category"}
              </button>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="category-right">

            <div className="form-card-title">
              Category Image
            </div>

            <label className="upload-label">
              Upload New Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              disabled={loading}
            />

            {/* =================================================
                IMAGE PREVIEW
            ================================================= */}

            {preview ? (

              <div className="preview-box">

                <img
                  src={preview}
                  alt={
                    name ||
                    "Category Preview"
                  }
                />

              </div>

            ) : (

              <div className="preview-placeholder">

                <div className="preview-icon">
                  ✦
                </div>

                <span>
                  No Image Available
                </span>

                <small>
                  Select an image to replace the current image
                </small>

              </div>

            )}

          </div>

        </div>

      </form>

    </div>
  );
};

export default EditCategory;