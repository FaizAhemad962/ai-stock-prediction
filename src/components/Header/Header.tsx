import { Bell, ChevronDown, Search } from "lucide-react";

export function Header() {
  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search stocks, companies or symbols..."
        />

        <kbd>⌘ K</kbd>
      </div>

      <div className="header-actions">
        <div className="market-indicator">
          <span className="status-dot" />
          NSE
        </div>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <button className="profile-button">
          <span className="avatar small">U</span>

          <span className="profile-name">Investor</span>

          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}
