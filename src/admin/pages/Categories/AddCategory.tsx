// import { useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/category.css";

// const API_URL = import.meta.env.VITE_API_URL;

// const AddCategory = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [status, setStatus] = useState(true);

//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState("");

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Auto Generate Slug
//   const generateSlug = (value: string) => {
//     return value
//       .toLowerCase()
//       .trim()
//       .replace(/\s+/g, "-")
//       .replace(/[^\w-]+/g, "");
//   };

//   // Category Name Change
//   const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;

//     setName(value);
//     setSlug(generateSlug(value));
//   };

//   // Image Change
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;

//     const file = e.target.files[0];

//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   // Submit Form
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!name.trim()) {
//       setError("Category name is required.");
//       return;
//     }

//     if (!image) {
//       setError("Please select an image.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Upload Image
//       const uploadData = new FormData();

//       uploadData.append("image", image);
//       uploadData.append("folder", "categories");

//       const uploadRes = await fetch(`${API_URL}/api/admin/upload`, {
//         method: "POST",
//         body: uploadData,
//       });

//       const uploadJson = await uploadRes.json();

//       if (!uploadRes.ok || !uploadJson.success) {
//         throw new Error(uploadJson.message || "Image upload failed.");
//       }

//       const imageId = uploadJson.image.id;

//       // Save Category
//       const categoryData = new FormData();

//       categoryData.append("name", name);
//       categoryData.append("slug", slug);
//       categoryData.append("image_id", imageId);
//       categoryData.append("status", status.toString());

//       const categoryRes = await fetch(
//         `${API_URL}/api/admin/categories`,
//         {
//           method: "POST",
//           body: categoryData,
//         }
//       );

//       const categoryJson = await categoryRes.json();

//       if (!categoryRes.ok || !categoryJson.success) {
//         throw new Error(categoryJson.message || "Category creation failed.");
//       }

//       setSuccess("Category added successfully.");

//       setTimeout(() => {
//         navigate("/admin/categories");
//       }, 1200);
//     } catch (err: any) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="category-page">
//       <div className="page-header">
//         <div>
//           <h2>Add Category</h2>
//           <p>Create a new category for your website.</p>
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
//                 placeholder="Enter category name"
//                 value={name}
//                 onChange={handleNameChange}
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
//                 {loading ? "Saving..." : "Save Category"}
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
//                   <img src={preview} alt="Preview" />
//                 </div>
//               ) : (
//                 <div className="preview-placeholder">No Image Selected</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddCategory;

import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/category.css";

const API_URL = import.meta.env.VITE_API_URL;

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState(true);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     AUTO GENERATE SLUG
  ===================================================== */

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  /* =====================================================
     CATEGORY NAME CHANGE
  ===================================================== */

  const handleNameChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setName(value);
    setSlug(generateSlug(value));
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

    const file = e.target.files[0];

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  /* =====================================================
     SUBMIT FORM
  ===================================================== */

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /* Validate name */

    if (!name.trim()) {
      setError(
        "Category name is required."
      );

      return;
    }

    /* Validate image */

    if (!image) {
      setError(
        "Please select an image."
      );

      return;
    }

    try {
      setLoading(true);

      /* =================================================
         UPLOAD IMAGE
      ================================================= */

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

      const uploadRes =
        await fetch(
          `${API_URL}/api/admin/upload`,
          {
            method: "POST",
            body: uploadData,
          }
        );

      const uploadJson =
        await uploadRes.json();

      if (
        !uploadRes.ok ||
        !uploadJson.success
      ) {
        throw new Error(
          uploadJson.message ||
            "Image upload failed."
        );
      }

      const imageId =
        uploadJson.image.id;

      /* =================================================
         SAVE CATEGORY
      ================================================= */

      const categoryData =
        new FormData();

      categoryData.append(
        "name",
        name
      );

      categoryData.append(
        "slug",
        slug
      );

      categoryData.append(
        "image_id",
        String(imageId)
      );

      categoryData.append(
        "status",
        status.toString()
      );

      const categoryRes =
        await fetch(
          `${API_URL}/api/admin/categories`,
          {
            method: "POST",
            body: categoryData,
          }
        );

      const categoryJson =
        await categoryRes.json();

      if (
        !categoryRes.ok ||
        !categoryJson.success
      ) {
        throw new Error(
          categoryJson.message ||
            "Category creation failed."
        );
      }

      /* =================================================
         SUCCESS
      ================================================= */

      setSuccess(
        "Category added successfully."
      );

      setTimeout(() => {
        navigate(
          "/admin/categories"
        );
      }, 1200);

    } catch (err: any) {

      setError(
        err.message ||
          "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="category-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="category-page-header">

        <div className="category-header-content">

          <h2>
            Add Category
          </h2>

          <p>
            Create a new category for your website.
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
              LEFT CARD
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
                placeholder="Enter category name"
                value={name}
                onChange={
                  handleNameChange
                }
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
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Create Category"}
              </button>

            </div>

          </div>

          {/* =================================================
              RIGHT IMAGE CARD
          ================================================= */}

          <div className="category-right">

            <div className="form-card-title">
              Category Image
            </div>

            <label className="upload-label">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
            />

            {/* IMAGE PREVIEW */}

            {preview ? (

              <div className="preview-box">

                <img
                  src={preview}
                  alt="Category Preview"
                />

              </div>

            ) : (

              <div className="preview-placeholder">

                <div className="preview-icon">
                  ✦
                </div>

                <span>
                  No Image Selected
                </span>

                <small>
                  Select an image to preview it here
                </small>

              </div>

            )}

          </div>

        </div>

      </form>

    </div>
  );
};

export default AddCategory;