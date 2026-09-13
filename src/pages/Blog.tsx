import React, { useState } from "react";

interface BlogPost {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  content: {
    intro: string;
    sections: {
      heading: string;
      text: string;
    }[];
  };
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: "Nail Care",
    title: "The Art of Effortless Nail Care",
    excerpt:
      "Discover the simple rituals that help maintain beautiful, healthy-looking nails while embracing a more thoughtful approach to self-care.",
    date: "September 08, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1400&q=85",
    featured: true,

    content: {
      intro:
        "Beautiful nails begin with thoughtful care. Rather than complicated routines, a few consistent rituals can make a meaningful difference to the way your nails look and feel.",

      sections: [
        {
          heading: "Begin With a Clean Foundation",
          text:
            "Before applying any colour or styling products, gently clean your nails and remove any residue. A clean surface allows products to sit more evenly and helps create a polished finish.",
        },
        {
          heading: "Keep Your Nails Comfortable",
          text:
            "Regularly moisturising your hands and cuticles can help maintain a softer, healthier-looking appearance. Pay particular attention to the skin around the nail, especially during dry weather.",
        },
        {
          heading: "Give Your Nails a Little Attention",
          text:
            "Small habits matter. Keep your nails at a comfortable length, file rough edges gently, and avoid using your nails as tools. Consistency is often more effective than an elaborate routine.",
        },
        {
          heading: "Beauty Through Simplicity",
          text:
            "At SR Artémore, we believe beauty should feel effortless. The most beautiful details are often the ones created with patience, intention and care.",
        },
      ],
    },
  },

  {
    id: 2,
    category: "Trends",
    title: "The Return of Quiet Luxury",
    excerpt:
      "Minimal silhouettes, refined details and understated beauty are redefining what luxury looks like in the modern era.",
    date: "September 02, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=85",

    content: {
      intro:
        "Luxury is becoming quieter. Instead of demanding attention, modern luxury is increasingly defined by craftsmanship, restraint and details that reveal themselves slowly.",

      sections: [
        {
          heading: "Less, But Better",
          text:
            "The quiet luxury aesthetic embraces pieces that feel refined without being excessive. Clean forms, subtle finishes and considered details create a sense of timeless elegance.",
        },
        {
          heading: "The Beauty of Restraint",
          text:
            "Neutral tones, delicate textures and understated finishes allow personal style to become the focus. The result is sophisticated without feeling overly styled.",
        },
        {
          heading: "Designed to Last",
          text:
            "True luxury is not simply about appearance. It is also about the thought, craftsmanship and attention to detail behind an object.",
        },
      ],
    },
  },

  {
    id: 3,
    category: "Art & Design",
    title: "Where Beauty Meets Art",
    excerpt:
      "Explore the relationship between craftsmanship, colour and form, and how artistic expression finds its place in modern beauty.",
    date: "August 27, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1000&q=85",

    content: {
      intro:
        "Beauty and art have always shared a language of colour, proportion, texture and expression. At SR Artémore, that relationship inspires the way we think about every detail.",

      sections: [
        {
          heading: "Inspired by Form",
          text:
            "Shapes can change the way we perceive beauty. Soft curves, clean lines and carefully balanced proportions create designs that feel naturally harmonious.",
        },
        {
          heading: "Colour as Expression",
          text:
            "Colour has the ability to communicate mood before a single word is spoken. From understated neutrals to expressive chrome finishes, each shade tells a different story.",
        },
        {
          heading: "Craftsmanship Matters",
          text:
            "The smallest details often require the greatest patience. Thoughtful craftsmanship transforms a simple idea into something personal and memorable.",
        },
      ],
    },
  },

  {
    id: 4,
    category: "Nail Care",
    title: "Preparing Your Nails for a Flawless Finish",
    excerpt:
      "A beautiful finish begins with thoughtful preparation. Here are the essential steps to create the perfect foundation.",
    date: "August 20, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1000&q=85",

    content: {
      intro:
        "A flawless finish is rarely accidental. Good preparation creates the foundation for a more refined and long-lasting result.",

      sections: [
        {
          heading: "Clean and Prepare",
          text:
            "Begin with clean, dry nails. Remove any remaining product and gently prepare the nail surface before moving on to styling.",
        },
        {
          heading: "Shape With Intention",
          text:
            "Choose a shape that complements your natural nail and personal style. Gentle, consistent filing helps create a balanced silhouette.",
        },
        {
          heading: "Finish With Care",
          text:
            "Once your nails are prepared, take your time with the final details. A little patience can make the finished look feel significantly more polished.",
        },
      ],
    },
  },

  {
    id: 5,
    category: "Behind the Studio",
    title: "Made With Intention",
    excerpt:
      "Take a closer look at the philosophy behind our handcrafted pieces and the attention to detail that goes into every creation.",
    date: "August 14, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=1000&q=85",

    content: {
      intro:
        "Behind every SR Artémore creation is a belief that beauty becomes more meaningful when it is made with intention.",

      sections: [
        {
          heading: "The Thought Behind Every Detail",
          text:
            "From colour selection to finishing touches, each decision contributes to the final character of a piece. Nothing is included simply for the sake of excess.",
        },
        {
          heading: "A More Personal Approach",
          text:
            "Handcrafted beauty allows room for individuality. It gives each design a sense of character that feels more personal than something created purely for mass appeal.",
        },
        {
          heading: "Our Philosophy",
          text:
            "We believe luxury should feel considered, personal and effortless. That philosophy guides the way we design, create and present our collections.",
        },
      ],
    },
  },

  {
    id: 6,
    category: "Beauty",
    title: "A Softer Approach to Everyday Beauty",
    excerpt:
      "Beauty doesn't need to be complicated. Discover a more intentional approach to the rituals you already love.",
    date: "August 07, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1599948128020-9a44505b0d72?auto=format&fit=crop&w=1000&q=85",

    content: {
      intro:
        "Everyday beauty can be a quiet ritual rather than another task on a long list. Sometimes the simplest approach creates the most beautiful result.",

      sections: [
        {
          heading: "Create Small Rituals",
          text:
            "Set aside a few moments for yourself. Whether it is caring for your hands, choosing a new colour or simply appreciating the details, small rituals can make ordinary moments feel special.",
        },
        {
          heading: "Choose What Feels Like You",
          text:
            "Trends can provide inspiration, but personal style is what makes beauty memorable. Choose shapes, colours and finishes that feel natural to you.",
        },
        {
          heading: "Make Beauty Feel Effortless",
          text:
            "The goal isn't perfection. It is finding a routine that feels enjoyable, practical and genuinely yours.",
        },
      ],
    },
  },
];

const categories = [
  "All",
  "Nail Care",
  "Trends",
  "Art & Design",
  "Beauty",
  "Behind the Studio",
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] =
    useState<BlogPost | null>(null);

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter(
          (post) => post.category === activeCategory
        );

  const featuredPost = blogPosts.find(
    (post) => post.featured
  );

  /* =========================================
     SINGLE ARTICLE VIEW
  ========================================= */

  if (selectedPost) {
    return (
      <main className="blog-page">

        <section className="blog-article">

          <div className="blog-article-top">

            <button
              className="blog-back-button"
              onClick={() => setSelectedPost(null)}
            >
              <span>←</span>
              Back to Journal
            </button>

          </div>


          <div className="blog-article-header">

            <p className="blog-category">
              {selectedPost.category}
            </p>

            <h1>
              {selectedPost.title}
            </h1>

            <p className="blog-article-intro">
              {selectedPost.excerpt}
            </p>

            <div className="blog-article-meta">
              <span>{selectedPost.date}</span>
              <span>✦</span>
              <span>{selectedPost.readTime}</span>
            </div>

          </div>


          <div className="blog-article-image">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
            />
          </div>


          <div className="blog-article-body">

            <p className="blog-article-lead">
              {selectedPost.content.intro}
            </p>

            {selectedPost.content.sections.map(
              (section, index) => (
                <section
                  className="blog-article-section"
                  key={index}
                >
                  <span className="blog-article-section-number">
                    0{index + 1}
                  </span>

                  <div>
                    <h2>{section.heading}</h2>

                    <p>{section.text}</p>
                  </div>
                </section>
              )
            )}

            <div className="blog-article-ending">
              <span>✦</span>

              <p>
                Thank you for spending a little time with
                SR Artémore.
              </p>

              <span>✦</span>
            </div>

          </div>

        </section>

      </main>
    );
  }


  /* =========================================
     JOURNAL VIEW
  ========================================= */

  return (
    <main className="blog-page">

      {/* HERO */}

      <section className="blog-hero">

        <div className="blog-hero-inner">

          <p className="blog-eyebrow">
            ✦ The Journal
          </p>

          <h1>
            Stories of
            <br />
            <em>Beauty & Art</em>
          </h1>

          <div className="blog-hero-line" />

          <p className="blog-hero-description">
            A curated journal exploring beauty,
            craftsmanship, inspiration, trends and the
            art of thoughtful living.
          </p>

        </div>

      </section>


      {/* FEATURED STORY */}

      {featuredPost && (
        <section className="blog-featured-section">

          <div className="blog-container">

            <div className="blog-section-label">
              <span>01</span>
              Featured Story
            </div>

            <article className="blog-featured">

              <div className="blog-featured-image">

                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                />

                <div className="blog-image-overlay">
                  <span>Featured</span>
                </div>

              </div>


              <div className="blog-featured-content">

                <p className="blog-category">
                  {featuredPost.category}
                </p>

                <h2>
                  {featuredPost.title}
                </h2>

                <p className="blog-featured-excerpt">
                  {featuredPost.excerpt}
                </p>

                <div className="blog-meta">
                  <span>{featuredPost.date}</span>
                  <span className="blog-meta-dot">
                    ✦
                  </span>
                  <span>{featuredPost.readTime}</span>
                </div>

                <button
                  className="blog-read-button"
                  type="button"
                  onClick={() =>
                    setSelectedPost(featuredPost)
                  }
                >
                  <span>Read Story</span>
                  <span className="blog-arrow">
                    →
                  </span>
                </button>

              </div>

            </article>

          </div>

        </section>
      )}


      {/* CATEGORY FILTER */}

      <section className="blog-navigation">

        <div className="blog-container">

          <div className="blog-filter">

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "blog-filter-active"
                    : ""
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}

          </div>

        </div>

      </section>


      {/* LATEST STORIES */}

      <section className="blog-stories">

        <div className="blog-container">

          <div className="blog-section-header">

            <div>
              <p className="blog-small-label">
                ✦ Discover
              </p>

              <h2>
                Latest Stories
              </h2>
            </div>

            <p className="blog-count">
              {filteredPosts.length} Stories
            </p>

          </div>


          <div className="blog-grid">

            {filteredPosts.map((post) => (

              <article
                className="blog-card"
                key={post.id}
              >

                <div className="blog-card-image">

                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                  />

                  <span className="blog-card-category">
                    {post.category}
                  </span>

                  <button
                    className="blog-card-view"
                    type="button"
                    aria-label={`Read ${post.title}`}
                    onClick={() =>
                      setSelectedPost(post)
                    }
                  >
                    →
                  </button>

                </div>


                <div className="blog-card-content">

                  <div className="blog-card-meta">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3>
                    {post.title}
                  </h3>

                  <p>
                    {post.excerpt}
                  </p>

                  <button
                    className="blog-card-link"
                    type="button"
                    onClick={() =>
                      setSelectedPost(post)
                    }
                  >
                    Read More
                    <span>→</span>
                  </button>

                </div>

              </article>

            ))}

          </div>


          {filteredPosts.length === 0 && (
            <div className="blog-empty">
              <p>✦</p>

              <h3>
                More stories coming soon
              </h3>

              <span>
                We're preparing something beautiful for you.
              </span>
            </div>
          )}

        </div>

      </section>


      {/* NEWSLETTER */}

      <section className="blog-newsletter">

        <div className="blog-newsletter-inner">

          <p className="blog-eyebrow">
            ✦ Stay Inspired
          </p>

          <h2>
            A little beauty,
            <br />
            <em>in your inbox.</em>
          </h2>

          <p>
            Receive new stories, inspiration and studio
            notes from SR Artémore.
          </p>

          <form
            className="blog-newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >

            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
            />

            <button type="submit">
              Subscribe
              <span>→</span>
            </button>

          </form>

          <small>
            By subscribing, you agree to receive occasional
            emails from SR Artémore.
          </small>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   OPTIONAL: KEEP YOUR EXISTING POLICY COMPONENT
========================================================= */

export function PolicySubsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}