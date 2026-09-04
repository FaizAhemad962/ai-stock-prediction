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
import { logout } from "../../services/api";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", tour: "nav-dashboard" },
  { label: "Markets", icon: BarChart3, path: "/markets", tour: "nav-markets" },
  { label: "Watchlist", icon: Bookmark, path: "/watchlist", tour: "nav-watchlist" },
  { label: "Portfolio", icon: WalletCards, path: "/portfolio", tour: "nav-portfolio" },
];

const intelligence = [
  { label: "AI Insights", icon: BrainCircuit, path: "/ai-insights", tour: "nav-ai-insights" },
  { label: "News", icon: Newspaper, path: "/news", tour: "nav-news" },
];

export function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className="sidebar" data-tour="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>

        <div>
          <span className="brand-name">NEXUS</span>
          <span className="brand-subtitle">Market Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-title">WORKSPACE</span>

        {navigation.map(({ label, icon: Icon, path, tour }) => (
          <NavLink
            key={label}
            to={path}
            data-tour={tour}
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

        {intelligence.map(({ label, icon: Icon, path, tour }) => (
          <NavLink
            key={label}
            to={path}
            data-tour={tour}
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
          data-tour="nav-profile"
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
            <button onClick={() => void logout().finally(() => navigate("/login"))}>Log out</button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
