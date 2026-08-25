import { useEffect, useState } from "react";
import { products, categories, testimonials } from "../data/products";
import ProductCard from "../components/ProductCard";
import InstagramCarousel from "../components/InstagramCarousel";

type Page =
  | "home" | "products" | "detail" | "cart" | "checkout" | "success" | "about" | "contact" | "favorites"
  | "login" | "dashboard" | "size-guide" | "how-to-apply" | "faq" | "press" | "new-arrivals" | "on-sale" | "best-sellers";

interface HomePageProps {
  onNavigate: (page: Page, productId?: number) => void;
}

function useReveal(trigger?: number) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    const elements = document.querySelectorAll(".reveal");

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [trigger]);
}
export default function HomePage({ onNavigate }: HomePageProps) {
  const [testiIndex, setTestiIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  const [banner, setBanner] = useState<any>(null);
  const [shapes, setShapes] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useReveal(featuredProducts.length);
useEffect(() => {
  fetchBanner();
  fetchShapes();
  fetchFeaturedProducts();
}, []);

const fetchBanner = async () => {
  try {

    console.log("Calling API...");

    const response = await fetch(`${API_URL}/api/banners`);

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("API Response:", data);

    if (data.success && data.data.length > 0) {
      setBanner(data.data[0]);
      console.log("Banner State:", data.data[0]);
    }

  } catch (error) {
    console.error(error);
  }
};

const fetchShapes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/client/shapes`);
    const data = await response.json();

    if (data.success) {
      setShapes(data.shapes);
    }
    console.log("Shapes:", data.shapes);
  } catch (error) {
    console.error(error);
  }
};
const fetchFeaturedProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/client/products`);
    const data = await response.json();

    console.log("All Products:", data.products);

    data.products.forEach((p: any) => {
      console.log("Product:", p.name, "featured =", p.featured, typeof p.featured);
    });

    // const featured = data.products.filter(
    //   (p: any) =>
    //     p.featured === true ||
    //     p.featured === 1 ||
    //     p.featured === "1"
    // );

    // console.log("Featured Products:", featured);

    // setFeaturedProducts(featured.slice(0, 4));
    const featured = (data.products || []).filter((p: any) => {
  return (
    p.featured === true ||
    p.featured === 1 ||
    p.featured === "1" ||
    p.featured === "true"
  );
});

console.log("FEATURED PRODUCTS:", featured);

setFeaturedProducts(featured.slice(0, 4));
  } catch (error) {
    console.error(error);
  }
};
  const nextTesti = () => setTestiIndex((prev) => (prev + 1) % testimonials.length);
  const prevTesti = () => setTestiIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // const shapes = [
  //   { name: "Long Almond", count: "4 Products", image: "/shape-long-almond.png" },
  //   { name: "Long Square", count: "4 Products", image: "/shape-long-square.png" },
  //   { name: "Short Almond", count: "4 Products", image: "/shape-short-almond.png" },
  //   { name: "Short Square", count: "4 Products", image: "/shape-short-square.png" },
  // ];
