import { Bell, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser, getNotifications, markNotificationRead, searchStocks, logout } from "../../services/api";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

type CurrentUser = {
  name: string;
  email: string;
};

export function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [openMenu, setOpenMenu] = useState<
    "exchange" | "notifications" | "profile" | null
  >(null);
  const [exchange, setExchange] = useState<"NSE" | "BSE">("NSE");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<CurrentUser>({ name: "Investor", email: "" });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => {
    getNotifications<Notification[]>()
      .then(setNotifications)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    getCurrentUser<CurrentUser>()
      .then(setUser)
      .catch(() => undefined);
  }, []);

  const handleSearch = async () => {
    const symbol = query.trim();

    if (!symbol) {
      return;
    }

    const results = await searchStocks(symbol);
    const stock = results[0];

    if (stock) {
      setSearchError(false);
      navigate(`/stock/${stock.symbol}`);
      return;
    }

    setSearchError(true);
  };

  const handleLogout = () => {
    setOpenMenu(null);
    void logout().finally(() => navigate("/login"));
  };

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={19} />

        <input
          aria-label="Search stocks, companies or symbols"
          value={query}
          type="text"
          placeholder="Search stocks, companies or symbols..."
          onChange={(event) => {
            setQuery(event.target.value);
            setSearchError(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <kbd>⌘ K</kbd>

        {searchError ? (
          <span className="header-search-error" role="status">
            Stock not found
          </span>
        ) : null}
      </div>

      <div className="header-actions" ref={menuRef}>
        <div className="exchange-selector">
          <button
            className="market-indicator"
            aria-label="Select exchange"
            aria-expanded={openMenu === "exchange"}
            onClick={() => setOpenMenu(openMenu === "exchange" ? null : "exchange")}
          >
          <span className="status-dot" />
            {exchange}
            <ChevronDown size={12} />
          </button>

          {openMenu === "exchange" ? (
            <div className="exchange-menu" role="menu">
              {(["NSE", "BSE"] as const).map((option) => (
                <button
                  key={option}
                  className={option === exchange ? "active" : ""}
                  onClick={() => {
                    setExchange(option);
                    setOpenMenu(null);
                  }}
                  role="menuitem"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          className="icon-button"
          aria-label="Show notifications"
          aria-expanded={openMenu === "notifications"}
          onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <button
          className="profile-button"
          onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
          aria-label="Open profile menu"
          aria-expanded={openMenu === "profile"}
        >
          <span className="avatar small">U</span>

          <span className="profile-name">{user.name}</span>

          <ChevronDown size={16} />
        </button>

        {openMenu === "notifications" ? (
          <div className="header-menu notification-menu" role="status">
            <div className="header-menu-heading">
              <strong>Notifications</strong>
              <span>{notifications.filter((item) => !item.read).length} new</span>
            </div>
            {notifications.length > 0 ? notifications.map((item) => (
              <button key={item.id} className="notification-item" onClick={() => void markNotificationRead(item.id).then(() => setNotifications((current) => current.map((notification) => notification.id === item.id ? { ...notification, read: true } : notification)))}>
                {item.message}
              </button>
            )) : (
              <p>No new notifications.</p>
            )}
            <button onClick={() => navigate("/settings#settings-notifications")}>
              Notification settings
            </button>
          </div>
        ) : null}

        {openMenu === "profile" ? (
          <div className="header-menu profile-menu">
            <div className="profile-menu-heading">
              <span className="avatar small">U</span>
              <div>
                <strong>{user.name}</strong>
                <span>Free workspace</span>
              </div>
            </div>
            <button onClick={() => navigate("/settings#settings-account")}>
              Account settings
            </button>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : null}

      </div>
    </header>
  );
}
