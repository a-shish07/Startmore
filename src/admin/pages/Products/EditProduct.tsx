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
interface ProductImage {
  id: number;
  image_id: number;
  url: string;
}

/* ==========================================
   COMPONENT
========================================== */

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ---------- Dropdown ---------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);

  /* ---------- Sizes ---------- */
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  /* ---------- Product ---------- */
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
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

  /* ---------- UI ---------- */
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==========================================
     LOAD CATEGORIES
  ========================================== */

  const fetchCategories = async () => {
    const response = await fetch(`${API_URL}/api/admin/categories`);
    const data = await response.json();
    if (data.success) {
      setCategories(data.categories);
    }
  };

  /* ==========================================
     LOAD SHAPES
  ========================================== */

  const fetchShapes = async () => {
    const response = await fetch(`${API_URL}/api/admin/shapes`);
    const data = await response.json();
    if (data.success) {
      setShapes(data.shapes);
    }
  };
  /* ==========================================
     Sizes
  ========================================== */
  const fetchSizes = async () => {

  const response = await fetch(
    `${API_URL}/api/admin/sizes`
  );

  const data = await response.json();

  if (data.success) {
    setSizes(data.sizes);
  }

};
  /* ==========================================
     LOAD PRODUCT
  ========================================== */

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/admin/products/${id}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      const product = data.product;

      setCategoryId(product.category_id.toString());
      setShapeId(product.shape_id.toString());
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description || "");
      setPrice(product.price);
      setDiscountPrice(product.discount_price || "");
      setShippingCost(product.shipping_cost ?? "0");
      setStock(product.stock);
      setSku(product.sku || "");
      setFeatured(product.featured);
      setBestSeller(product.best_seller);
      setNewArrival(product.new_arrival);
      setOnSale(product.on_sale);
      setStatus(product.status);
      setMetaTitle(product.meta_title || "");
      setMetaDescription(product.meta_description || "");

      if (product.images) {
        setExistingImages(product.images);
      }
      if (product.sizes) {

  setSelectedSizes(
    product.sizes.map(
      (size: Size) => size.id
    )
  );

}
    } catch (error) {
      console.error(error);
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchShapes();
    fetchSizes();
    fetchProduct();
  }, []);

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
     SELECT NEW IMAGES
  ========================================== */

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  /* ==========================================
     UPLOAD NEW IMAGES
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

      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error("Image upload failed");
      }

      imageIds.push(data.image.id);
    }

    return imageIds;
  };

  /* ==========================================
     REMOVE EXISTING IMAGE
  ========================================== */

  const removeExistingImage = (imageId: number) => {
    const updatedImages = existingImages.filter(
      (image) => image.image_id !== imageId
    );
    setExistingImages(updatedImages);
  };

  /* ==========================================
     REMOVE NEW PREVIEW IMAGE
  ========================================== */

  const removePreviewImage = (index: number) => {
    const files = [...selectedFiles];
    const previews = [...previewImages];

    files.splice(index, 1);
    previews.splice(index, 1);

    setSelectedFiles(files);
    setPreviewImages(previews);
  };

  /* ==========================================
     UPDATE PRODUCT
  ========================================== */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      /* ---------- Upload New Images ---------- */
      const newImageIds = await uploadImages();

      /* ---------- Existing Image IDs ---------- */
      const existingImageIds = existingImages.map(
        (image) => image.image_id
      );

      /* ---------- Merge Images ---------- */
      const allImages = [
        ...existingImageIds,
        ...newImageIds,
      ];

      /* ---------- Prepare FormData ---------- */
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
      formData.append("featured", featured.toString());
      formData.append("best_seller", bestSeller.toString());
      formData.append("new_arrival", newArrival.toString());
      formData.append("on_sale", onSale.toString());
      formData.append("status", status.toString());
      formData.append("meta_title", metaTitle);
      formData.append("meta_description", metaDescription);
      formData.append("images", JSON.stringify(allImages));
      formData.append("sizes",JSON.stringify(selectedSizes));

      /* ---------- Update Product ---------- */
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Product updated successfully.");
        setTimeout(() => {
          navigate("/admin/products");
        }, 1200);
      } else {
        setError(data.message || "Failed to update product.");
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
      <h2>Edit Product</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form className="product-form" onSubmit={handleSubmit}>
        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
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
            onChange={(e) => setShapeId(e.target.value)}
            required
          >
            <option value="">Select Shape</option>
            {shapes.map((shape) => (
              <option key={shape.id} value={shape.id}>
                {shape.name}
              </option>
            ))}
          </select>
        </div>

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

        {size.name}

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
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Slug */}
        <div className="form-group">
          <label>Slug</label>
          <input type="text" value={slug} readOnly />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Discount Price */}
        <div className="form-group">
          <label>Discount Price</label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
        </div>

        {/* Shipping */}
        <div className="form-group full-width">
          <label>Shipping Cost per Item</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            required
          />
          <small>Charged once for each unit of this product in the order.</small>
        </div>

        {/* Stock */}
        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        {/* SKU */}
        <div className="form-group">
          <label>SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        {/* Existing Images */}
        <div className="form-group full-width">
          <label>Existing Images</label>
          <div className="image-preview-grid">
            {existingImages.map((image) => (
              <div key={image.image_id} className="preview-wrapper">
                <img
                  src={`http://localhost:3000${image.url}`}
                  alt=""
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeExistingImage(image.image_id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div className="form-group full-width">
          <label>Add More Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Preview New Images */}
        {previewImages.length > 0 && (
          <div className="form-group full-width">
            <label>New Images</label>
            <div className="image-preview-grid">
              {previewImages.map((image, index) => (
                <div key={index} className="preview-wrapper">
                  <img src={image} alt="" className="preview-image" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removePreviewImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checkboxes */}
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>

          <label>
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
            />
            Best Seller
          </label>

          <label>
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) => setNewArrival(e.target.checked)}
            />
            New Arrival
          </label>

          <label>
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
            />
            On Sale
          </label>

          <label>
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
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
            onChange={(e) => setMetaTitle(e.target.value)}
          />
        </div>

        {/* Meta Description */}
        <div className="form-group full-width">
          <label>Meta Description</label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
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

export default EditProduct;