// const [shapes, setShapes] = useState<any[]>([]);
// const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);


  const instaImages = [
    "/gold-nails.png", "/blue-nails.png", "/hero-nail.png",
    "/jewelry.png", "/shape-long-almond.png",
  ];

  return (
    <div>
      {/* ================= HERO ================= */}
      {/* <section className="hero">
        
        <div className="hero-image">
          <img src="/hero.png" alt="SR Artemore Luxury Nails" />
          <div className="hero-image-overlay"></div>
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">✦ Handcrafted Luxury</p>
          <h1 className="hero-title">
            Wear Art <br /> on Your <br />
            <em>Fingertips</em>
          </h1>
          <p className="hero-sub">
            Handmade press-on nails crafted with precision. Aurora chrome finishes,
            reusable designs that transform your look instantly.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => onNavigate("products")}>
              <span>Explore Collection</span>
            </button>
            <button className="btn-outline" onClick={() => onNavigate("about")}>
              Our Story
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">500+</div>
              <div className="lbl">Happy Clients</div>
            </div>
            <div className="hero-stat">
              <div className="num">100%</div>
              <div className="lbl">Handmade</div>
            </div>
            <div className="hero-stat">
              <div className="num">20+</div>
              <div className="lbl">Designs</div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="hero">

  <div className="hero-image">

    <img
  src={
    banner?.image_url
      ? `${API_URL}${banner.image_url}`
      : "/hero.png"
  }
  alt={banner?.title || "Hero Banner"}
/>
    <div className="hero-image-overlay"></div>

  </div>

  <div className="hero-content">

    <p className="hero-eyebrow">

      {banner?.subtitle || "✦ Handcrafted Luxury"}

    </p>

    <h1 className="hero-title">

      {banner?.title || "Wear Art on Your Fingertips"}

    </h1>

    <p className="hero-sub">

      {banner?.description}

    </p>

    <div className="hero-btns">

      <button
        className="btn-primary"
        onClick={() => onNavigate("products")}
      >
        <span>

          {banner?.button_text || "Explore Collection"}

        </span>
      </button>

      <button
        className="btn-outline"
        onClick={() => onNavigate("about")}
      >
        Our Story
      </button>

    </div>

    <div className="hero-stats">

      <div className="hero-stat">
        <div className="num">500+</div>
        <div className="lbl">Happy Clients</div>
      </div>

      <div className="hero-stat">
        <div className="num">100%</div>
        <div className="lbl">Handmade</div>
      </div>

      <div className="hero-stat">
        <div className="num">20+</div>
        <div className="lbl">Designs</div>
      </div>

    </div>

  </div>

</section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[
            "✦ Henna Stencils", "✦ Press On Nails", "✦ Bridal Jewellery",
            "✦ Hand Made", "✦ Reusable", "✦ Henna Stencils",
            "✦ Press On Nails", "✦ Bridal Jewellery", "✦ Hand Made",
            "✦ Reusable", "✦ Henna Stencils", "✦ Press On Nails",
            "✦ Bridal Jewellery", "✦ Hand Made", "✦ Reusable",
          ].map((t, i) => (
            <span key={i} className="marquee-item">{t}</span>
          ))}
        </div>
      </div>

      {/* ================= SHOP BY SHAPE ================= */}
      {/* <section className="section white">
        <div className="section-header reveal">
          <p className="section-label">Browse By</p>
          <h2 className="section-title">Shop by Shape</h2>
          <p className="section-sub">Find your perfect fit — every shape crafted to perfection</p>
        </div>
        <div className="categories-grid">
          {shapes.map((shape, i) => (
            <div
              key={shape.name}
              className={`cat-card reveal reveal-delay-${i + 1}`}
              onClick={() => {
                localStorage.setItem('selectedShape', shape.name);
                onNavigate("products");
              }}
            >
             
              <img
              src={`${API_URL}${shape.image_url}`}
              alt={shape.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                display: "block",
              }}
              />
              <div className="cat-arrow">→</div>
              <div className="cat-info">
                <div className="cat-name">{shape.name}</div>
                
                <div className="cat-count">
                  {shape.product_count} Products
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}
      {/* ================= SHOP BY SHAPE ================= */}
<section className="section white">
  <div className="section-header reveal">
    <p className="section-label">Browse By</p>
    <h2 className="section-title">Shop by Shape</h2>
    <p className="section-sub">
      Find your perfect fit — every shape crafted to perfection
    </p>
  </div>

  <div className="categories-grid">
    {shapes.map((shape) => (
      <div
        key={shape.id}
        className="cat-card"
        onClick={() => {
          localStorage.setItem("selectedShape", shape.name);
          onNavigate("products");
        }}
      >
        {shape.image_url ? <img
          src={`${API_URL}${shape.image_url}`}
          alt={shape.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            display: "block",
          }}
        /> : <div className="cat-image-placeholder">Image coming soon</div>}

        <div className="cat-arrow">→</div>

        <div className="cat-info">
          <div className="cat-name">{shape.name}</div>

          <div className="cat-count">
            View Collection
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

 {/* ================= SHOP BY CATEGORY ================= */}
{/* ================= SHOP BY CATEGORY ================= */}
<section className="section white">
  <div className="section-header reveal">
    <p className="section-label">Explore</p>

    <h2 className="section-title">Shop by Category</h2>

    <p className="section-sub">
      Discover our handcrafted collections, made to complement every style
      and occasion.
    </p>
  </div>

  <div className="categories-grid">
    {[
      {
  name: "Press-On Nails",
  description: "Handcrafted designs made to elevate your everyday look.",
  image: "/hero-nail.png",
  value: "Press-On Nails",
},
      {
        name: "Henna Stencils",
        description:
          "Beautiful stencil designs for effortless henna artistry.",
        image: "/gold-nails.png",
        value: "Henna Stencils",
      },
      {
        name: "Bridal Jewellery",
        description:
          "Elegant pieces crafted for your special occasions.",
        image: "/jewelry.png",
        value: "Bridal Jewellery",
      },
      {
        name: "Fashion",
        description:
          "Everything you need for the perfect nail application.",
        image: "/hero-bg.jpg",
        value: "Fashion",
      },
    ].map((category, i) => (
      <div
        key={category.name}
        className={`cat-card reveal reveal-delay-${i + 1}`}
        onClick={() => {
          localStorage.setItem(
            "selectedCategory",
            category.value
          );
          onNavigate("products");
        }}
      >
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div className="cat-arrow">→</div>

        <div className="cat-info">
          <div className="cat-name">{category.name}</div>

          <div className="cat-count">
            {category.description}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* ================= FEATURED ================= */}
      <section className="section cream">
        <div className="section-header reveal">
          <p className="section-label">New Arrivals</p>
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-sub">Our most loved Aurora handmade press-on nails</p>
        </div>
        <div className="products-grid home-featured-grid">
          {featuredProducts.map((product: any, i: number) => (
  <div
    key={product.id}
    className={`reveal reveal-delay-${i + 1}`}
  >
    <ProductCard
      product={product}
      onNavigate={onNavigate}
    />
  </div>
))}
        </div>
        <div className="center" style={{ marginTop: "48px" }}>
          <button className="btn-primary" onClick={() => onNavigate("products")}>
            <span>View All Products</span>
          </button>
        </div>
      </section>

      {/* ================= BANNER ================= */}
      <section className="banner">
        <div className="banner-text reveal">
          <p className="eyebrow">✦ About SR Artémore</p>
          <h2>
            Crafted for<br />Those Who<br />Dare to Shine
          </h2>
          <p>
            Every set of nails is handcrafted with love, using premium materials
            and intricate techniques. Our Aurora collection captures light like no other.
          </p>
          <button className="btn-primary" onClick={() => onNavigate("about")}>
            <span>Discover Our Story</span>
          </button>
          <div className="banner-stats">
            <div className="stat-item"><div className="num">500+</div><div className="lbl">Customers</div></div>
            <div className="stat-item"><div className="num">100%</div><div className="lbl">Handmade</div></div>
            <div className="stat-item"><div className="num">4.9★</div><div className="lbl">Rating</div></div>
          </div>
        </div>
        <div className="banner-img-grid reveal reveal-delay-2">
          <div className="img-wrap" style={{ gridColumn: "span 2" }}>
            <img src="/jewelry.png" alt="SR Artemore Jewelry" loading="lazy" />
          </div>
          <div className="img-wrap"><img src="/gold-nails.png" alt="Gold Nails" loading="lazy" /></div>
          <div className="img-wrap"><img src="/blue-nails.png" alt="Blue Nails" loading="lazy" /></div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="section testimonials">
        <div className="section-header reveal">
          <p className="section-label">Reviews</p>
          <h2 className="section-title">What Our Clients Say</h2>
        </div>
        <div className="testi-container">
          <div className="testi-grid-new">
            {testimonials.map((t, i) => {
              const isVisibleOnMobile = i === testiIndex;
              return (
                <div
                  key={`${i}-${isVisibleOnMobile}`}
                  className={`testi-card-new reveal ${isVisibleOnMobile ? 'active' : ''}`}
                >
                  <div className="testi-stars">{t.stars}</div>
                  <p className="testi-quote">"{t.text}"</p>
                  <div className="testi-user">
                    <div className="user-avatar">
                      <img src={`https://i.pravatar.cc/100?u=${t.author}`} alt={t.author} />
                    </div>
                    <div className="user-info">
                      <div className="user-name">{t.author}</div>
                      <div className="user-role">{t.location}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`testi-nav ${testimonials.length <= 3 ? 'desktop-hide' : ''}`}>
            <button className="testi-nav-btn" onClick={prevTesti}>
              <i className="ri-arrow-left-line"></i>
            </button>
            <button className="testi-nav-btn active" onClick={nextTesti}>
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </section>

      {/* ================= INSTAGRAM ================= */}
      <InstagramCarousel />
    </div>
  );
}
