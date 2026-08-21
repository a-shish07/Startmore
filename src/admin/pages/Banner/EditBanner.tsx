// // 

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../../styles/banner.css";

// const EditBanner = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const API_URL = import.meta.env.VITE_API_URL;

//   /* ==========================================
//      STATE
//   ========================================== */

//   const [loading, setLoading] = useState(true);

//   // URL used by <img>
//   const [preview, setPreview] = useState<string | null>(null);

//   // Original / database image path
//   const [imageUrl, setImageUrl] = useState<string>("");

//   // Newly selected image file
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     subtitle: "",
//     description: "",
//     buttonText: "",
//     buttonLink: "",
//     sortOrder: 1,
//     status: true,
//   });


//   /* ==========================================
//      IMAGE URL HELPER
//   ========================================== */

//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) {
//       return "";
//     }

//     // If backend already returns a complete URL
//     if (
//       imagePath.startsWith("http://") ||
//       imagePath.startsWith("https://")
//     ) {
//       return imagePath;
//     }

//     // Add backend URL to relative image path
//     return `${API_URL}${
//       imagePath.startsWith("/") ? "" : "/"
//     }${imagePath}`;
//   };


//   /* ==========================================
//      FETCH BANNER
//   ========================================== */

//   useEffect(() => {
//     if (id) {
//       fetchBanner();
//     }
//   }, [id]);


//   const fetchBanner = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${API_URL}/api/admin/banners/${id}`
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to load banner."
//         );
//       }

//       const banner = data.banner;


//       /* ==========================================
//          SET FORM DATA
//       ========================================== */

//       setFormData({
//         title: banner.title || "",

//         subtitle:
//           banner.subtitle || "",

//         description:
//           banner.description || "",

//         buttonText:
//           banner.button_text || "",

//         buttonLink:
//           banner.button_link || "",

//         sortOrder:
//           banner.sort_order || 1,

//         status:
//           banner.status ?? true,
//       });


//       /* ==========================================
//          SET EXISTING IMAGE
//       ========================================== */

//       const existingImage =
//         banner.image_url || "";

//       // Keep original DB value
//       setImageUrl(existingImage);

//       // Convert it to a browser-accessible URL
//       setPreview(
//         getImageUrl(existingImage)
//       );

//     } catch (error: any) {

//       console.error(
//         "Fetch banner error:",
//         error
//       );

//       alert(error.message);

//     } finally {

//       setLoading(false);

//     }
//   };


//   /* ==========================================
//      HANDLE INPUT CHANGE
//   ========================================== */

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement
//     >
//   ) => {

//     const {
//       name,
//       value,
//       type,
//     } = e.target;


//     /* ==========================================
//        CHECKBOX
//     ========================================== */

//     if (type === "checkbox") {

//       const target =
//         e.target as HTMLInputElement;

//       setFormData((prev) => ({
//         ...prev,

//         [name]:
//           target.checked,
//       }));

//       return;
//     }


//     /* ==========================================
//        NORMAL INPUT
//     ========================================== */

//     setFormData((prev) => ({
//       ...prev,

//       [name]: value,
//     }));
//   };


//   /* ==========================================
//      HANDLE IMAGE CHANGE
//   ========================================== */

//   const handleImage = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {

//     if (
//       !e.target.files ||
//       e.target.files.length === 0
//     ) {
//       return;
//     }

//     const file =
//       e.target.files[0];


//     /* ==========================================
//        STORE NEW FILE
//     ========================================== */

//     setImageFile(file);


//     /* ==========================================
//        SHOW NEW IMAGE PREVIEW
//     ========================================== */

//     const objectUrl =
//       URL.createObjectURL(file);

//     setPreview(objectUrl);
//   };


