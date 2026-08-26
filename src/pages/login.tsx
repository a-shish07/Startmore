import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../api/auth";

export default function Login({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);

  try {
    if (!isLogin) {
      // Signup Validation
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const response = await registerUser(
        fullName,
        email,
        password
      );

      if (response.data.success) {
        alert(response.data.message);

        setIsLogin(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }

      return;
    }

    // Login
    const response = await loginUser(
      email,
      password
    );

    if (response.data.success) {
     localStorage.setItem("token", response.data.token);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

// Store logged-in user's ID for Dashboard/API calls
localStorage.setItem(
  "user_id",
  String(response.data.user.id)
);

login();

onNavigate("dashboard");
    }

  } catch (error: any) {

    console.error("API Error:", error);

    if (error.response) {
      alert(error.response.data.message);
    } else if (error.request) {
      alert("Unable to connect to the server.");
    } else {
      alert(error.message);
    }

  } finally {
    setLoading(false);
  }
};


  const testimonials = [
    {
      text: "I booked the Mystic Emerald set and it lasted over 10 wears. I'm completely obsessed.",
      author: "Divya Menon",
      role: "Beauty Influencer",
      subtext: "@divyabeauty"
    },
    {
      text: "The quality is exceptional. Each set is handcrafted with such precision — I've never seen anything like it.",
      author: "Aisha Khan",
      role: "Bridal Stylist",
      subtext: "Luxury Bridal Co."
    },
    {
      text: "SR Artémore nails made my henna look professional and complete — truly a game changer for my clients.",
      author: "Priya Sharma",
      role: "Henna Artist",
      subtext: "Mehndi Studio Delhi"
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [animating, setAnimating] = useState(false);

  const triggerAnim = (idx: number) => {
    setAnimating(true);
    setActiveTestimonial(idx);
    setTimeout(() => setAnimating(false), 600);
  };

  const nextTestimonial = () => triggerAnim((activeTestimonial + 1) % testimonials.length);
  const prevTestimonial = () => triggerAnim((activeTestimonial - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="login-page-root">
      <button className="back-btn-luxury" onClick={() => onNavigate("home")}>
        <i className="ri-arrow-left-line"></i>
        <span>Back</span>
      </button>

      <div className="login-container-new">
        {/* Left Side: Branding & Glassmorphism */}
        <div className="login-visual-panel">
          <div className="glass-overlay">
            {/* Testimonial Slider at TOP */}
            <div className="testimonial-slider-glass">
              <div className={`testimonial-content-wrapper ${animating ? 'rising' : ''}`}>
                <p className="testimonial-quote">"{testimonials[activeTestimonial].text}"</p>
                <div className="testimonial-meta">
                  <div className="author-info">
                    <h4 className="author-name">{testimonials[activeTestimonial].author}</h4>
                    <div className="author-stars">★★★★★</div>
                    <p className="author-role">{testimonials[activeTestimonial].role}</p>
                    {testimonials[activeTestimonial].subtext && (
                      <p className="author-subtext">{testimonials[activeTestimonial].subtext}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="slider-bottom-row">
                <div className="slider-pagination">
                  {testimonials.map((_, i) => (
                    <div 
                      key={i} 
                      className={`dot ${activeTestimonial === i ? 'active' : ''}`}
                      onClick={() => triggerAnim(i)}
                    />
                  ))}
                </div>
                <div className="slider-controls" style={{ gap: "4px" }}>
                  <button type="button" onClick={prevTestimonial} className="slider-arrow">
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <button type="button" onClick={nextTestimonial} className="slider-arrow">
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Branding Content at BOTTOM */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <img src="/4.png" alt="Logo" className="visual-logo-top" />
              <div className="visual-content">
                <h2 className="visual-heading">You can easily</h2>
                <p className="visual-text">
                  Get access your personal hub for clarity and productivity.
                </p>
              </div>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80&fit=crop" 
            alt="Luxury Nails" 
            className="panel-bg-img"
          />
        </div>

        {/* Right Side: Form */}
        <div className="login-form-panel">
          <div className="form-content-inner">
            <div className="form-header">
              <img src="/4.png" alt="Logo" className="form-logo-mobile" />
              <h1 style={{ fontSize: "24px" }}>{isLogin ? "Welcome Back" : "Create an account"}</h1>
              <p className="form-subtitle" style={{ fontSize: "13px" }}>
                {isLogin 
                  ? "Access your luxury nail collection anytime, anywhere." 
                  : "Join SR Artémore for a personalized luxury experience."}
              </p>
            </div>

            {/* <form onSubmit={handleSubmit} className="auth-form-new">
              <div className="input-group-new">
                <label>Your email</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group-new">
                <label>Password</label>
                <div className="password-wrapper">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="pw-toggle">
                    <i className="ri-eye-line"></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                {isLogin ? "Log In" : "Get Started"}
              </button>

              <div className="divider-new">
                <span>or continue with</span>
              </div>

              <div className="social-auth-btns">
                <button type="button" className="btn-social">
                  <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
                </button>
                <button type="button" className="btn-social">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
                </button>
              </div>

              <p className="switch-auth-text">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </form> */}
            <form onSubmit={handleSubmit} className="auth-form-new">

  {!isLogin && (
    <div className="input-group-new">
      <label>Full Name</label>
      <input
        type="text"
        placeholder="John Doe"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
    </div>
  )}

  <div className="input-group-new">
    <label>Your Email</label>
    <input
      type="email"
      placeholder="you@example.com"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>

  <div className="input-group-new">
    <label>Password</label>
    <div className="password-wrapper">
      <input
        type="password"
        placeholder="••••••••"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  </div>

  {isLogin && (
    <div className="forgot-password-row">
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  )}

  {!isLogin && (
    <div className="input-group-new">
      <label>Confirm Password</label>
      <div className="password-wrapper">
        <input
          type="password"
          placeholder="••••••••"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
    </div>
  )}

  <button
  type="submit"
  className="btn-auth-submit"
  disabled={loading}
>
  {loading
    ? "Please wait..."
    : isLogin
    ? "Log In"
    : "Create Account"}
</button>

  <div className="divider-new">
    <span>or continue with</span>
  </div>

  <div className="social-auth-btns">
    <button type="button" className="btn-social">
      <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
    </button>

    <button type="button" className="btn-social">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
    </button>
  </div>

  <p className="switch-auth-text">
    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
    <button type="button" onClick={() => setIsLogin(!isLogin)}>
      {isLogin ? "Sign Up" : "Log In"}
    </button>
  </p>

</form>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-root {
          min-height: 100vh;
          background: #fdfaf6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Jost', sans-serif;
        }

        .login-container-new {
          width: 100%;
          max-width: 1000px;
          height: 650px;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        }

        .login-visual-panel {
          flex: 1;
          position: relative;
          display: block;
        }

        .panel-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .glass-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 28px 28px;
          z-index: 2;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .visual-logo-top {
          width: 50px;
          filter: brightness(0) invert(1);
          align-self: flex-start;
          margin-bottom: 12px;
        }

        .visual-content {
          color: white;
          max-width: 280px;
        }

        .visual-heading {
          font-size: 9px;
          font-weight: 500;
          margin-bottom: 4px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .visual-text {
          font-size: 14px;
          line-height: 1.5;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          opacity: 0.9;
        }

        /* Testimonial Slider Styles - Premium Glassmorphism */
        .testimonial-slider-glass {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 8px 12px;
          border-radius: 10px;
          color: white;
          position: relative;
          max-width: 100%;
          align-self: flex-start;
          margin-top: 0;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }

        .testimonial-content-wrapper {
          transition: opacity 0.4s ease;
        }

        .testimonial-content-wrapper.rising {
          animation: slowRiseUp 0.6s ease forwards;
        }

        @keyframes slowRiseUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .testimonial-quote {
          font-style: italic;
          font-size: 11px;
          line-height: 1.4;
          margin-bottom: 6px;
          font-weight: 300;
          opacity: 0.9;
        }

        .testimonial-meta {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 8px;
        }

        .author-name {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .author-stars {
          color: var(--gold);
          font-size: 8px;
          margin-bottom: 4px;
        }

        .author-role {
          font-size: 10px;
          opacity: 0.7;
          font-weight: 400;
        }

        .author-subtext {
          font-size: 8.5px;
          color: var(--gold);
          opacity: 0.8;
          font-style: italic;
          margin-top: 1px;
        }

        .slider-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }

        .slider-controls {
          display: flex;
          gap: 6px;
        }

        .slider-arrow {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 10px;
        }

        .slider-arrow:hover {
          background: white;
          color: black;
        }

        .slider-pagination {
          display: flex;
          gap: 4px;
        }

        .slider-pagination .dot {
          width: 12px;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 1px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .slider-pagination .dot.active {
          background: var(--gold);
          width: 24px;
        }

        .login-form-panel {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-content-inner {
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
        }

        .form-header h1 {
          font-size: 28px;
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 8px;
          color: #1a1a1a;
        }

        .form-subtitle {
          font-size: 13px;
          color: #666;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .input-group-new {
          margin-bottom: 20px;
        }

        .input-group-new label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .input-group-new input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          background: #f9f9f9;
          transition: all 0.3s;
        }

        .input-group-new input:focus {
          outline: none;
          border-color: var(--gold);
          background: white;
          box-shadow: 0 0 0 4px rgba(184, 151, 90, 0.1);
        }

        .password-wrapper {
          position: relative;
        }

        .forgot-password-row {
          margin: -12px 0 18px;
          text-align: right;
        }

        .forgot-password-row a {
          color: var(--gold);
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
        }

        .forgot-password-row a:hover,
        .forgot-password-row a:focus-visible {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 18px;
        }

        .btn-auth-submit {
          width: 100%;
          padding: 14px;
          background: #6366f1; /* Using Indigo like in image, but can change to gold if needed */
          background: var(--gold);
          color: var(--black);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-top: 10px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-auth-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(184, 151, 90, 0.2);
        }

        .divider-new {
          display: flex;
          align-items: center;
          margin: 24px 0;
        }

        .divider-new::before, .divider-new::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e0e0e0;
        }

        .divider-new span {
          padding: 0 12px;
          font-size: 12px;
          color: #999;
        }

        .social-auth-btns {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .btn-social {
          flex: 1;
          height: 48px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-social:hover {
          background: #f5f5f5;
        }

        .btn-social img {
          width: 20px;
        }

        .switch-auth-text {
          text-align: center;
          font-size: 13px;
          color: #666;
        }

        .switch-auth-text button {
          background: none;
          border: none;
          color: var(--gold);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .form-logo-mobile {
          display: none;
          width: 40px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .login-page-root {
            padding: 10px;
            padding-top: 60px;
          }
          .login-container-new {
            height: auto;
            flex-direction: column;
            border-radius: 16px;
          }
          .login-visual-panel {
            display: block;
            height: 300px; /* Slightly taller to accommodate content */
          }
          .glass-overlay {
            padding: 24px 20px;
            justify-content: space-between; /* Pushes testimonial top, branding bottom */
            align-items: center; /* Center align items horizontally */
            text-align: center;
          }
          .visual-logo-top {
            display: block;
            width: 40px;
            margin: 0 auto 12px; /* Center logo */
          }
          .visual-content {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .visual-heading {
            font-size: 9px;
            letter-spacing: 2px;
            margin-bottom: 6px;
          }
          .visual-text {
            font-size: 13.5px;
            max-width: 250px;
            margin: 0 auto;
          }
          .testimonial-slider-glass {
            max-width: 100%;
            width: 100%; /* Full width for centering content */
            padding: 6px 10px;
            border-radius: 8px;
          }
          .testimonial-quote {
            font-size: 10.5px;
            margin-bottom: 2px;
          }
          .slider-arrow {
            width: 18px;
            height: 18px;
            font-size: 10px;
          }
          .author-info {
             width: 100%;
             text-align: center;
          }
          .author-stars {
            justify-content: center;
            display: flex;
          }
          .slider-bottom-row {
            justify-content: center;
            gap: 15px;
          }
          .form-logo-mobile {
            display: none; /* Hide since it's now in the visual panel */
          }
          .login-form-panel {
            padding: 30px 20px;
          }
          .form-content-inner {
            max-width: 100%;
          }
        }

        .back-btn-luxury {
          position: absolute;
          top: 30px;
          left: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .back-btn-luxury i {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .back-btn-luxury:hover {
          color: var(--gold);
        }

        .back-btn-luxury:hover i {
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          .back-btn-luxury {
            top: 20px;
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
}
