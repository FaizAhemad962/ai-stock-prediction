import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export function Register() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Account creation will be connected when the backend is ready.");
  };

  const handleGoogleSignup = () => {
    setMessage("Google sign-up will be connected during the authentication phase.");
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
          <p className="eyebrow">START YOUR WORKSPACE</p>
          <h1>Create your investor account</h1>
          <p>Set up one place for market data, watchlists, and intelligent insights.</p>
        </div>

        <button className="google-auth-button" type="button" onClick={handleGoogleSignup}>
          <strong>G</strong>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or register with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <span className="auth-input">
              <UserRound size={15} />
              <input type="text" name="name" placeholder="Your name" required />
            </span>
          </label>

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
              <input type="password" name="password" placeholder="At least 8 characters" minLength={8} required />
            </span>
          </label>

          <button className="primary-button auth-submit" type="submit">
            Create account
            <ArrowRight size={14} />
          </button>
        </form>

        {message ? <p className="auth-message" role="status">{message}</p> : null}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <Link className="auth-back-link" to="/dashboard">Return to dashboard</Link>
      </section>
    </main>
  );
}
