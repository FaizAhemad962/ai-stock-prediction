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
import { useState } from "react";

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="settings-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">APPLICATION CONTROL</p>

          <h1>Settings</h1>

          <p className="page-description">
            Manage your preferences, alerts, appearance and privacy.
          </p>
        </div>

        <div className="settings-status">
          <span />
          All changes saved
        </div>
      </section>

      <div className="settings-layout">
        <aside className="settings-navigation ui-card">
          <div className="settings-profile">
            <div className="profile-avatar">
              <User size={17} />
            </div>

            <div>
              <strong>Investor</strong>
              <span>Personal account</span>
            </div>
          </div>

          <div className="settings-nav-list">
            <button className="active">
              <User size={13} />
              Account
            </button>

            <button>
              <Bell size={13} />
              Notifications
            </button>

            <button>
              <Palette size={13} />
              Appearance
            </button>

            <button>
              <Shield size={13} />
              Privacy & Security
            </button>

            <button>
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
          <section className="settings-section">
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

                <button className="settings-action">
                  Edit
                  <ChevronRight size={12} />
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">
                  <Globe2 size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Market region</strong>
                  <span>India · NSE & BSE</span>
                </div>

                <button className="settings-action">
                  Change
                  <ChevronRight size={12} />
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">
                  <Clock3 size={14} />
                </div>

                <div className="settings-row-content">
                  <strong>Timezone</strong>
                  <span>Asia/Kolkata · IST</span>
                </div>

                <button className="settings-action">
                  Change
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>

          <section className="settings-section">
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

          <section className="settings-section">
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
                  <span>Dark interface</span>
                </div>

                <div className="theme-options">
                  <button className="theme-option active">
                    <Moon size={11} />
                    Dark
                  </button>

                  <button className="theme-option">
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

          <section className="settings-section">
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

                <button className="settings-action">
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

                <button className="settings-action">
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

                <button className="settings-action">
                  View
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>

          <section className="settings-section">
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
                    Analysis updates every 15 minutes.
                  </span>
                </div>

                <button className="settings-action">
                  Change
                  <ChevronRight size={12} />
                </button>
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
 