//   /* ==========================================
//      HANDLE SUBMIT
//   ========================================== */

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {

//     e.preventDefault();

//     try {

//       setLoading(true);


//       /* ==========================================
//          KEEP EXISTING IMAGE
//       ========================================== */

//       let updatedImageUrl =
//         imageUrl;


//       /* ==========================================
//          UPLOAD NEW IMAGE ONLY
//          IF USER SELECTED ONE
//       ========================================== */

//       if (imageFile) {

//         const uploadForm =
//           new FormData();

//         uploadForm.append(
//           "image",
//           imageFile
//         );

//         uploadForm.append(
//           "folder",
//           "banners"
//         );


//         const uploadResponse =
//           await fetch(
//             `${API_URL}/api/admin/upload`,
//             {
//               method: "POST",
//               body: uploadForm,
//             }
//           );


//         const uploadData =
//           await uploadResponse.json();


//         if (!uploadResponse.ok) {

//           throw new Error(
//             uploadData.message ||
//               "Image upload failed."
//           );
//         }


//         /* ==========================================
//            SAVE NEW IMAGE PATH
//         ========================================== */

//         updatedImageUrl =
//           uploadData.image_url;
//       }


//       /* ==========================================
//          UPDATE BANNER
//       ========================================== */

//       const response =
//         await fetch(
//           `${API_URL}/api/admin/banners/${id}`,
//           {
//             method: "PUT",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({

//               title:
//                 formData.title,

//               subtitle:
//                 formData.subtitle,

//               description:
//                 formData.description,

//               image_url:
//                 updatedImageUrl,

//               button_text:
//                 formData.buttonText,

//               button_link:
//                 formData.buttonLink,

//               sort_order:
//                 Number(
//                   formData.sortOrder
//                 ),

//               status:
//                 formData.status,
//             }),
//           }
//         );


//       const data =
//         await response.json();


//       if (!response.ok) {

//         throw new Error(
//           data.message ||
//             "Failed to update banner."
//         );
//       }


//       /* ==========================================
//          SUCCESS
//       ========================================== */

//       alert(
//         "Banner updated successfully."
//       );


//       navigate(
//         "/admin/banners"
//       );

//     } catch (error: any) {

//       console.error(
//         "Update banner error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Something went wrong."
//       );

//     } finally {

//       setLoading(false);

//     }
//   };


//   /* ==========================================
//      LOADING
//   ========================================== */

//   if (loading) {

//     return (
//       <div className="loading-box">
//         Loading Banner...
//       </div>
//     );
//   }


//   /* ==========================================
//      PAGE
//   ========================================== */

//   return (
//     <div className="banner-page">


//       {/* ==========================================
//           PAGE HEADER
//       ========================================== */}

//       <div className="page-header">

//         <div>

//           <h2>
//             Edit Hero Banner
//           </h2>

//           <p>
//             Update your homepage banner
//             information.
//           </p>

//         </div>

//       </div>


//       {/* ==========================================
//           FORM
//       ========================================== */}

//       <form
//         className="banner-form"
//         onSubmit={handleSubmit}
//       >


//         {/* ========================================
//             IMAGE
//         ======================================== */}

//         <div className="form-card">

//           <h3>
//             Banner Image
//           </h3>


//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImage}
//           />


//           <div className="image-preview">

//             {preview ? (

//               <img
//                 src={preview}
//                 alt="Banner Preview"

//                 onError={(e) => {
//                   console.error(
//                     "Image failed to load:",
//                     preview
//                   );

//                   e.currentTarget.style.display =
//                     "none";
//                 }}
//               />

//             ) : (

//               <div className="preview-placeholder">

//                 No Image Selected

//               </div>

//             )}

//           </div>

//         </div>


//         {/* ========================================
//             BANNER DETAILS
//         ======================================== */}

//         <div className="form-card">

//           <h3>
//             Banner Details
//           </h3>


//           {/* TITLE */}

//           <div className="form-group">

//             <label>
//               Title
//             </label>

//             <input
//               type="text"
//               name="title"
//               placeholder="Enter Banner Title"
//               value={formData.title}
//               onChange={handleChange}
//             />

//           </div>


//           {/* SUBTITLE */}

//           <div className="form-group">

//             <label>
//               Subtitle
//             </label>

//             <input
//               type="text"
//               name="subtitle"
//               placeholder="Enter Banner Subtitle"
//               value={formData.subtitle}
//               onChange={handleChange}
//             />

//           </div>


//           {/* DESCRIPTION */}

//           <div className="form-group">

//             <label>
//               Description
//             </label>

//             <textarea
//               name="description"
//               rows={5}
//               placeholder="Enter Banner Description"
//               value={formData.description}
//               onChange={handleChange}
//             />

//           </div>


//           {/* BUTTON TEXT + LINK */}

//           <div className="two-column">


//             <div className="form-group">

//               <label>
//                 Button Text
//               </label>

//               <input
//                 type="text"
//                 name="buttonText"
//                 placeholder="Shop Now"
//                 value={formData.buttonText}
//                 onChange={handleChange}
//               />

//             </div>


//             <div className="form-group">

//               <label>
//                 Button Link
//               </label>

//               <input
//                 type="text"
//                 name="buttonLink"
//                 placeholder="/products"
//                 value={formData.buttonLink}
//                 onChange={handleChange}
//               />

//             </div>

//           </div>


//           {/* SORT + STATUS */}

//           <div className="two-column">


//             <div className="form-group">

//               <label>
//                 Sort Order
//               </label>

//               <input
//                 type="number"
//                 name="sortOrder"
//                 value={formData.sortOrder}
//                 onChange={handleChange}
//               />

//             </div>


//             <div className="form-group checkbox-group">

//               <label>
//                 Status
//               </label>


//               <div className="checkbox">

//                 <input
//                   type="checkbox"
//                   name="status"
//                   checked={
//                     formData.status
//                   }
//                   onChange={handleChange}
//                 />

//                 <span>
//                   Active Banner
//                 </span>

//               </div>

//             </div>

//           </div>

//         </div>


//         {/* ========================================
//             BUTTONS
//         ======================================== */}

//         <div className="submit-section">


//           {/* CANCEL */}

//           <button
//             type="button"
//             className="cancel-btn"
//             onClick={() =>
//               navigate(
//                 "/admin/banners"
//               )
//             }
//             disabled={loading}
//           >
//             Cancel
//           </button>


//           {/* UPDATE */}

//           <button
//             type="submit"
//             className="save-btn"
//             disabled={loading}
//           >

//             {loading
//               ? "Updating..."
//               : "Update Banner"}

//           </button>

//         </div>

//       </form>

//     </div>
//   );
// };

// export default EditBanner;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/banner.css";

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  /* ==========================================
     STATE
  ========================================== */

  const [loading, setLoading] = useState(true);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [imageUrl, setImageUrl] =
    useState<string>("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    sortOrder: 1,
    status: true,
  });


  /* ==========================================
     IMAGE URL
  ========================================== */

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return "";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `${API_URL}${
      imagePath.startsWith("/")
        ? ""
        : "/"
    }${imagePath}`;
  };


  /* ==========================================
     FETCH BANNER
  ========================================== */

  useEffect(() => {
    if (id) {
      fetchBanner();
    }
  }, [id]);


  const fetchBanner = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/banners/${id}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load banner."
        );
      }

      const banner =
        data.banner;


      setFormData({
        title:
          banner.title || "",

        subtitle:
          banner.subtitle || "",

        description:
          banner.description || "",

        buttonText:
          banner.button_text || "",

        buttonLink:
          banner.button_link || "",

        sortOrder:
          banner.sort_order || 1,

        status:
          banner.status ?? true,
      });


      /* ==========================================
         EXISTING IMAGE
      ========================================== */

      setImageUrl(
        banner.image_url || ""
      );

      setPreview(
        getImageUrl(
          banner.image_url || ""
        )
      );

    } catch (error: any) {

      console.error(
        "Fetch banner error:",
        error
      );

      alert(
        error.message
      );

    } finally {

      setLoading(false);

    }
  };


  /* ==========================================
     HANDLE INPUT
  ========================================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
      type,
    } = e.target;


    if (type === "checkbox") {

      const target =
        e.target as HTMLInputElement;

      setFormData((prev) => ({
        ...prev,

        [name]:
          target.checked,
      }));

      return;
    }


    setFormData((prev) => ({
      ...prev,

      [name]:
        value,
    }));
  };


  /* ==========================================
     IMAGE CHANGE
  ========================================== */

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (
      !e.target.files ||
      e.target.files.length === 0
    ) {
      return;
    }

    const file =
      e.target.files[0];

    setImageFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };


  /* ==========================================
     SUBMIT
     SEND FormData
  ========================================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);


      /* ==========================================
         CREATE FORMDATA
      ========================================== */

      const form = new FormData();


      /* ==========================================
         TEXT FIELDS
      ========================================== */

      form.append(
        "title",
        formData.title
      );

      form.append(
        "subtitle",
        formData.subtitle
      );

      form.append(
        "description",
        formData.description
      );

      form.append(
        "button_text",
        formData.buttonText
      );

      form.append(
        "button_link",
        formData.buttonLink
      );

      form.append(
        "sort_order",
        String(formData.sortOrder)
      );

      form.append(
        "status",
        String(formData.status)
      );


      /* ==========================================
         IMAGE
         
         Only append image when user
         selects a new image.
      ========================================== */

      if (imageFile) {

        form.append(
          "image",
          imageFile
        );
      }


      /* ==========================================
         DEBUG
      ========================================== */

      console.log(
        "Sending Edit Banner FormData:"
      );

      for (
        const [key, value]
        of form.entries()
      ) {

        console.log(
          key,
          value
        );
      }


      /* ==========================================
         PUT REQUEST
      ========================================== */

      const response =
        await fetch(
          `${API_URL}/api/admin/banners/${id}`,
          {
            method: "PUT",

            body: form,
          }
        );


      const data =
        await response.json();


      console.log(
        "Update response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
            "Failed to update banner."
        );
      }


      /* ==========================================
         SUCCESS
      ========================================== */

      alert(
        "Banner updated successfully."
      );

      navigate(
        "/admin/banners"
      );

    } catch (error: any) {

      console.error(
        "Update banner error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong."
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
      <div className="loading-box">
        Loading Banner...
      </div>
    );
  }


  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="banner-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="page-header">

        <div>

          <h2>
            Edit Hero Banner
          </h2>

          <p>
            Update your homepage banner
            information.
          </p>

        </div>

      </div>


      {/* ========================================
          FORM
      ======================================== */}

      <form
        className="banner-form"
        onSubmit={handleSubmit}
      >


        {/* ======================================
            IMAGE
        ====================================== */}

        <div className="form-card">

          <h3>
            Banner Image
          </h3>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          <div className="image-preview">

            {preview ? (

              <img
                src={preview}
                alt="Banner Preview"
              />

            ) : (

              <div className="preview-placeholder">
                No Image Selected
              </div>

            )}

          </div>

        </div>


        {/* ======================================
            DETAILS
        ====================================== */}

        <div className="form-card">

          <h3>
            Banner Details
          </h3>


          {/* TITLE */}

          <div className="form-group">

            <label>
              Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter Banner Title"
              value={formData.title}
              onChange={handleChange}
            />

          </div>


          {/* SUBTITLE */}

          <div className="form-group">

            <label>
              Subtitle
            </label>

            <input
              type="text"
              name="subtitle"
              placeholder="Enter Banner Subtitle"
              value={formData.subtitle}
              onChange={handleChange}
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              placeholder="Enter Banner Description"
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* BUTTON */}

          <div className="two-column">

            <div className="form-group">

              <label>
                Button Text
              </label>

              <input
                type="text"
                name="buttonText"
                placeholder="Shop Now"
                value={
                  formData.buttonText
                }
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                Button Link
              </label>

              <input
                type="text"
                name="buttonLink"
                placeholder="/products"
                value={
                  formData.buttonLink
                }
                onChange={handleChange}
              />

            </div>

          </div>


          {/* SORT + STATUS */}

          <div className="two-column">

            <div className="form-group">

              <label>
                Sort Order
              </label>

              <input
                type="number"
                name="sortOrder"
                value={
                  formData.sortOrder
                }
                onChange={handleChange}
              />

            </div>


            <div className="form-group checkbox-group">

              <label>
                Status
              </label>

              <div className="checkbox">

                <input
                  type="checkbox"
                  name="status"
                  checked={
                    formData.status
                  }
                  onChange={handleChange}
                />

                <span>
                  Active Banner
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            BUTTONS
        ====================================== */}

        <div className="submit-section">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(
                "/admin/banners"
              )
            }
            disabled={loading}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Banner"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditBanner;