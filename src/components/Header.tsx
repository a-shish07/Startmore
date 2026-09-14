import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

type Page =
  | "home"
  | "products"
  | "detail"
  | "cart"
  | "checkout"
  | "success"
  | "about"
  | "contact"
  | "favorites"
  | "login"
  | "dashboard"
  | "size-guide"
  | "how-to-apply"
  | "faq"
  | "press"
  | "new-arrivals"
  | "on-sale"
  | "best-sellers"
  |"wholesale";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({
  currentPage,
  onNavigate,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const { totalCount } = useCart();
  const { favorites } = useFavorites();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > 10);

    window.addEventListener(
      "scroll",
      onScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navItems = [
    {
      key: "home",
      label: "Home",
    },
    {
      key: "products",
      label: "Products",
    },
    {
      key: "about",
      label: "Our Story",
    },
    {
      key: "contact",
      label: "Contact",
    },
    {
      key:"wholesale",
      label:"Wholesale Inquiry"
    }
  ] as const;

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const navHeight = scrolled ? 72 : 108; // Exact mobile view nav bar height (72px nav + 36px announcement bar when unscrolled)

  const mobilePanel = menuOpen
    ? createPortal(
      <div
        style={{
          position: "fixed",
          top: navHeight,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            pointerEvents: "auto",
          }}
        />

        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            zIndex: 2,
            width: "min(260px, 80vw)",
            minWidth: 220,
            height: `calc(100vh - ${navHeight}px)`,
            background: "#fdf8f3",
            borderLeft: "1px solid #ece3d7",
            boxShadow:
              "-8px 0 30px rgba(0,0,0,.08)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            paddingTop: 24,
            animation:
              "slidePanel .3s ease",
          }}
        >
          {/* Navigation */}

          <div
            style={{
              padding:
                "0 22px",
              display: "flex",
              flexDirection:
                "column",
              gap: 10,
            }}
          >
            {navItems.map(
              (item) => (
                <button
                  key={
                    item.key
                  }
                  onClick={() =>
                    handleNav(
                      item.key
                    )
                  }
                  style={{
                    border:
                      "none",
                    background:
                      currentPage ===
                        item.key
                        ? "rgba(201,169,110,.1)"
                        : "transparent",
                    color:
                      currentPage ===
                        item.key
                        ? "#c9a96e"
                        : "#111",
                    padding:
                      "18px 20px",
                    borderRadius: 14,
                    textAlign:
                      "left",
                    cursor:
                      "pointer",
                    fontSize: "clamp(12px, 2vw, 14px)",
                    fontFamily:
                      "Jost",
                    letterSpacing:
                      "1.8px",
                    textTransform:
                      "uppercase",
                    width: "100%",
                  }}
                >
                  {
                    item.label
                  }
                </button>
              )
            )}
          </div>

          {/* Auth */}

          <div
            style={{
              marginTop: 34,
              padding:
                "0 22px 30px",
            }}
          >
            {isAuthenticated ? (
              <>
                <button
                  onClick={() =>
                    handleNav(
                      "dashboard"
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "18px 20px",
                    marginBottom: 14,
                    border:
                      "none",
                    borderRadius: 14,
                    background:
                      "#fff",
                    textAlign:
                      "left",
                    cursor:
                      "pointer",
                    fontSize: "clamp(12px, 2vw, 14px)",
                    fontFamily:
                      "Jost",
                    letterSpacing:
                      "1.8px",
                    textTransform:
                      "uppercase",
                  }}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    logout();

                    handleNav(
                      "home"
                    );
                  }}
                  style={{
                    width:
                      "100%",
                    padding:
                      "18px 20px",
                    border:
                      "none",
                    borderRadius: 14,
                    background:
                      "#fff",
                    color:
                      "#c0392b",
                    textAlign:
                      "left",
                    cursor:
                      "pointer",
                    fontSize: "clamp(12px, 2vw, 14px)",
                    fontFamily:
                      "Jost",
                    letterSpacing:
                      "1.8px",
                    textTransform:
                      "uppercase",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  handleNav(
                    "login"
                  )
                }
                style={{
                  width:
                    "100%",
                  padding:
                    "18px 20px",
                  border:
                    "none",
                  borderRadius: 14,
                  background:
                    "#fff",
                  textAlign:
                    "left",
                  cursor:
                    "pointer",
                  fontFamily:
                    "Jost",
                  letterSpacing:
                    "1.8px",
                  textTransform:
                    "uppercase",
                  color:
                    currentPage ===
                      "login"
                      ? "#c9a96e"
                      : "#111",
                  fontSize: "clamp(12px, 2vw, 14px)",
                }}
              >
                Login /
                Register
              </button>
            )}
          </div>

          <style>
            {`
              @keyframes slidePanel{
                from{
                  transform:translateX(-100%);
                }
                to{
                  transform:translateX(0);
                }
              }
            `}
          </style>
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <>
      <nav
        className={
          scrolled
            ? "scrolled"
            : ""
        }
      >
        <div className="nav-inner">
          <div
            className="logo-wrap"
            onClick={() =>
              handleNav(
                "home"
              )
            }
          >
            <img
              src="/3.png"
              alt="SR Artémore"
              className="logo-svg"
            />
          </div>

          <ul className="nav-links desktop-menu">
            {navItems.map(
              (item) => (
                <li
                  key={
                    item.key
                  }
                >
                  <a
                    onClick={() =>
                      handleNav(
                        item.key
                      )
                    }
                    className={
                      currentPage ===
                        item.key
                        ? "active"
                        : ""
                    }
                  >
                    {
                      item.label
                    }
                  </a>
                </li>
              )
            )}
          </ul>

          <div className="nav-icons">

  {/* LEFT SIDE */}
  <div className="mobile-left-icons">

    {/* Menu */}
    <button
      className="menu-toggle icon-btn"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Menu"
    >
      <i
        className={
          menuOpen
            ? "ri-close-line"
            : "ri-menu-line"
        }
      />
    </button>

    {/* Favorites */}
    <button
      onClick={() => handleNav("favorites")}
      className="icon-btn favorite-btn"
      aria-label="Favorites"
    >
      <i
        className={
          favorites.length > 0
            ? "ri-heart-3-fill"
            : "ri-heart-3-line"
        }
      />

      {favorites.length > 0 && (
        <span className="fav-badge">
          {favorites.length}
        </span>
      )}
    </button>

  </div>


  {/* DESKTOP PROFILE BUTTONS */}
  <div className="desktop-profile-buttons">
    {isAuthenticated ? (
      <>
        <button
          className="icon-btn profile-btn-desktop"
          onClick={() => handleNav("dashboard")}
        >
          Dashboard
        </button>

        <button
          className="icon-btn profile-btn-desktop"
          onClick={() => {
            logout();
            handleNav("home");
          }}
        >
          Logout
        </button>
      </>
    ) : (
      <button
        className="icon-btn profile-btn-desktop"
        onClick={() => handleNav("login")}
      >
        Login
      </button>
    )}
  </div>


  {/* RIGHT SIDE - MOBILE */}
  <div className="mobile-right-icons">

    {/* Profile */}
    <button
      className="icon-btn mobile-profile-btn"
      onClick={() =>
        handleNav(
          isAuthenticated
            ? "dashboard"
            : "login"
        )
      }
      aria-label={
        isAuthenticated
          ? "Profile"
          : "Login"
      }
    >
      <i
        className={
          isAuthenticated
            ? "ri-user-fill"
            : "ri-user-line"
        }
      />
    </button>

      
    {/* Cart */}
    <button
      className={`icon-btn cart-btn ${
        currentPage === "cart"
          ? "active"
          : ""
      }`}
      onClick={() => handleNav("cart")}
      aria-label="Cart"
    >
      <i className="ri-shopping-cart-fill" />

      {totalCount > 0 && (
        <span className="cart-badge">
          {totalCount}
        </span>
      )}
    </button>

  </div>

</div>
        </div>
      </nav>

      {mobilePanel}
    </>
  );
}