import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNotif } from "../components/Notification";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

type Page =
  | "home"
  | "products"
  | "detail"
  | "cart"
  | "checkout"
  | "success"
  | "about"
  | "contact"
  | "favorites";

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: Page, productId?: any) => void;
}

// One-line summaries for mobile Col 1 — crisp, evocative, scannable
const shortDescriptions: Record<number, string> = {
  1: "Brilliant-cut diamond in 18k gold. Individually inspected. Built to be worn forever.",
  2: "22k gold, Italian-inspired links. Effortless from boardroom to black tie.",
  3: "Lustrous freshwater pearls in sterling silver. Minimal design, maximum elegance.",
  4: "Deep-blue sapphires on a sterling chain. Bold colour, everyday wearability.",
  5: "18k rose gold, open-end bangle. Stack it or wear it alone — always refined.",
  6: "Natural emerald in hand-engraved 14k gold. Rich colour, timeless symbolism.",
  7: "GIA-certified diamonds in 18k white gold. A signature piece for life.",
  8: "Vivid oval rubies in 18k gold. Rare, radiant, and effortlessly impactful.",
};

const extendedDescriptions: Record<number, string> = {
  1: "This exquisite Diamond Ring is a timeless symbol of elegance and commitment. Expertly crafted with a brilliant-cut diamond set in 18k gold, every facet is designed to capture and reflect light beautifully. The sleek band is polished to a high shine, making it perfect for everyday wear or special occasions. Whether as a gift or a personal treat, this ring embodies luxury that lasts a lifetime. Each piece is individually inspected to meet our highest quality standards before dispatch.",
  2: "This stunning Gold Necklace is handcrafted by our artisans using ethically sourced 22k gold. The intricate link design draws inspiration from classic Italian goldsmithing traditions, updated with a modern sensibility. Lightweight yet substantial, it drapes beautifully against the neckline and pairs effortlessly with both casual and formal attire. Comes presented in our signature gift box, making it an ideal choice for anniversaries, birthdays, or milestone celebrations.",
  3: "Our Pearl Drop Earrings showcase lustrous freshwater pearls, each selected for their exceptional roundness and soft iridescent glow. Set in sterling silver with a secure butterfly clasp, these earrings are as comfortable as they are beautiful. The clean, minimal design allows the natural beauty of the pearl to take centre stage. A versatile piece that transitions seamlessly from a morning meeting to an evening soirée, these earrings are a wardrobe essential.",
  4: "The Sapphire Bracelet features a row of deep blue sapphires set in a delicate sterling silver chain, each stone chosen for its rich, consistent hue. Sapphires are known for their durability and brilliance, making this bracelet both a practical and luxurious accessory. The secure lobster clasp ensures it stays in place throughout the day. Elegant enough for formal events yet understated enough for daily wear, this piece adds a touch of colour and sophistication to any look.",
  5: "This Rose Gold Bangle is forged from premium 18k rose gold, giving it a warm, flattering tone that complements all skin tones. The smooth, polished surface catches the light with every movement, while the solid construction ensures durability. Designed with a subtle open-end style for easy wearability, it can be stacked with other bangles or worn alone for a refined, minimalist look. A truly timeless accessory for the modern woman.",
  6: "Our Emerald Pendant combines a vivid, deep-green natural emerald with a hand-engraved 14k gold setting. The rich colour of the emerald contrasts beautifully with the warm gold, creating a piece that commands attention without being overstated. The pendant hangs from a delicate 18-inch chain, making it ideal for showcasing above a neckline. Emeralds have long been associated with prosperity and vitality — wearing this piece is both a fashion statement and a nod to tradition.",
  7: "The Diamond Tennis Bracelet is a classic of fine jewellery, reimagined for the contemporary collector. A continuous line of round brilliant-cut diamonds is set in a flexible 18k white gold setting, ensuring both security and comfort. Each diamond is GIA-certified and matched for cut, colour, and clarity, resulting in a bracelet that sparkles uniformly from every angle. This is the kind of piece that becomes a signature accessory, worn daily and passed down through generations.",
  8: "These Ruby Stud Earrings feature vibrant, oval-cut rubies encased in a classic four-prong 18k gold setting. The rich red hue of the rubies adds a bold pop of colour to any outfit, making these studs a versatile and impactful choice. The secure push-back fastening ensures all-day comfort. Rubies are one of the rarest and most prized gemstones in the world — owning a pair of these earrings means owning a piece of genuine natural beauty.",
};

const sampleReviews = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    date: "12 Apr 2025",
    comment:
      "Absolutely stunning piece. The quality exceeded my expectations — it looks even better in person than in the photos. Arrived beautifully packaged too.",
  },
  {
    id: 2,
    name: "James T.",
    rating: 4,
    date: "28 Mar 2025",
    comment:
      "Bought this as a gift for my wife and she absolutely loves it. Fast delivery, great presentation. Would only give 5 stars if sizing options were wider.",
  },
  {
    id: 3,
    name: "Priya K.",
    rating: 5,
    date: "5 Mar 2025",
    comment:
      "I've purchased from this store three times now and have never been disappointed. This piece is elegant, well-made, and the customer service was excellent.",
  },
];
const API_URL = import.meta.env.VITE_API_URL;
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: `${size}px`,
            color: s <= rating ? "var(--gold, #c9a84c)" : "#ddd",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function AccordionItem({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <i className={open ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

export default function ProductDetailPage({
  productId,
  onNavigate,
}: ProductDetailProps) {

  const [product, setProduct] = useState<any>(null);


  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "how_to_apply" | "shipping_returns"
  >("description");

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [related, setRelated] = useState<any[]>([]);

const { addToCart, getProductShipping } = useCart();
  const { show } = useNotif();
  const { toggleFavorite, isFavorite } = useFavorites();

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/client/products/${productId}`
      );

      const data = await response.json();

      if (data.success) {
        setProduct(data.product);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/client/products`
      );

      const data = await response.json();

      if (data.success && product) {
        setRelated(
          data.products
            .filter((p: any) => p.id !== product.id)
            .slice(0, 4)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0].name);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const isFav = isFavorite(product.id);
  const shipping = getProductShipping(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product, selectedSize, "");
    }
    show(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    toggleFavorite(product);

    if (!isFav) {
      show(`${product.name} saved to favorites!`);
    }
  };

  const description =
  product.description ||
  extendedDescriptions[product.id] ||
  "No description available.";

  // ─── Shared sub-sections ───────────────────────────────────────────────────

const galleryBlock = (
  <div className="img-gallery">
    <div className="thumb-list">
      {product.images?.map((img: any, i: number) => (
        <img
          key={img.id}
          src={`${API_URL}${img.image_url}`}
          alt={`${product.name} ${i + 1}`}
          className={`thumb${activeImg === i ? " active" : ""}`}
          onClick={() => setActiveImg(i)}
        />
      ))}
    </div>

    <div className="main-img">
      <img
        src={
          product.images?.[activeImg]?.image_url
            ? `${API_URL}${product.images[activeImg].image_url}`
            : "/placeholder.png"
        }
        alt={product.name}
      />
    </div>
  </div>
);

 const infoBlock = (
  <>
    <p className="detail-label">
      {product.category_name}
    </p>

    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <h1
        className="detail-title"
        style={{ margin: 0, flex: 1 }}
      >
        {product.name}
      </h1>

      <button
        onClick={handleWishlist}
        aria-label="Add to wishlist"
        className="wishlist-btn"
      >
        <i
          className={isFav ? "ri-heart-3-fill" : "ri-heart-line"}
          style={{
            fontSize: "16px",
            color: isFav ? "#e63946" : "#aaa",
          }}
        />
      </button>
    </div>

    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginTop: "10px",
        marginBottom: "8px",
      }}
    >
      <StarRating
        rating={Math.round(Number(product.rating || 0))}
      />

      <span
        style={{
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        ({product.review_count} reviews)
      </span>
    </div>

    <div className="detail-price">
      £{product.discount_price || product.price}

      {product.discount_price && (
        <span className="old">
          £{product.price}
        </span>
      )}
    </div>
    <div
  style={{
    fontSize: "13px",
    color: "var(--text-muted)",
    marginTop: "8px",
    marginBottom: "12px",
  }}
>
  <strong>Shipping:</strong>{" "}
  <span style={{ color: shipping === 0 ? "var(--gold)" : "inherit" }}>
    {shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}
  </span>
</div>

    {product.sizes?.length > 0 && (
      <>
        <p className="option-label">
          Size: <strong>{selectedSize}</strong>
        </p>

        <div className="size-options">
          {product.sizes.map((size: any) => (
            <button
              key={size.id}
              className={`size-btn${
                selectedSize === size.name ? " active" : ""
              }`}
              onClick={() => setSelectedSize(size.name)}
            >
              {size.name}
            </button>
          ))}
        </div>
      </>
    )}
  </>
);
  const qtyAndCTABlock = (
    <div className="cta-row">
      <div className="qty-selector-new">
        <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        <input type="number" value={qty} readOnly />
        <button onClick={() => setQty(qty + 1)}>+</button>
      </div>
      <button
        className="btn-buy-now"
        onClick={() => { handleAddToCart(); onNavigate("cart"); }}
      >
        Buy Now
      </button>
      <button className="btn-add-cart-new" onClick={handleAddToCart}>
        Add To Cart
      </button>
    </div>
  );

  const mobileCTABlock = (
    <div className="mobile-cta-stack">
      <div className="qty-selector-new mobile-qty-full">
        <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        <input type="number" value={qty} readOnly />
        <button onClick={() => setQty(qty + 1)}>+</button>
      </div>
      <button
        className="btn-buy-now mobile-full-btn"
        onClick={() => { handleAddToCart(); onNavigate("cart"); }}
      >
        Buy Now
      </button>
      <button className="btn-add-cart-new mobile-full-btn" onClick={handleAddToCart}>
        Add To Cart
      </button>
    </div>
  );

  const reviewsBlock = (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="rating-summary">
        {/* Score + stars + count — top row */}
        <div className="rating-top">
          <span className="rating-score">{Number(product.rating || 0).toFixed(1)}</span>
          <StarRating rating={Math.round(Number(product.rating || 0))} size={13} />
          <span className="rating-count">{product.review_count} reviews</span>
        </div>
        {/* Bars — stacked below, full width */}
        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
            return (
              <div key={star} className="rating-bar-row">
                <span className="bar-label">{star}</span>
                <span className="bar-star">★</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="bar-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {(showAllReviews ? sampleReviews : sampleReviews.slice(0, 2)).map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="reviewer-avatar">{review.name.charAt(0)}</div>
              <div>
                <div className="reviewer-name">{review.name}</div>
                <StarRating rating={review.rating} size={12} />
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{review.date}</span>
          </div>
          <p className="product-body-text review-body">{review.comment}</p>
        </div>
      ))}

      {!showAllReviews && (
        <div style={{ textAlign: "center" }}>
          <button className="view-all-btn" onClick={() => setShowAllReviews(true)}>
            View All Reviews
          </button>
        </div>
      )}
    </div>
  );

  const howToApplyBlock = (
    <div className="product-body-text">
      <p>Follow these steps for a perfect, long-lasting application:</p>
      <ol>
        <li>Clean your natural nails with the provided prep pad.</li>
        <li>Gently push back cuticles using the wooden stick.</li>
        <li>Select the nail size that best fits each of your natural nails.</li>
        <li>Apply the adhesive tab to your natural nail or apply a small drop of glue to the back of the press-on nail.</li>
        <li>Align the press-on nail with your cuticle and press down firmly for 15-30 seconds.</li>
      </ol>
    </div>
  );

  const shippingReturnsBlock = (
    <div className="product-body-text">
      <p><strong>Shipping:</strong> We offer worldwide shipping. Orders are processed within 1-2 business days. Free standard shipping on orders over £50.</p>
      <p style={{ marginTop: "16px" }}><strong>Returns:</strong> Due to the nature of our products, we only accept returns for items that are damaged or defective upon arrival. Please contact us within 14 days of receiving your order to initiate a return.</p>
    </div>
  );

  const desktopTabsBlock = (
    <div className="desktop-tabs-wrap">
      <div className="tab-header-row">
        {(["description", "how_to_apply", "shipping_returns", "reviews"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn${activeTab === tab ? " active" : ""}`}
          >
            {tab === "reviews" ? `REVIEWS (${product.review_count})` : tab === "shipping_returns" ? "SHIPPING & RETURNS" : tab.replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "description" && (
        <div className="product-body-text">
          <p>{description}</p>
          <p style={{ marginTop: "16px" }}>
            Our packaging is designed to make gifting effortless — every order arrives in a premium
            branded box with a ribbon closure and a personalised card slot. We use recycled and
            FSC-certified materials throughout to minimise our environmental impact without
            compromising on the unboxing experience.
          </p>
        </div>
      )}

      {activeTab === "how_to_apply" && howToApplyBlock}
      {activeTab === "shipping_returns" && shippingReturnsBlock}
      {activeTab === "reviews" && reviewsBlock}
    </div>
  );


  
  const relatedBlock = related.length > 0 && (
    <div className="similar-section" style={{ padding: "0 60px 60px", marginTop: "60px" }}>
      <div className="section-header">
        <p className="section-label">You May Also Like</p>
        <h2 className="section-title">Similar Products</h2>
      </div>
      <div className="products-grid">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );

  const breadcrumb = (
    <div className="page-hero breadcrumb-bar">
      <p className="breadcrumb">
        <a onClick={() => onNavigate("home")} style={{ cursor: "pointer", color: "#888" }}>Home</a>
        {" → "}
        <a onClick={() => onNavigate("products")} style={{ cursor: "pointer", color: "#888" }}>Products</a>
        {" → "}
        <span>{product.name}</span>
      </p>
    </div>
  );

  const luxuryExperienceBlock = (
 <section className="luxury-section">
  <div className="luxury-container">

    <div className="luxury-heading">

      <p className="luxury-subtitle">
        Why You’ll Love It
      </p>

      <h2 className="luxury-title">
        Pure Luxury Experience
      </h2>
    </div>

    <div className="luxury-grid">

      <div className="luxury-item">
        <div className="luxury-icon">⏱</div>

        <div>
          <h3 className="luxury-item-title">
            Premium Quality
          </h3>

          <p className="luxury-item-text">
            long-lasting & durable
          </p>
        </div>
      </div>

      <div className="luxury-item">
        <div className="luxury-icon">🍃</div>

        <div>
          <h3 className="luxury-item-title">
            Safe for Natural Nails
          </h3>

          <p className="luxury-item-text">
            non-toxic & gentle
          </p>
        </div>
      </div>

      <div className="luxury-item">
        <div className="luxury-icon">♡</div>

        <div>
          <h3 className="luxury-item-title">
            Vegan & Cruelty-Free
          </h3>

          <p className="luxury-item-text">
            ethical & responsible
          </p>
        </div>
      </div>

      <div className="luxury-item">
        <div className="luxury-icon">✨</div>

        <div>
          <h3 className="luxury-item-title">
            Made with Love
          </h3>

          <p className="luxury-item-text">
            crafted by nail artists
          </p>
        </div>
      </div>

    </div>
  </div>
</section>
  );
  // Mobile similar products — horizontal scrolling strip
  const mobileSimilarProducts = related.length > 0 && (
    <div className="m-similar-section">
      <p className="m-section-label">SIMILAR PRODUCTS</p>
      <div className="m-similar-scroll">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
        ))}
      </div>
      <button
        className="view-all-btn"
        style={{ width: "100%", marginTop: "8px" }}
        onClick={() => onNavigate("products")}
      >
        View All Collections
      </button>
    </div>
  );

  return (
    <div>
      {/* ═══════════════════════════════════════════
          DESKTOP LAYOUT  (≥ 769 px)
      ═══════════════════════════════════════════ */}
      <div className="desktop-view-only">
        <div className="page-hero" style={{ padding: "40px 60px" }}>
          <p className="breadcrumb">
            <a onClick={() => onNavigate("home")} style={{ cursor: "pointer", color: "#888" }}>Home</a>
            {" → "}
            <a onClick={() => onNavigate("products")} style={{ cursor: "pointer", color: "#888" }}>Products</a>
            {" → "}
            <span>{product.name}</span>
          </p>
        </div>

        <div className="detail-layout">
          {galleryBlock}
          <div className="detail-info">
            {infoBlock}
            <p className="product-body-text" style={{ marginTop: "20px", marginBottom: "24px", borderTop: "1px solid var(--border)", paddingTop: "18px" }}>
              {description}
            </p>
            <div className="features-grid-container">
              {[
                { title: "100% Handmade", sub: "crafted in our studio", icon: "✦" },
                { title: "Reusable", sub: "up to 10+ wears", icon: "ri-refresh-line" },
                { title: "Application Kit", sub: "& tabs included", icon: "ri-checkbox-line" },
                { title: "Trusted by 1000+", sub: "happy customers", icon: "ri-heart-line" },
              ].map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-icon">
                    {f.icon.startsWith("ri-") ? <i className={f.icon} /> : <span>{f.icon}</span>}
                  </div>
                  <div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            {qtyAndCTABlock}

            <p className="product-body-text" style={{ marginTop: "20px", marginBottom: "16px", borderTop: "1px solid var(--border)" }}>
              {/* {description} */}
            </p>

             <div className="feature-grid-container">
              {[
                { title: "Secure Checkout", sub: "SSL encrypted", icon: "ri-lock-line" },
                { title: "30-Days Returns", sub: "easy & hassle-free", icon: "ri-arrow-go-back-line" },
                { title: "Free Shipping", sub: "on orders over £50", icon: "ri-checkbox-line" },
                            ].map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-icon">
                    {f.icon.startsWith("ri-") ? <i className={f.icon} /> : <span>{f.icon}</span>}
                  </div>
                  <div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {desktopTabsBlock}
        {luxuryExperienceBlock}
        {relatedBlock}
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE LAYOUT  (≤ 768 px)
      ═══════════════════════════════════════════ */}
      <div className="mobile-view-only">
        {breadcrumb}

        <div className="mobile-two-col">

          {/* ── COL 1: Gallery + core product info + similar products ── */}
          <div className="m-col m-col-1">
            <div className="m-main-img">
              <img
  src={
    product.images?.[activeImg]?.image_url
      ? `${API_URL}${product.images[activeImg].image_url}`
      : "/placeholder.png"
  }
  alt={product.name}
/>
            </div>

            <div className="m-thumb-row">
              {product.images?.map((img: any, i: number) => (
                <img
                  key={i}
                  src={
                    img.image_url
                      ? `${API_URL}${img.image_url}`
                      : "/placeholder.png"
                  }
                  alt={`${product.name} ${i + 1}`}
                  className={`m-thumb${activeImg === i ? " active" : ""}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>

            <div className="m-info">
              <p className="detail-label">{product.category_name}</p>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }} className="wishlist-title-row">
                <h1 className="m-title">{product.name}</h1>
                <button onClick={handleWishlist} aria-label="Add to wishlist" className="wishlist-btn">
                  <i className={isFav ? "ri-heart-3-fill" : "ri-heart-line"} style={{ fontSize: "14px", color: isFav ? "#e63946" : "#aaa" }} />
                </button>
              </div>

              <div style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "flex-start", marginTop: "6px", marginBottom: "6px" }}>
               <StarRating
                  rating={Math.round(Number(product.rating || 0))}
                  size={12}
                />
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>({product.review_count})</span>
              </div>

             <div className="m-price">
  £{product.discount_price || product.price}

  {product.discount_price && (
    <span className="old">
      £{product.price}
    </span>
  )}
