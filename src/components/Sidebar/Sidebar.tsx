import {
  BarChart3,
  Bookmark,
  BrainCircuit,
  LayoutDashboard,
  Newspaper,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Markets", icon: BarChart3, path: "/markets" },
  { label: "Watchlist", icon: Bookmark, path: "/watchlist" },
  { label: "Portfolio", icon: WalletCards, path: "/portfolio" },
];

const intelligence = [
  { label: "AI Insights", icon: BrainCircuit, path: "/ai-insights" },
  { label: "News", icon: Newspaper, path: "/news" },
];

export function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>

        <div>
          <span className="brand-name">NEXUS</span>
          <span className="brand-subtitle">Market Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-title">WORKSPACE</span>

        {navigation.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}

        <span className="nav-section-title intelligence-title">
          INTELLIGENCE
        </span>

        {intelligence.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}

      </nav>

      <div className="sidebar-bottom">
        <button
          className="sidebar-user"
          onClick={() => setProfileOpen(!profileOpen)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
        >
          <div className="avatar">U</div>

          <div>
            <strong>Investor</strong>
            <span>Free workspace</span>
          </div>
        </button>

        {profileOpen ? (
          <div className="sidebar-profile-menu">
            <NavLink to="/settings#settings-account">Account settings</NavLink>
            <button onClick={() => navigate("/login")}>Log out</button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
