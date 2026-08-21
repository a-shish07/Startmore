import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/product.css";

const API_URL = import.meta.env.VITE_API_URL;

/* ==========================================
   INTERFACES
========================================== */

interface Category {
  id: number;
  name: string;
}

interface Shape {
  id: number;
  name: string;
}

interface Size {
  id: number;
  name: string;
}

/* ==========================================
   COMPONENT
========================================== */

const AddProduct = () => {

  const navigate = useNavigate();

  /* ---------- Dropdown Data ---------- */

  const [categories, setCategories] = useState<Category[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  /* ---------- Product Fields ---------- */

  const [categoryId, setCategoryId] = useState("");
  const [shapeId, setShapeId] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  const [discountPrice, setDiscountPrice] = useState("");

  const [shippingCost, setShippingCost] = useState("0");

  const [stock, setStock] = useState("");

  const [sku, setSku] = useState("");

  const [featured, setFeatured] = useState(false);

  const [bestSeller, setBestSeller] = useState(false);

  const [newArrival, setNewArrival] = useState(false);

  const [onSale, setOnSale] = useState(false);

  const [status, setStatus] = useState(true);

  const [metaTitle, setMetaTitle] = useState("");

  const [metaDescription, setMetaDescription] = useState("");

  /* ---------- Images ---------- */

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  /* ---------- UI ---------- */

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  /* ==========================================
     AUTO GENERATE SLUG
  ========================================== */

  useEffect(() => {

    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    setSlug(generatedSlug);

  }, [name]);

  /* ==========================================
     LOAD CATEGORIES
  ========================================== */

  const fetchCategories = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/admin/categories`
      );

      const data = await response.json();

      if (data.success) {

        setCategories(data.categories);

      }

    } catch (error) {

      console.error(error);

    }

  };

  /* ==========================================
     LOAD SHAPES
  ========================================== */

  const fetchShapes = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/admin/shapes`
      );

      const data = await response.json();

      if (data.success) {

        setShapes(data.shapes);

      }

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    fetchCategories();

    fetchShapes();

    fetchSizes();

  }, []);
 /* ==========================================
     LOAD SIZES
  ========================================== */

