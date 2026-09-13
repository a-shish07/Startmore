type Page = "home" | "products" | "about" | "contact" | "cart" | "on-sale"
  | "size-guide" | "how-to-apply" | "faq" | "press" | "blog" | "careers" | "returns" | "shipping" | "privacy" | "terms";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo-wrap" onClick={() => onNavigate("home")} style={{ marginBottom: "1px", cursor: "pointer", display: "flex", justifyContent: "flex-start", overflow: "hidden", width: "180px", height: "auto" }}>
            <img src="/4.png" alt="SR Artémore" className="footer-logo-img" style={{ width: "100%", height: "auto", display: "block", transform: "scale(1.15)" }} />
          </div>
          <p className="footer-brand-desc" style={{ textAlign: 'left', fontSize: '14px', lineHeight: '1.8', maxWidth: "300px", color: "var(--text-muted)" }}>
            Handcrafted luxury press-on nails made with love in India.
            We believe every woman deserves to feel extraordinary, every single day.
          </p>
          <div className="footer-social" style={{ marginTop: '32px' }}>
            {[
              { icon: "ri-instagram-line", href: "https://instagram.com/sr_artemore", label: "Instagram" },
              { icon: "ri-facebook-fill", href: "https://facebook.com/sr_artemore", label: "Facebook" },
              { icon: "ri-youtube-fill", href: "https://youtube.com/sr_artemore", label: "YouTube" },
              { icon: "ri-pinterest-fill", href: "https://pinterest.com/sr_artemore", label: "Pinterest" },
              { icon: "ri-whatsapp-line", href: "https://wa.me/919999999999", label: "WhatsApp" },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Link Grid will be handled by CSS on .footer-grid */}
        <div className="footer-col">
          <div className="col-header-wrap" style={{ marginBottom: "20px" }}>
            <h4>Company</h4>
            <p style={{ fontSize: "10px", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>Our Story & Vision</p>
          </div>
          <ul>
            <li><a onClick={() => onNavigate("about")}>Our Story & Vision</a></li>
            {/* <li><a onClick={() => onNavigate("about")}>Our Story</a></li> */}
            <li><a onClick={() => onNavigate("contact")}>Contact Us</a></li>
            <li><a onClick={() => onNavigate("blog")}>Blog & News</a></li>
            <li><a onClick={() => onNavigate("careers")}>Careers</a></li>
            <li><a onClick={() => onNavigate("press")}>Press & Media</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="col-header-wrap" style={{ marginBottom: "20px" }}>
            <h4>Help & Info</h4>
            <p style={{ fontSize: "10px", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>Customer Care</p>
          </div>
          <ul>
            <li><a onClick={() => onNavigate("contact")}>Customer Care</a></li>
            <li><a onClick={() => onNavigate("size-guide")}>Size Guide</a></li>
            <li><a onClick={() => onNavigate("how-to-apply")}>How to Apply</a></li>
            <li><a onClick={() => onNavigate("returns")}>Returns & Refunds</a></li>
            <li><a onClick={() => onNavigate("shipping")}>Shipping Policy</a></li>
            <li><a onClick={() => onNavigate("privacy")}>Privacy Policy</a></li>
            <li><a onClick={() => onNavigate("terms")}>Terms & Conditions</a></li>
            <li><a onClick={() => onNavigate("faq")}>FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright-text">© 2026 SR ARTÉMORE. All rights reserved. Made with ✦</p>
        <div className="payment-icons">
          <span>VISA</span><span>MC</span><span>UPI</span><span>COD</span><span>PAYTM</span>
        </div>
      </div>
    </footer>
  );
}
