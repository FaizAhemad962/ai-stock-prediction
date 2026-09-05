import {
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Database,
  Eye,
  Globe2,
  Lock,
  Monitor,
  Moon,
  Palette,
  Shield,
  Smartphone,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { changePassword, getCurrentUser, getPreferences, getPrivacy, revokeOtherSessions, updateCurrentUser, updatePreferences, updatePrivacy } from "../../services/api";

type Preferences = {
  theme: "dark" | "system";
  compact_mode: boolean;
  notifications: boolean;
  price_alerts: boolean;
  news_alerts: boolean;
  ai_alerts: boolean;
  market_region: string;
  timezone: string;
  ai_frequency_minutes: number;
};

type Account = {
  id: string;
  name: string;
  email: string;
};

function readStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback;
  }

  return window.localStorage.getItem(key) === null
    ? fallback
    : window.localStorage.getItem(key) === "true";
}

function readStoredTheme(): "dark" | "system" {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("nexus-theme") === "system"
    ? "system"
    : "dark";
}

function readHashSection() {
  if (typeof window === "undefined") {
    return "account";
  }

  return window.location.hash.replace("#settings-", "") || "account";
}

export function Settings() {
  const location = useLocation();
  const [notifications, setNotifications] = useState(() =>
    readStoredBoolean("nexus-notifications", true),
  );
  const [priceAlerts, setPriceAlerts] = useState(() =>
    readStoredBoolean("nexus-price-alerts", true),
  );
  const [newsAlerts, setNewsAlerts] = useState(() =>
    readStoredBoolean("nexus-news-alerts", true),
  );
  const [aiAlerts, setAiAlerts] = useState(() =>
    readStoredBoolean("nexus-ai-alerts", true),
  );
  const [compactMode, setCompactMode] = useState(() =>
    readStoredBoolean("nexus-compact-mode", false),
  );
  const [theme, setTheme] = useState<"dark" | "system">(readStoredTheme);
  const [actionMessage, setActionMessage] = useState("");
  const [activeSection, setActiveSection] = useState(readHashSection);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [account, setAccount] = useState<Account>({ id: "", name: "Investor", email: "" });
  const [profileName, setProfileName] = useState("Investor");
  const [profileEmail, setProfileEmail] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [marketRegion, setMarketRegion] = useState("India");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [aiFrequency, setAiFrequency] = useState(15);
  const [securityPanel, setSecurityPanel] = useState<"password" | "privacy" | "devices" | null>(null);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [privacyAnalytics, setPrivacyAnalytics] = useState(true);
  const [privacyPersonalization, setPrivacyPersonalization] = useState(true);

  useEffect(() => {
    getCurrentUser<Account>()
      .then((currentUser) => {
        setAccount(currentUser);
        setProfileName(currentUser.name);
        setProfileEmail(currentUser.email);
      })
      .catch(() => undefined);

    getPreferences<Preferences>()
      .then((preferences) => {
        setNotifications(preferences.notifications);
        setPriceAlerts(preferences.price_alerts);
        setNewsAlerts(preferences.news_alerts);
        setAiAlerts(preferences.ai_alerts);
        setCompactMode(preferences.compact_mode);
        setTheme(preferences.theme);
        setMarketRegion(preferences.market_region);
        setTimezone(preferences.timezone);
        setAiFrequency(preferences.ai_frequency_minutes);
        setPreferencesLoaded(true);
      })
      .catch(() => {
        setPreferencesLoaded(true);
        setActionMessage("Using local preferences while the backend is unavailable.");
      });

    getPrivacy<{ analytics: boolean; personalization: boolean }>()
      .then((privacy) => {
        setPrivacyAnalytics(privacy.analytics);
        setPrivacyPersonalization(privacy.personalization);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    void updatePrivacy({ analytics: privacyAnalytics, personalization: privacyPersonalization }).catch(() => undefined);
  }, [privacyAnalytics, privacyPersonalization]);

  useEffect(() => {
    const settings = {
      "nexus-notifications": notifications,
      "nexus-price-alerts": priceAlerts,
      "nexus-news-alerts": newsAlerts,
      "nexus-ai-alerts": aiAlerts,
      "nexus-compact-mode": compactMode,
      "nexus-theme": theme,
    };

    Object.entries(settings).forEach(([key, value]) => {
      window.localStorage.setItem(key, String(value));
    });

    if (!preferencesLoaded) {
      return;
    }

    void updatePreferences<Preferences>({
      theme,
      compact_mode: compactMode,
      notifications,
      price_alerts: priceAlerts,
      news_alerts: newsAlerts,
      ai_alerts: aiAlerts,
      market_region: marketRegion,
      timezone,
      ai_frequency_minutes: aiFrequency,
    }).catch(() => undefined);
  }, [aiAlerts, compactMode, marketRegion, newsAlerts, notifications, preferencesLoaded, priceAlerts, theme, timezone, aiFrequency]);

  useEffect(() => {
    const section = location.hash.replace("#settings-", "");

    if (!section) {
      return;
    }

    document.getElementById(`settings-${section}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [location.hash]);

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void changePassword({ current_password: String(form.get("current_password")), new_password: String(form.get("new_password")) })
      .then(() => setPasswordMessage("Password updated"))
      .catch((requestError: Error) => setPasswordMessage(requestError.message));
  };

  const saveProfile = () => {
    void updateCurrentUser<Account>({ name: profileName.trim(), email: profileEmail.trim() })
      .then((updatedAccount) => {
        setAccount(updatedAccount);
        setProfileName(updatedAccount.name);
        setProfileEmail(updatedAccount.email);
        setEditingProfile(false);
        setActionMessage("Profile updated");
      })
      .catch(() => setActionMessage("Profile could not be updated"));
  };

  const navigateToSection = (section: string) => {
    setActiveSection(section);
    document.getElementById(`settings-${section}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="settings-page" data-tour="settings">
      <section className="page-heading">
        <div>
          <p className="eyebrow">APPLICATION CONTROL</p>

          <h1>Settings</h1>

          <p className="page-description">
            Manage your preferences, alerts, appearance and privacy.
          </p>
        </div>

        <div className="settings-status" role="status" aria-live="polite">
          <span />
          {actionMessage || "All changes saved"}
        </div>
      </section>

      <div className="settings-layout">
        <aside className="settings-navigation ui-card">
          <div className="settings-profile">
            <div className="profile-avatar">
              <User size={17} />
            </div>

            <div>
              <strong>{account.name}</strong>
              <span>{account.email || "Personal account"}</span>
            </div>
          </div>

          <div className="settings-nav-list">
            <button
              className={activeSection === "account" ? "active" : ""}
              aria-current={activeSection === "account" ? "page" : undefined}
              onClick={() => navigateToSection("account")}
            >
              <User size={13} />
              Account
            </button>

            <button
              className={activeSection === "notifications" ? "active" : ""}
              aria-current={activeSection === "notifications" ? "page" : undefined}
              onClick={() => navigateToSection("notifications")}
            >
              <Bell size={13} />
              Notifications
            </button>

            <button
              className={activeSection === "appearance" ? "active" : ""}
              aria-current={activeSection === "appearance" ? "page" : undefined}
              onClick={() => navigateToSection("appearance")}
            >
              <Palette size={13} />
              Appearance
            </button>

            <button
              className={activeSection === "privacy" ? "active" : ""}
              aria-current={activeSection === "privacy" ? "page" : undefined}
              onClick={() => navigateToSection("privacy")}
            >
              <Shield size={13} />
              Privacy & Security
            </button>

            <button
              className={activeSection === "data" ? "active" : ""}
              aria-current={activeSection === "data" ? "page" : undefined}
              onClick={() => navigateToSection("data")}
            >
              <Database size={13} />
              Data & AI
            </button>
          </div>

          <div className="settings-version">
            <span>AI Market Intelligence</span>
            <strong>v1.0.0</strong>
          </div>
        </aside>

        <main className="settings-content">
          <section className="settings-section" id="settings-account">
            <div className="settings-section-heading">
              <div>
                <span className="card-label">ACCOUNT</span>
                <h2>Account preferences</h2>
              </div>
            </div>

            <div className="ui-card settings-card">
              <div className="settings-row">
                <div className="settings-row-icon">
                  <User size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Profile</strong>
                  <span>
                    Manage your basic account information.
                  </span>
                </div>

                {editingProfile ? (
                  <div className="settings-inline-form">
                    <input aria-label="Profile name" value={profileName} onChange={(event) => setProfileName(event.target.value)} />
                    <input aria-label="Profile email" type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} />
                    <button className="settings-action" onClick={saveProfile} disabled={!profileName.trim() || !profileEmail.trim()}>Save</button>
                    <button className="settings-action" onClick={() => setEditingProfile(false)}>Cancel</button>
                  </div>
                ) : (
                  <button className="settings-action" onClick={() => setEditingProfile(true)}>
                    Edit
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">
                  <Globe2 size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Market region</strong>
                  <span>{marketRegion} · NSE &amp; BSE</span>
                </div>

                <select aria-label="Market region" value={marketRegion} onChange={(event) => setMarketRegion(event.target.value)}>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">
                  <Clock3 size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Timezone</strong>
                  <span>{timezone}</span>
                </div>

                <select aria-label="Timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                  <option value="Asia/Kolkata">Asia/Kolkata · IST</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York · ET</option>
                </select>
              </div>
            </div>
          </section>

          <section className="settings-section" id="settings-notifications">
            <div className="settings-section-heading">
              <div>
                <span className="card-label">NOTIFICATIONS</span>
                <h2>Alert preferences</h2>
              </div>
            </div>

            <div className="ui-card settings-card">
              <ToggleRow
                icon={<Bell size={14} />}
                title="Push notifications"
                description="Receive important updates from the application."
                enabled={notifications}
                onToggle={() =>
                  setNotifications(!notifications)
                }
              />

              <ToggleRow
                icon={<Zap size={14} />}
                title="Price alerts"
                description="Get notified when watched stocks move significantly."
                enabled={priceAlerts}
                onToggle={() =>
                  setPriceAlerts(!priceAlerts)
                }
              />

              <ToggleRow
                icon={<Bell size={14} />}
                title="News alerts"
                description="Receive alerts for important stock-related news."
                enabled={newsAlerts}
                onToggle={() =>
                  setNewsAlerts(!newsAlerts)
                }
              />

              <ToggleRow
                icon={<Zap size={14} />}
                title="AI insight alerts"
                description="Notify me when the AI detects a significant signal."
                enabled={aiAlerts}
                onToggle={() =>
                  setAiAlerts(!aiAlerts)
                }
              />
            </div>
          </section>

          <section className="settings-section" id="settings-appearance">
            <div className="settings-section-heading">
              <div>
                <span className="card-label">APPEARANCE</span>
                <h2>Interface preferences</h2>
              </div>
            </div>

            <div className="ui-card settings-card">
              <div className="settings-row">
                <div className="settings-row-icon">
                  <Moon size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Theme</strong>
                  <span>{theme === "dark" ? "Dark interface" : "System preference"}</span>
                </div>

                <div className="theme-options">
                  <button
                    className={`theme-option ${theme === "dark" ? "active" : ""}`}
                    onClick={() => setTheme("dark")}
                    aria-pressed={theme === "dark"}
                  >
                    <Moon size={11} />
                    Dark
                  </button>

                  <button
                    className={`theme-option ${theme === "system" ? "active" : ""}`}
                    onClick={() => setTheme("system")}
                    aria-pressed={theme === "system"}
                  >
                    <Monitor size={11} />
                    System
                  </button>
                </div>
              </div>

              <ToggleRow
                icon={<Monitor size={14} />}
                title="Compact mode"
                description="Display more market information in less space."
                enabled={compactMode}
                onToggle={() =>
                  setCompactMode(!compactMode)
                }
              />
            </div>
          </section>

          <section className="settings-section" id="settings-privacy">
            <div className="settings-section-heading">
              <div>
                <span className="card-label">PRIVACY & SECURITY</span>
                <h2>Security controls</h2>
              </div>

              <div className="secure-label">
                <Shield size={11} />
                Protected
              </div>
            </div>

            <div className="ui-card settings-card">
              <div className="settings-row">
                <div className="settings-row-icon security">
                  <Lock size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Account security</strong>
                  <span>
                    Password, authentication and active sessions.
                  </span>
                </div>

                <button className="settings-action" onClick={() => setSecurityPanel(securityPanel === "password" ? null : "password") }>
                  Manage
                  <ChevronRight size={12} />
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon security">
                  <Eye size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Privacy controls</strong>
                  <span>
                    Control how application data is used.
                  </span>
                </div>

                <button className="settings-action" onClick={() => setSecurityPanel(securityPanel === "privacy" ? null : "privacy") }>
                  Review
                  <ChevronRight size={12} />
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon security">
                  <Smartphone size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Active devices</strong>
                  <span>2 devices currently connected.</span>
                </div>

                <button className="settings-action" onClick={() => setSecurityPanel(securityPanel === "devices" ? null : "devices") }>
                  View
                  <ChevronRight size={12} />
                </button>
              </div>

              {securityPanel === "password" ? (
                <form className="settings-inline-form" onSubmit={handlePasswordSubmit}>
                  <input aria-label="Current password" name="current_password" type="password" placeholder="Current password" minLength={8} required />
                  <input aria-label="New password" name="new_password" type="password" placeholder="New password" minLength={8} required />
                  <button className="settings-action" type="submit">Request change</button>
                  {passwordMessage ? <span role="status">{passwordMessage}</span> : null}
                </form>
              ) : null}

              {securityPanel === "privacy" ? (
                <div className="settings-inline-form">
                  <ToggleRow icon={<Eye size={14} />} title="Usage analytics" description="Help improve product performance." enabled={privacyAnalytics} onToggle={() => setPrivacyAnalytics(!privacyAnalytics)} />
                  <ToggleRow icon={<Shield size={14} />} title="Personalized insights" description="Use preferences to tailor market signals." enabled={privacyPersonalization} onToggle={() => setPrivacyPersonalization(!privacyPersonalization)} />
                </div>
              ) : null}

              {securityPanel === "devices" ? (
                <div className="settings-inline-form" role="status">
                  <span>Current browser session</span>
                  <button className="settings-action" type="button" onClick={() => void revokeOtherSessions().then(() => setActionMessage("Other sessions revoked")).catch((requestError: Error) => setActionMessage(requestError.message))}>Revoke other sessions</button>
                </div>
              ) : null}
            </div>
          </section>

          <section className="settings-section" id="settings-data">
            <div className="settings-section-heading">
              <div>
                <span className="card-label">DATA & AI</span>
                <h2>Intelligence preferences</h2>
              </div>
            </div>

            <div className="ui-card settings-card">
              <div className="settings-row">
                <div className="settings-row-icon ai">
                  <Zap size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>AI analysis frequency</strong>
                  <span>
                    Analysis updates every {aiFrequency} minutes.
                  </span>
                </div>

                <select aria-label="AI analysis frequency" value={aiFrequency} onChange={(event) => setAiFrequency(Number(event.target.value))}>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon ai">
                  <Database size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Market data</strong>
                  <span>
                    NSE, BSE and selected global market data.
                  </span>
                </div>

                <span className="connected-status">
                  Connected
                </span>
              </div>
            </div>
          </section>

          <div className="settings-footer-note">
            <Check size={12} />

            <span>
              Your preferences are stored locally during the UI
              development phase.
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

type ToggleRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function ToggleRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: ToggleRowProps) {
  return (
    <div className="settings-row">
      <div className="settings-row-icon">{icon}</div>

      <div className="settings-row-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        className={`settings-toggle ${enabled ? "enabled" : ""}`}
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
      >
        <span />
      </button>
    </div>
  );
}
 