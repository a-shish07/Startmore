import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function ContactPage() {
  useReveal();
  const [form, setForm] = useState({ name: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: `${form.name} ${form.lastName}`.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not send your message.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  const contactDetails = [
    { icon: "ri-phone-line", title: "Call & WhatsApp", content: "+91 98765 43210", sub: "+91 12345 67890" },
    { icon: "ri-mail-line", title: "Write to Us", content: "hello@srartemore.com", sub: "support@srartemore.com" },
    { icon: "ri-instagram-line", title: "Instagram", content: "@sr_artemore", sub: "Direct Message for Custom Orders" },
    { icon: "ri-time-line", title: "Working Hours", content: "Daily: 9am - 6pm", sub: "Sunday: Closed" },
  ];

  const faqs = [
    { q: "How do I find my nail size?", a: "You can use our size guide to measure your natural nails at home. We also offer sizing kits for the most accurate fit." },
    { q: "How long do press-on nails last?", a: "With proper application using nail glue, they can last up to 2 weeks. With adhesive tabs, they are perfect for 1-3 days wear." },
    { q: "Are the nails reusable?", a: "Yes! Our nails are handcrafted with high-quality gel and can be reused multiple times if removed carefully." },
    { q: "Do you take custom orders?", a: "Absolutely. DM us on Instagram with your design inspiration for a custom quote." },
  ];

  return (
    <div className="contact-page-root">
      {/* Header Section */}
      <section className="contact-hero reveal">
        <p className="hero-label">Get in Touch</p>
        <h1 className="hero-title" style={{ color: "var(--gold)" }}>Contact Us</h1>
        <p className="hero-subtitle">Tell us what's on your mind and we'll confirm availability within 24 hours.</p>
      </section>

      {/* Main Content: Form & Image */}
      <section className="contact-main-grid reveal">
        <div className="contact-form-side">
          {sent ? (
            <div className="success-message">
              <i className="ri-checkbox-circle-line"></i>
              <h2>Message Sent!</h2>
              <p>We've received your inquiry and will get back to you shortly.</p>
              <button className="btn-primary" onClick={() => { setSent(false); setForm({ name: "", lastName: "", email: "", phone: "", subject: "", message: "" }); }}><span>Send Another</span></button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="premium-form">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", marginBottom: "20px" }}>Send a Message</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="Your name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Last name" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" placeholder="How can we help?" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="Tell us about your inquiry..." required value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
              </div>

              {error && <p className="contact-form-error" role="alert">{error}</p>}

              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "12px" }}>
                <button type="submit" className="btn-send-message" disabled={sending}>
                  <span>{sending ? "Sending…" : "Send Message"}</span>
                </button>

                <div className="response-time">
                  <i className="ri-time-line"></i>
                  <div>
                    <span className="label">Response Time</span>
                    <span className="value">Within 24 hours</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
        <div className="contact-image-side">
          <div className="image-wrapper">
            <img src="/4.png" alt="Logo Overlay" className="logo-overlay-small" />
            <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80&fit=crop" alt="Luxury Nails" className="contact-panel-img" />
            <div className="image-badge">Luxury Experience</div>
          </div>
        </div>
      </section>

      {/* Contact Details Grid */}
      <section className="details-grid reveal">
        {contactDetails.map((d, i) => (
          <div key={i} className="detail-card">
            <div className="detail-icon"><i className={d.icon}></i></div>
            <h3>{d.title}</h3>
            <p className="main-content">{d.content}</p>
            <p className="sub-content">{d.sub}</p>
          </div>
        ))}
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="faq-section-contact reveal">
        <div className="section-header-centered">
          <p className="section-label">Questions?</p>
          <h2 className="section-title">Frequently Asked</h2>
        </div>
        <div className="faq-list-premium">
          {faqs.map((f, i) => (
            <div key={i} className="faq-item-premium">
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .contact-page-root {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
          font-family: 'Jost', sans-serif;
        }

        .contact-hero {
          text-align: center;
          margin-bottom: 80px;
        }

        .hero-label {
          font-size: 11px;
          letter-spacing: 4px;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          font-weight: 300;
          margin-bottom: 24px;
          line-height: 1;
        }

        .hero-subtitle {
          font-size: 16px;
          color: #666;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .contact-main-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          background: #fdfaf6;
          border-radius: 32px;
          overflow: hidden;
          padding: 60px;
          margin-bottom: 100px;
        }

        .premium-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 500;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group input, .form-group select, .form-group textarea {
          padding: 14px 18px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          background: white;
          transition: all 0.3s;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 4px rgba(184, 151, 90, 0.1);
        }

        .form-group textarea {
          min-height: 150px;
          resize: vertical;
        }

        .contact-image-side {
          position: relative;
        }

        .image-wrapper {
          position: relative;
          height: 100%;
          border-radius: 24px;
          overflow: hidden;
        }

        .contact-panel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-overlay-small {
          position: absolute;
          top: 24px;
          left: 24px;
          width: 40px;
          z-index: 2;
          filter: brightness(0) invert(1);
        }

        .image-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 10px;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-bottom: 100px;
        }

        .detail-card {
          text-align: center;
          padding: 40px 20px;
          transition: transform 0.3s;
        }

        .detail-card:hover {
          transform: translateY(-5px);
        }

        .detail-icon {
          width: 60px;
          height: 60px;
          background: #fdfaf6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
          color: var(--gold);
          border: 1px solid rgba(201, 169, 110, 0.1);
        }

        .detail-card h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1a1a1a;
        }

        .detail-card p.main-content {
          font-size: 14px;
          color: #333;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .detail-card p.sub-content {
          font-size: 12px;
          color: #888;
        }

        .faq-section-contact {
          padding: 80px 60px;
          background: #fdfaf6;
          border-radius: 32px;
        }

        .section-header-centered {
          text-align: center;
          margin-bottom: 60px;
        }

        .faq-list-premium {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px 60px;
        }

        .faq-item-premium {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding-bottom: 24px;
        }

        .faq-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          margin-bottom: 12px;
          color: #1a1a1a;
        }

        .faq-a {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }

        .success-message {
          text-align: center;
          padding: 60px 0;
        }

        .success-message i {
          font-size: 80px;
          color: var(--gold);
          margin-bottom: 24px;
          display: block;
        }

        .btn-send-message {
          padding: 16px 40px;
          background: var(--gold);
          color: var(--black);
          border: none;
          border-radius: 2px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .btn-send-message::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--black);
          transform: translateX(-101%);
          transition: transform .4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .btn-send-message::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 50%;
          height: 200%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(30deg);
          transition: 0.6s;
          z-index: 2;
        }

        .btn-send-message:hover::before {
          transform: translateX(0);
        }

        .btn-send-message:hover::after {
          left: 150%;
        }

        .btn-send-message:hover {
          color: var(--white);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(201, 169, 110, 0.3);
        }

        .btn-send-message span {
          position: relative;
          z-index: 3;
        }

        .btn-send-message:disabled { cursor: wait; opacity: .65; }
        .contact-form-error { margin: -8px 0 0; color: #a23333; font-size: 13px; }

        .response-time {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
        }

        .response-time i {
          font-size: 24px;
          color: var(--gold);
        }

        .response-time .label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .response-time .value {
          display: block;
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .contact-main-grid {
            grid-template-columns: 1fr;
            padding: 40px 24px;
            gap: 40px;
          }
          .contact-image-side {
            display: block;
            order: -1; /* Move image to top on mobile */
            height: 350px;
          }
          .image-wrapper {
            border-radius: 20px;
          }
          .details-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .faq-list-premium {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .contact-page-root {
            padding: 40px 16px;
          }
          .hero-title {
            font-size: 42px;
          }
          .contact-main-grid {
            padding: 30px 20px;
            border-radius: 24px;
          }
          .premium-form h2 {
            text-align: center;
            font-size: 28px !important;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .faq-section-contact {
            padding: 40px 20px;
          }
          .contact-image-side {
            height: 280px;
          }
          .btn-send-message {
            width: 100%;
            justify-content: center;
          }
          .premium-form > div {
             flex-direction: column;
             align-items: center !important;
             text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