const fetchSizes = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/sizes`
    );

    const data = await response.json();

    if (data.success) {
      setSizes(data.sizes);
    }
  } catch (error) {
    console.error(error);
  }
};


  /* ==========================================
     SELECT IMAGES
  ========================================== */

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setSelectedFiles(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);

  };

  /* ==========================================
     UPLOAD IMAGES
  ========================================== */

  const uploadImages = async (): Promise<number[]> => {

    const imageIds: number[] = [];

    if (selectedFiles.length === 0) {

      return imageIds;

    }

    for (const file of selectedFiles) {

      const uploadData = new FormData();

      uploadData.append("image", file);

      uploadData.append("folder", "products");

      const response = await fetch(
        `${API_URL}/api/admin/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!data.success) {

        throw new Error("Image upload failed");

      }

      imageIds.push(data.image.id);

    }

    return imageIds;

  };

  /* ==========================================
     SAVE PRODUCT
  ========================================== */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    setMessage("");

    try {

      const imageIds = await uploadImages();

      const formData = new FormData();

      formData.append("category_id", categoryId);

      formData.append("shape_id", shapeId);

      formData.append("name", name);

      formData.append("slug", slug);

      formData.append("description", description);

      formData.append("price", price);

      formData.append("discount_price", discountPrice);

      formData.append("shipping_cost", shippingCost);

      formData.append("stock", stock);

      formData.append("sku", sku);

      formData.append(
        "featured",
        featured.toString()
      );

      formData.append(
        "best_seller",
        bestSeller.toString()
      );

      formData.append(
        "new_arrival",
        newArrival.toString()
      );

      formData.append(
        "on_sale",
        onSale.toString()
      );

      formData.append(
        "status",
        status.toString()
      );

      formData.append(
        "meta_title",
        metaTitle
      );

      formData.append(
        "meta_description",
        metaDescription
      );

      formData.append(
        "images",
        JSON.stringify(imageIds)
      );
      formData.append(
        "sizes",
        JSON.stringify(selectedSizes)
    );

      const response = await fetch(
        `${API_URL}/api/admin/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {

        setMessage("Product added successfully.");

        setTimeout(() => {

          navigate("/admin/products");

        }, 1200);

      } else {

        setError(
          data.message || "Failed to save product."
        );

      }

    } catch (error) {

      console.error(error);

      setError("Something went wrong.");

    } finally {

      setLoading(false);

    }

  };

  return (
<div className="add-product-page">

  <h2>Add New Product</h2>

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

  <form
    className="product-form"
    onSubmit={handleSubmit}
  >

    {/* Category */}

    <div className="form-group">

      <label>Category</label>

      <select
        value={categoryId}
        onChange={(e) =>
          setCategoryId(e.target.value)
        }
        required
      >

        <option value="">
          Select Category
        </option>

        {categories.map((category) => (

          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>

        ))}

      </select>

    </div>

    {/* Shape */}

    <div className="form-group">

      <label>Shape</label>

      <select
        value={shapeId}
        onChange={(e) =>
          setShapeId(e.target.value)
        }
        required
      >

        <option value="">
          Select Shape
        </option>

        {shapes.map((shape) => (

          <option
            key={shape.id}
            value={shape.id}
          >
            {shape.name}
          </option>

        ))}

      </select>

    </div>
{/* Available Sizes */}

<div className="form-group full-width">

  <label>Available Sizes</label>

  <div className="size-grid">

    {sizes.map((size) => (

      <label
        key={size.id}
        className="size-item"
      >
        <input
          type="checkbox"
          checked={selectedSizes.includes(size.id)}
          onChange={(e) => {

            if (e.target.checked) {

              setSelectedSizes([
                ...selectedSizes,
                size.id,
              ]);

            } else {

              setSelectedSizes(
                selectedSizes.filter(
                  (id) => id !== size.id
                )
              );

            }

          }}
        />

        <span>{size.name}</span>

      </label>

    ))}

  </div>

</div>
    {/* Product Name */}

    <div className="form-group">

      <label>Product Name</label>

      <input
        type="text"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        required
      />

    </div>

    {/* Slug */}

    <div className="form-group">

      <label>Slug</label>

      <input
        type="text"
        value={slug}
        readOnly
      />

    </div>

    {/* Description */}

    <div className="form-group full-width">

      <label>Description</label>

      <textarea
        rows={5}
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

    </div>

    {/* Price */}

    <div className="form-group">

      <label>Price</label>

      <input
        type="number"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
        required
      />

    </div>

    {/* Discount Price */}

    <div className="form-group">

      <label>Discount Price</label>

      <input
        type="number"
        value={discountPrice}
        onChange={(e) =>
          setDiscountPrice(e.target.value)
        }
      />

    </div>

    {/* Stock */}

    <div className="form-group">

      <label>Shipping Cost (per item)</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={shippingCost}
        onChange={(e) => setShippingCost(e.target.value)}
        required
      />

    </div>

    <div className="form-group">

      <label>Stock</label>

      <input
        type="number"
        value={stock}
        onChange={(e) =>
          setStock(e.target.value)
        }
        required
      />

    </div>

    {/* SKU */}

    <div className="form-group">

      <label>SKU</label>

      <input
        type="text"
        value={sku}
        onChange={(e) =>
          setSku(e.target.value)
        }
      />

    </div>

    {/* Images */}

    <div className="form-group full-width">

      <label>Product Images</label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />

      {previewImages.length > 0 && (

        <div className="image-preview-grid">

          {previewImages.map((image, index) => (

            <img
              key={index}
              src={image}
              alt={`Preview ${index + 1}`}
              className="preview-image"
            />

          ))}

        </div>

      )}

    </div>

    {/* Checkboxes */}

    <div className="checkbox-group">

      <label>

        <input
          type="checkbox"
          checked={featured}
          onChange={(e) =>
            setFeatured(e.target.checked)
          }
        />

        Featured

      </label>

      <label>

        <input
          type="checkbox"
          checked={bestSeller}
          onChange={(e) =>
            setBestSeller(e.target.checked)
          }
        />

        Best Seller

      </label>

      <label>

        <input
          type="checkbox"
          checked={newArrival}
          onChange={(e) =>
            setNewArrival(e.target.checked)
          }
        />

        New Arrival

      </label>

      <label>

        <input
          type="checkbox"
          checked={onSale}
          onChange={(e) =>
            setOnSale(e.target.checked)
          }
        />

        On Sale

      </label>

      <label>

        <input
          type="checkbox"
          checked={status}
          onChange={(e) =>
            setStatus(e.target.checked)
          }
        />

        Active

      </label>

    </div>

    {/* Meta Title */}

    <div className="form-group full-width">

      <label>Meta Title</label>

      <input
        type="text"
        value={metaTitle}
        onChange={(e) =>
          setMetaTitle(e.target.value)
        }
      />

    </div>

    {/* Meta Description */}

<div className="form-group full-width">

  <label>Meta Description</label>

  <textarea
    rows={3}
    value={metaDescription}
    onChange={(e) =>
      setMetaDescription(e.target.value)
    }
  />

</div>

{/* Buttons */}

<div className="form-actions">

  <button
    type="submit"
    className="save-btn"
    disabled={loading}
  >
    {loading ? "Saving..." : "Save Product"}
  </button>

  <button
    type="button"
    className="cancel-btn"
    onClick={() => navigate("/admin/products")}
  >
    Cancel
  </button>

</div>

</form>

</div>

);

};

export default AddProduct;