</div>

<div
  style={{
    fontSize: "11px",
    color: "var(--text-muted)",
    marginTop: "3px",
    marginBottom: "5px",
  }}
>
  <strong>Shipping:</strong>{" "}
  <span style={{ color: shipping === 0 ? "var(--gold)" : "inherit" }}>
    {shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}
  </span>
</div>
              {product.sizes?.length > 0 && (
  <>
    <p className="option-label" style={{ fontSize: "11px" }}>
      Size: <strong>{selectedSize}</strong>
    </p>

    <div className="size-options">
      {product.sizes.map((size: any) => (
        <button
          key={size.id}
          className={`size-btn${
            selectedSize === size.name ? " active" : ""
          }`}
          onClick={() => setSelectedSize(size.name)}
        >
          {size.name}
        </button>
      ))}
    </div>
  </>
)}

              {/* Short summary for Col 1 — full description lives in Col 2 accordion */}
              <p className="m-col1-desc">
                {shortDescriptions[product.id] || description.split(".").slice(0, 2).join(".") + "."}
              </p>

              {mobileCTABlock}
            </div>
          </div>

          {/* ── COL 2: Description + Reviews + Similar Products + Need Help ── */}
          <div className="m-col m-col-2">
            <AccordionItem
  label={`REVIEWS (${product.review_count})`}
  defaultOpen={false}
