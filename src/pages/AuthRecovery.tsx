import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/auth";
import "./AuthRecovery.css";

function getErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as { response?: { data?: { message?: string } }; message?: string };
  return maybeError.response?.data?.message || maybeError.message || fallback;
}

function RecoveryShell({ children, eyebrow }: { children: React.ReactNode; eyebrow: string }) {
  return (
    <section className="recovery-page">
      <Link className="recovery-back" to="/login" aria-label="Back to login">← <span>Login</span></Link>
      <div className="recovery-frame">
        <aside className="recovery-visual" aria-hidden="true">
          <div className="recovery-orbit recovery-orbit-one" />
          <div className="recovery-orbit recovery-orbit-two" />
          <div className="recovery-visual-content">
            <img src="/4.png" alt="" className="recovery-logo" />
            <p className="recovery-kicker">SR ARTÉMORE</p>
            <p className="recovery-visual-copy">A little care,<br /><em>always within reach.</em></p>
            <div className="recovery-rule" />
            <p className="recovery-visual-note">Your account, your collection, your moment of luxury.</p>
          </div>
        </aside>
        <div className="recovery-surface">
          <div className="recovery-content">
            <p className="recovery-eyebrow">{eyebrow}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("");
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (error) {
      setMessage(getErrorMessage(error, "We couldn't send the reset email. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <RecoveryShell eyebrow="Password recovery">
        <div className="recovery-success-mark" aria-hidden="true">✓</div>
        <h1>Check your email.</h1>
        <p className="recovery-lead">If an SR Artémore account matches <strong>{email}</strong>, a reset link is on its way.</p>
        <p className="recovery-expiry">For your security, the link expires in 30 minutes.</p>
        <button className="recovery-text-button" type="button" onClick={() => setSent(false)}>Send another email</button>
        <Link className="recovery-login-link" to="/login">Return to Login <span>→</span></Link>
      </RecoveryShell>
    );
  }

  return (
    <RecoveryShell eyebrow="Password recovery">
      <h1>Forgot your password?</h1>
      <p className="recovery-lead">Enter the email connected to your account and we’ll send a secure reset link.</p>
      <form className="recovery-form" onSubmit={submit} noValidate>
        <label htmlFor="recovery-email">Email address</label>
        <input id="recovery-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} />
        {message && <p className="recovery-message recovery-message-error" aria-live="polite">{message}</p>}
        <button className="recovery-submit" type="submit" disabled={loading || !email.trim()}>{loading ? "Sending link…" : "Send reset link"}</button>
      </form>
      <p className="recovery-footer-copy">Remembered it? <Link to="/login">Back to Login</Link></p>
    </RecoveryShell>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token")?.trim() || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (password.length < 8) return setMessage("Your new password must contain at least 8 characters.");
    if (password !== confirmPassword) return setMessage("The passwords do not match. Please check them and try again.");
    setLoading(true);
    setMessage("");
    try {
      await resetPassword(token, password);
      setComplete(true);
    } catch (error) {
      setMessage(getErrorMessage(error, "This reset link is invalid or has expired. Please request a new one."));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <RecoveryShell eyebrow="Password recovery">
        <div className="recovery-invalid-mark" aria-hidden="true">!</div>
        <h1>This link is incomplete.</h1>
        <p className="recovery-lead">Your password reset link is missing its security token. Please request a fresh link and try again.</p>
        <Link className="recovery-submit recovery-action-link" to="/forgot-password">Request a new link</Link>
        <Link className="recovery-login-link" to="/login">Return to Login <span>→</span></Link>
      </RecoveryShell>
    );
  }

  if (complete) {
    return (
      <RecoveryShell eyebrow="Password updated">
        <div className="recovery-success-mark" aria-hidden="true">✓</div>
        <h1>You’re all set.</h1>
        <p className="recovery-lead">Your password has been updated. You can now sign in with your new details.</p>
        <Link className="recovery-submit recovery-action-link" to="/login">Continue to Login</Link>
      </RecoveryShell>
    );
  }

  return (
    <RecoveryShell eyebrow="Choose a new password">
      <h1>Reset your password.</h1>
      <p className="recovery-lead">Choose a new password for your SR Artémore account. Make it at least 8 characters long.</p>
      <form className="recovery-form" onSubmit={submit} noValidate>
        <label htmlFor="new-password">New password</label>
        <input id="new-password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required disabled={loading} />
        <label htmlFor="confirm-password">Confirm new password</label>
        <input id="confirm-password" type="password" autoComplete="new-password" placeholder="Repeat your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required disabled={loading} />
        {message && <p className="recovery-message recovery-message-error" aria-live="polite">{message}</p>}
        <button className="recovery-submit" type="submit" disabled={loading || !password || !confirmPassword}>{loading ? "Updating password…" : "Reset password"}</button>
      </form>
      <Link className="recovery-login-link" to="/login">Return to Login <span>→</span></Link>
    </RecoveryShell>
  );
}
