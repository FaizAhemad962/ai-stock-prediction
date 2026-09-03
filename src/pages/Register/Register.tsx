import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import { startGoogleAuth } from "../../services/api";

export function Register() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    register<{ message: string }>(name, email, password)
      .then((response) => {
        setMessage(response.message);
        navigate("/dashboard");
      })
      .catch((error: Error) => setMessage(error.message));
  };

  const handleGoogleSignup = () => {
    void startGoogleAuth<{ message: string }>().then((response) => setMessage(response.message));
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
              <input type="text" name="name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} required />
            </span>
          </label>

          <label>
            Email address
            <span className="auth-input">
              <Mail size={15} />
              <input type="email" name="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </span>
          </label>

          <label>
            Password
            <span className="auth-input">
              <LockKeyhole size={15} />
              <input type="password" name="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
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