>
              <p className="product-body-text">{description}</p>
              <div className="m-features-strip">
                {[
                  { title: "100% Handmade", sub: "crafted in our studio", icon: "✦" },
                  { title: "Reusable", sub: "up to 10+ wears", icon: "ri-refresh-line" },
                  { title: "Application Kit", sub: "& tabs included", icon: "ri-checkbox-line" },
                  { title: "Trusted by 1000+", sub: "happy customers", icon: "ri-heart-line" },
                ].map((f, i) => (
                  <div key={i} className="m-feat-item">
                    <span className="m-feat-icon">
                      {f.icon.startsWith("ri-") ? <i className={f.icon} /> : f.icon}
                    </span>
                    <div>
                      <div className="m-feat-title">{f.title}</div>
                      <div className="m-feat-sub">{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionItem>

            <AccordionItem label="HOW TO APPLY" defaultOpen={false}>
              {howToApplyBlock}
            </AccordionItem>

            <AccordionItem label="SHIPPING & RETURNS" defaultOpen={false}>
              {shippingReturnsBlock}
            </AccordionItem>

            <AccordionItem label={`REVIEWS (${product.review_count})`}>
              {reviewsBlock}
            </AccordionItem>

            {luxuryExperienceBlock}

            {/* Similar Products in col 2 */}
            {mobileSimilarProducts}

            <div className="m-help-block">
              <p className="feature-title" style={{ marginBottom: "4px" }}>NEED HELP?</p>
              <p className="feature-sub">Our support team is here for you.</p>
              <p className="feature-title" style={{ color: "var(--gold)", marginTop: "6px" }}>hello@sratemore.com</p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        /* ══════════════════════════════════════════
           SHARED COMPONENTS
        ══════════════════════════════════════════ */
        .wishlist-btn {
          background: none;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.2s, transform 0.15s;
        }
        .wishlist-btn:hover {
          border-color: #e63946;
          transform: scale(1.1);
        }

        .cta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
        }
        .cta-row .qty-selector-new { flex-shrink: 0; }
        .cta-row .btn-buy-now,
        .cta-row .btn-add-cart-new {
          flex: 1;
          white-space: nowrap;
        }

        .feature-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .feature-icon {
          color: var(--gold, #c9a84c);
          font-size: 16px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .feature-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
        }
        .feature-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        .rating-summary {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--surface, #fafafa);
          border: 1px solid var(--border, #eee);
          border-radius: 10px;
          padding: 12px 14px;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .rating-top {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .rating-score {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          color: var(--text, #111);
          flex-shrink: 0;
        }
        .rating-count {
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .rating-bars {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;
        }
        .rating-bar-row {
          display: flex;
          align-items: center;
          gap: 4px;
          width: 100%;
          min-width: 0;
        }
        .bar-label {
          font-size: 10px;
          width: 8px;
          flex-shrink: 0;
          color: var(--text-muted);
          text-align: right;
        }
        .bar-star {
          font-size: 9px;
          color: var(--gold, #c9a84c);
          flex-shrink: 0;
        }
        .bar-track {
          flex: 1;
          min-width: 0;
          height: 5px;
          background: #e8e8e8;
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: var(--gold, #c9a84c);
          border-radius: 3px;
        }
        .bar-pct {
          font-size: 9px;
          color: var(--text-muted);
          width: 24px;
          flex-shrink: 0;
          text-align: right;
        }
        .review-card {
          border-bottom: 1px solid var(--border, #eee);
          padding-bottom: 20px;
        }
        .review-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .reviewer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--gold, #c9a84c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
          font-size: 13px;
          flex-shrink: 0;
        }
        .reviewer-name {
          font-weight: 600;
          font-size: 13px;
          color: var(--text);
          margin-bottom: 2px;
        }
        .review-body {
          margin: 0;
          padding-left: 46px;
        }
        .view-all-btn {
          background: none;
          border: 1px solid var(--gold, #c9a84c);
          color: var(--gold, #c9a84c);
          padding: 10px 24px;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .view-all-btn:hover {
          background: var(--gold, #c9a84c);
          color: #fff;
        }

        /* ===== Luxury Experience Section ===== */

.luxury-section {
  width: 100%;
  // border-top: 1px solid #d8d1c7;
  // border-bottom: 1px solid #d8d1c7;
  border-right: 1px solid #d8d1c7;
  border-left: 1px solid #d8d1c7;
  padding: 28px 0;
  margin-top: 28px ;
  margin-bottom: 28px;
}

.luxury-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;

}

/* ===== Heading ===== */

.luxury-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 64px;
  margin-top: 8px;
}

.luxury-circle {
  width: 40px;
  height: 40px;
  border: 1px solid #c79a4b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.luxury-circle-dot {
  width: 10px;
  height: 10px;
  background: #c79a4b;
  border-radius: 50%;
}

.luxury-subtitle {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 13px;
  font-weight: 500;
  color: #b18437;
  margin-bottom: 6px;
}

.luxury-title {
  font-size: 32px;
  line-height: 1;
  color: #000;
  font-family: "Cormorant Garamond", serif;
  font-weight: 500;
}
  

/* ===== Features Grid ===== */

.luxury-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px 40px;
}

/* ===== Feature Item ===== */

.luxury-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.luxury-icon {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 50%;
  background: #f3ede4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b18437;
  font-size: 22px;
}

.luxury-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 6px;
}

.luxury-item-text {
  color: #6b6b6b;
  font-size: 14px;
  line-height: 1.6;
}

/* ===== Responsive ===== */

@media (max-width: 1024px) {
  .luxury-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 24px;
  }

  .luxury-title {
    font-size: 28px;
  }
}

@media (max-width: 640px) {
  .luxury-section {
    padding: 20px 0;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .luxury-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 12px;
  }

  .luxury-title {
    font-size: 20px;
  }

  .luxury-subtitle {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .luxury-heading {
    margin-bottom: 24px;
  }

  .luxury-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  .luxury-icon {
    width: 44px;
    height: 44px;
    min-width: 44px;
    font-size: 18px;
  }

  .luxury-item-title {
    font-size: 14px;
    margin-bottom: 2px;
  }

  .luxury-item-text {
    font-size: 14px;
    line-height: 1.3;
  }
}

        /* ══════════════════════════════════════════
           DESKTOP
        ══════════════════════════════════════════ */
        .desktop-view-only { display: block; }
        .mobile-view-only  { display: none;  }

        .features-grid-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 28px;
          margin-bottom: 32px;
        }
        @media (max-width: 991px) and (min-width: 769px) {
          .features-grid-container { grid-template-columns: repeat(2, 1fr); }
        }
          @media (max-width: 768px) {
          .features-grid-container {
          display:grid;
           grid-template-rows: repeat(2, 1fr);
           gap: 14px 10px;
    margin-top: 18px;
    margin-bottom: 24px; }
        }
          .feature-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 28px;
          margin-bottom: 32px;
        }
        @media (max-width: 991px) and (min-width: 769px) {
          .feature-grid-container { grid-template-columns: repeat(2, 1fr); }
        }
          @media (max-width: 768px) {
          .feature-grid-container { grid-template-rows: repeat(2, 2fr); }
        }

        .desktop-tabs-wrap {
          max-width: 900px;
          margin: 60px auto 0;
          padding: 0 24px;
        }
        .tab-header-row {
          display: flex;
          border-bottom: 2px solid var(--border, #eee);
          margin-bottom: 32px;
        }
        .tab-btn {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 400;
          color: var(--text-muted, #888);
          cursor: pointer;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .tab-btn.active {
          border-bottom-color: var(--gold, #c9a84c);
          font-weight: 600;
          color: var(--gold, #c9a84c);
        }

       /* ══════════════════════════════════════════
   MOBILE — Single Column Layout
══════════════════════════════════════════ */
@media (max-width: 768px) {

  .desktop-view-only {
    display: none !important;
  }

  .mobile-view-only {
    display: block;
    background: var(--cream, #fdf8f3);
    min-height: 100dvh;
  }

  /* Breadcrumb */

  .breadcrumb-bar {
    padding: 8px 12px !important;
    border-bottom: 1px solid var(--border, #eee);
    background: #fff;
  }

  .breadcrumb-bar .breadcrumb {
    font-size: 14px;
    margin: 0;
  }

  /* SINGLE COLUMN */

  .mobile-two-col {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
    background: var(--cream, #fdf8f3);
  }

  /* REMOVE OLD COLUMN STYLES */

  .m-col-1,
  .m-col-2 {
    width: 100%;
    flex: unset;
    height: auto;
    overflow: visible;
    border: none;
    padding-top: 0;
  }

  /* PRODUCT IMAGE */

  .m-col-1 {
    padding: 16px;
  }

  .m-col-1 img,
  .m-col-1 video {
    width: 10%;
    height: 10%;
    border-radius: 24px;
    object-fit: contain;
  }

  /* PRODUCT DETAILS */

  .m-col-2 {
    padding: 20px 16px 40px;
  }

  /* TITLE */

  .mobile-product-title {
    font-size: 34px;
    line-height: 1.1;
    margin-bottom: 10px;
    font-family: 'Cormorant Garamond', serif;
  }

  /* PRICE */

  .mobile-price {
    font-size: 18px;
    margin-bottom: 18px;
  }

  /* DESCRIPTION */

  .mobile-description {
    font-size: 16px;
    line-height: 1.7;
    color: #666;
    margin-bottom: 24px;
  }

  /* SIZE BUTTONS */

  .mobile-size-grid {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
  }

  .mobile-size-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid #ddd;
    background: white;
    font-size: 14px;
  }

  .mobile-size-btn.active {
    background: black;
    color: white;
    border-color: black;
  }

  /* CTA BUTTON */

  .mobile-add-cart {
    width: 100%;
    height: 54px;
    border-radius: 18px;
    background: #d4b06a;
    color: black;
    font-size: 15px;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    margin-top: 10px;
  }

  /* FOOTER SPACING */

  .mobile-view-only::after {
    content: '';
    display: block;
    height: 40px;
    background: var(--cream, #fdf8f3);
  }
}

          /* ────────────────────────────────────────
             1. MAIN IMAGE — amplified vertical weight
             flex: 3 gives it ~60% of col 1 height,
             object-fit: contain keeps gem crisp
          ──────────────────────────────────────── */
          .m-main-img {
            width: 100%;
            flex: 3;
            min-height: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            overflow: hidden;
            box-sizing: border-box;
          }
          .m-main-img img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            border-radius: 4px;
          }

          /* Thumbnail strip — slimmer */
          .m-thumb-row {
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 4px;
            overflow-x: auto;
            padding: 4px 8px;
            scrollbar-width: none;
            border-top: 1px solid var(--border, #eee);
            flex-shrink: 0;
          }
          .m-thumb-row::-webkit-scrollbar { display: none; }
          .m-thumb {
            width: 26px;
            height: 26px;
            object-fit: cover;
            flex-shrink: 0;
            border-radius: 3px;
            border: 1.5px solid transparent;
            cursor: pointer;
          }
          .m-thumb.active { border-color: var(--gold, #c9a84c); }

          /* ── Col 1: info panel ── */
          .m-info {
            width: 100%;
            padding: 5px 10px 6px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            flex-shrink: 0;
            border-top: 1px solid var(--border, #eee);
          }
          .m-info > * { width: 100%; }
          .m-info .detail-label { text-align: left; }
          .m-info > div:first-of-type { justify-content: flex-start; }

          .m-title {
            font-size: 15px !important;
            line-height: 1.2;
            margin: 0;
            text-align: left;
          }
          .m-price {
            font-size: 16px;
            font-weight: 700;
            color: var(--text);
            margin: 2px 0;
            text-align: left;
          }
          .m-price .old {
            font-size: 14px;
            color: var(--text-muted);
            text-decoration: line-through;
            margin-left: 6px;
          }

          /* ────────────────────────────────────────
             2. TYPOGRAPHY COMPRESSION
             Micro-copy in col 1 — compact, polished
          ──────────────────────────────────────── */
          .m-col1-desc {
            font-size: 13px !important;
            line-height: 1.5 !important;
            color: var(--text-muted) !important;
            margin: 4px 0 0 !important;
            padding-top: 4px !important;
            border-top: 1px solid var(--border, #eee);
          }

          /* product-body-text inside accordion also tighter */
          .accordion-body .product-body-text {
            font-size: 14px !important;
            line-height: 1.5 !important;
            margin: 0;
          }

          /* Full-width qty selector — min touch target 44px */
          .mobile-qty-full {
            display: flex;
            width: 100%;
          }
          .mobile-qty-full button {
            flex: 0 0 40px;
            height: 40px;
            min-width: 40px;
          }
          .mobile-qty-full input {
            flex: 1;
            text-align: center;
          }

          /* ── Col 2: feature strip ── */
          .m-features-strip {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 10px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--border, #eee);
          }
          .m-feat-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .m-feat-icon {
            color: var(--gold, #c9a84c);
            font-size: 14px;
            flex-shrink: 0;
            width: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .m-feat-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--text);
            line-height: 1.2;
          }
          .m-feat-sub {
            font-size: 12px;
            color: var(--text-muted);
            line-height: 1.2;
          }

          /* ────────────────────────────────────────
             CTA buttons — full-width, accessible touch targets
          ──────────────────────────────────────── */
          .mobile-cta-stack {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 8px;
            width: 100%;
          }
          .mobile-full-btn {
            width: 100% !important;
            font-size: 13px !important;
            padding: 11px 8px !important;  /* ≥ 44px touch target */
            white-space: nowrap;
            min-height: 40px;
          }

          /* Size buttons — left aligned, min 40px touch target */
          .m-info .size-options { justify-content: flex-start; }
          .m-info .option-label { text-align: left; }
          .m-info .size-btn {
            font-size: 13px !important;
            padding: 5px 9px !important;
            min-width: 32px !important;
            min-height: 32px !important;
          }
          .m-info .detail-label {
            font-size: 14px;
            margin-bottom: 3px;
            text-align: left;
          }
          .m-info .option-label {
            font-size: 14px;
            margin-top: 4px;
            margin-bottom: 2px;
            text-align: left;
          }
          .m-info .size-options {
            margin-bottom: 0;
          }

          /* ────────────────────────────────────────
             3. RIGHT COLUMN COMPRESSION
             Tighter spacing throughout col 2
          ──────────────────────────────────────── */

          /* Similar Products — reduced padding + margins */
          .m-similar-section {
            padding: 8px 10px 12px;
            border-bottom: 1px solid var(--border, #eee);
          }
          .m-section-label {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: var(--gold, #c9a84c);
            margin: 0 0 12px;
            text-align: center;
          }
          .m-similar-scroll {
            display: flex;
            flex-direction: row;
            gap: 10px;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }
          .m-similar-scroll::-webkit-scrollbar { display: none; }
          .m-similar-scroll > * {
            flex: 0 0 calc(50% - 5px);
            min-width: calc(50% - 5px);
          }
          .m-similar-section .view-all-btn {
            font-size: 14px;
            padding: 10px 16px;
            margin-top: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          /* Accordion — tighter triggers + body */
          .accordion-item {
            border-bottom: 1px solid var(--border, #eee);
          }
          /* First accordion item gets no extra top gap — col-2 padding-top handles it */
          .accordion-item:first-child .accordion-trigger {
            padding-top: 0;
          }
          .accordion-trigger {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: none;
            border: none;
            padding: 10px 10px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.8px;
            color: var(--text);
            cursor: pointer;
            text-align: left;
            text-transform: uppercase;
            min-height: 40px; /* accessible tap target */
          }
          .accordion-trigger i {
            font-size: 13px;
            color: var(--text-muted);
            flex-shrink: 0;
          }
          .accordion-body {
            padding: 2px 10px 12px;
            font-size: 12px;
            color: var(--text);
            line-height: 1.5;
          }
          .accordion-body .review-body {
            padding-left: 0 !important;
            font-size: 12px !important;
            line-height: 1.5 !important;
          }
          .accordion-body .reviewer-name { font-size: 12.5px; }
          .accordion-body .review-card { padding-bottom: 10px; }
          .accordion-body .reviewer-avatar {
            width: 30px;
            height: 30px;
            font-size: 13px;
          }
          .accordion-body .rating-score { font-size: 22px; }
          .accordion-body .rating-summary { padding: 9px 11px; gap: 7px; }
          .accordion-body .view-all-btn {
            font-size: 12px;
            padding: 7px 14px;
          }

          /* Help block — minimal footprint */
          .m-help-block {
            padding: 10px 10px 18px;
            border-top: 1px solid var(--border, #eee);
          }
          .m-help-block .feature-title { font-size: 12px; margin-bottom: 2px; }
          .m-help-block .feature-sub   { font-size: 12px; }
        }

        

        
      `}</style>
    </div>
  );

  
}