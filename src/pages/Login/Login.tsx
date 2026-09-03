import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export function Login() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Authentication will be connected when the backend is ready.");
  };

  const handleGoogleLogin = () => {
    setMessage("Google sign-in will be connected during the authentication phase.");
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link className="auth-brand" to="/dashboard">
          <span className="brand-mark">N</span>
          <span>
            <strong>NEXUS</strong>
            <small>Market Intelligence</small>
          </span>
        </Link>

        <div className="auth-heading">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Sign in to your workspace</h1>
          <p>Continue tracking markets, watchlists, and AI-powered signals.</p>
        </div>

        <button className="google-auth-button" type="button" onClick={handleGoogleLogin}>
          <strong>G</strong>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or continue with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <span className="auth-input">
              <Mail size={15} />
              <input type="email" name="email" placeholder="you@example.com" required />
            </span>
          </label>

          <label>
            Password
            <span className="auth-input">
              <LockKeyhole size={15} />
              <input type="password" name="password" placeholder="Enter your password" minLength={8} required />
            </span>
          </label>

          <button className="primary-button auth-submit" type="submit">
            Sign in
            <ArrowRight size={14} />
          </button>
        </form>

        {message ? <p className="auth-message" role="status">{message}</p> : null}

        <p className="auth-switch">
          New to Nexus? <Link to="/register">Create an account</Link>
        </p>

        <Link className="auth-back-link" to="/dashboard">Return to dashboard</Link>
      </section>
    </main>
  );
}
