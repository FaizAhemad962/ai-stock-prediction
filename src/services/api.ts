import type { MarketIndex, MarketMover, NewsFeedItem, PortfolioHolding, PricePoint, SectorPerformance, Stock, TechnicalIndicator } from "../types/stock";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  const token = localStorage.getItem("nexus_session_token");
  const headers = new Headers(options?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("The backend is unavailable. Start the FastAPI server and try again.", 0);
  }
  if (!response.ok) throw new ApiError(`The request failed with status ${response.status}.`, response.status);
  return response.json() as Promise<T>;
}

const currency = (value: number) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const percent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

export type MarketOverview = { exchange: string; marketStatus: string; isStale: boolean; indices: MarketIndex[]; gainers: MarketMover[]; losers: MarketMover[]; sectors: SectorPerformance[] };
type ApiMarket = { exchange: string; market_status: string; is_stale: boolean; indices: Array<{ name: string; value: number; change: number; change_percent: number }>; gainers: Array<{ symbol: string; name: string; price: number; change_percent: number }>; losers: Array<{ symbol: string; name: string; price: number; change_percent: number }>; sectors: Array<{ name: string; performance_percent: number }> };

export async function getMarketOverview(exchange = "NSE"): Promise<MarketOverview> {
  const data = await request<ApiMarket>(`/api/markets/overview?exchange=${exchange}`);
  return { exchange: data.exchange, marketStatus: data.market_status, isStale: data.is_stale, indices: data.indices.map((item) => ({ name: item.name, value: currency(item.value), change: `${item.change >= 0 ? "+" : "-"}${currency(Math.abs(item.change))}`, percentage: percent(item.change_percent), positive: item.change_percent >= 0 })), gainers: data.gainers.map((item) => ({ symbol: item.symbol, name: item.name, price: currency(item.price), change: percent(item.change_percent) })), losers: data.losers.map((item) => ({ symbol: item.symbol, name: item.name, price: currency(item.price), change: percent(item.change_percent) })), sectors: data.sectors.map((item) => ({ name: item.name, performance: percent(item.performance_percent), positive: item.performance_percent >= 0 })) };
}

export async function getDashboard(exchange = "NSE"): Promise<MarketOverview> {
  const data = await request<ApiMarket>(`/api/dashboard?exchange=${exchange}`);
  return {
    exchange: data.exchange,
    marketStatus: data.market_status,
    isStale: data.is_stale,
    indices: data.indices.map((item) => ({ name: item.name, value: currency(item.value), change: `${item.change >= 0 ? "+" : "-"}${currency(Math.abs(item.change))}`, percentage: percent(item.change_percent), positive: item.change_percent >= 0 })),
    gainers: data.gainers.map((item) => ({ symbol: item.symbol, name: item.name, price: currency(item.price), change: percent(item.change_percent) })),
    losers: data.losers.map((item) => ({ symbol: item.symbol, name: item.name, price: currency(item.price), change: percent(item.change_percent) })),
    sectors: data.sectors.map((item) => ({ name: item.name, performance: percent(item.performance_percent), positive: item.performance_percent >= 0 })),
  };
}

type ApiStock = { symbol: string; name: string; exchange: string; sector: string; price: number; change: number; change_percent: number; currency: string; market_cap?: number; volume?: number };
const mapStock = (item: ApiStock): Stock => ({ symbol: item.symbol, name: item.name, market: item.exchange as Stock["market"], sector: item.sector, price: item.price, change: item.change, changePercent: item.change_percent, currency: item.currency, marketCap: item.market_cap, volume: item.volume });
export async function searchStocks(query: string, exchange = "NSE"): Promise<Stock[]> { const data = await request<{ results: ApiStock[] }>(`/api/stocks/search?q=${encodeURIComponent(query)}&exchange=${exchange}`); return data.results.map(mapStock); }
export async function getStock(symbol: string, exchange = "NSE"): Promise<Stock> { return mapStock(await request<ApiStock>(`/api/stocks/${encodeURIComponent(symbol)}?exchange=${exchange}`)); }
export async function getStockHistory(symbol: string, range = "1M", exchange = "NSE"): Promise<PricePoint[]> { return (await request<{ points: PricePoint[] }>(`/api/stocks/${encodeURIComponent(symbol)}/history?range=${range}&exchange=${exchange}`)).points; }
export async function getStockTechnicals(symbol: string, exchange = "NSE"): Promise<TechnicalIndicator[]> { return (await request<{ indicators: TechnicalIndicator[] }>(`/api/stocks/${encodeURIComponent(symbol)}/technicals?exchange=${exchange}`)).indicators; }

type ApiNews = { id: string; title: string; summary: string; source: string; published_at: string; url: string; category: string; sentiment: NewsFeedItem["sentiment"]; impact: NewsFeedItem["impact"]; symbols: string[] };
const mapNews = (item: ApiNews): NewsFeedItem => ({ id: item.id, title: item.title, summary: item.summary, source: item.source, publishedAt: item.published_at, url: item.url, category: item.category, sentiment: item.sentiment, impact: item.impact, stocks: item.symbols });
export type NewsPage = { items: NewsFeedItem[]; page: number; pageSize: number; total: number };
export async function getNewsPage(filters?: { query?: string; category?: string; sentiment?: string; page?: number; pageSize?: number }): Promise<NewsPage> { const params = new URLSearchParams(); if (filters?.query) params.set("q", filters.query); if (filters?.category && filters.category !== "All") params.set("category", filters.category); if (filters?.sentiment && filters.sentiment !== "All") params.set("sentiment", filters.sentiment); if (filters?.page) params.set("page", String(filters.page)); if (filters?.pageSize) params.set("page_size", String(filters.pageSize)); const data = await request<{ items: ApiNews[]; page: number; page_size: number; total: number }>(`/api/news?${params}`); return { items: data.items.map(mapNews), page: data.page, pageSize: data.page_size, total: data.total }; }
export async function getNews(filters?: { query?: string; category?: string; sentiment?: string }): Promise<NewsFeedItem[]> { return (await getNewsPage(filters)).items; }
export async function getStockNews(symbol: string): Promise<NewsFeedItem[]> { return (await request<{ items: ApiNews[] }>(`/api/news/stock/${encodeURIComponent(symbol)}`)).items.map(mapNews); }
export async function getWatchlist(): Promise<string[]> { return (await request<{ symbols: string[] }>("/api/watchlist")).symbols; }
export async function addToWatchlist(symbol: string): Promise<string[]> { return (await request<{ symbols: string[] }>("/api/watchlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symbol }) })).symbols; }
export async function removeFromWatchlist(symbol: string): Promise<string[]> { return (await request<{ symbols: string[] }>(`/api/watchlist/${encodeURIComponent(symbol)}`, { method: "DELETE" })).symbols; }
export async function getPortfolio(): Promise<{ holdings: PortfolioHolding[]; totalValue: number; todayPnl: number; overallPnl: number }> { const data = await request<{ holdings: Array<{ symbol: string; quantity: number; average_price: number; current_price: number }>; total_value: number; today_pnl: number; overall_pnl: number }>("/api/portfolio"); return { holdings: data.holdings.map((item) => ({ symbol: item.symbol, quantity: item.quantity, averagePrice: item.average_price, currentPrice: item.current_price })), totalValue: data.total_value, todayPnl: data.today_pnl, overallPnl: data.overall_pnl }; }
export async function getPortfolioPerformance(): Promise<Array<{ timestamp: string; totalValue: number }>> { const data = await request<Array<{ timestamp: string; total_value: number }>>("/api/portfolio/performance"); return data.map((item) => ({ timestamp: item.timestamp, totalValue: item.total_value })); }
export async function addPortfolioHolding(value: { symbol: string; quantity: number; average_price: number }): Promise<void> { await request("/api/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) }); }
export async function removePortfolioHolding(symbol: string): Promise<void> { await request(`/api/portfolio/${encodeURIComponent(symbol)}`, { method: "DELETE" }); }
export async function getPreferences<T>(): Promise<T> { return request<T>("/api/users/me/preferences"); }
export async function updatePreferences<T>(value: T): Promise<T> { return request<T>("/api/users/me/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) }); }
export async function getNotifications<T>(): Promise<T> { return request<T>("/api/notifications"); }
export async function markNotificationRead<T>(id: string): Promise<T> { return request<T>(`/api/notifications/${encodeURIComponent(id)}`, { method: "PATCH" }); }
export async function getCurrentUser<T>(): Promise<T> { return request<T>("/api/auth/me"); }
export async function updateCurrentUser<T>(value: { name?: string; email?: string }): Promise<T> { return request<T>("/api/users/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) }); }
export async function changePassword(value: { current_password: string; new_password: string }): Promise<void> { await request("/api/users/me/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) }); }
export async function getPrivacy<T>(): Promise<T> { return request<T>("/api/users/me/privacy"); }
export async function updatePrivacy<T>(value: { analytics: boolean; personalization: boolean }): Promise<T> { return request<T>("/api/users/me/privacy", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) }); }
export async function revokeOtherSessions(): Promise<void> { await request("/api/users/me/sessions", { method: "DELETE" }); }
export async function startGoogleAuth<T>(): Promise<T> { return request<T>("/api/auth/google/start"); }
export async function getInsights<T>(symbol?: string): Promise<T> { return request<T>(symbol ? `/api/stocks/${encodeURIComponent(symbol)}/insights` : "/api/insights"); }
export async function getPrediction<T>(symbol: string): Promise<T> { return request<T>(`/api/stocks/${encodeURIComponent(symbol)}/prediction`); }
export async function getPredictionEvaluation<T>(symbol: string): Promise<T> { return request<T>(`/api/stocks/${encodeURIComponent(symbol)}/prediction/evaluation`); }
export async function login<T>(email: string, password: string): Promise<T> { return request<T>("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }); }
export async function register<T>(name: string, email: string, password: string): Promise<T> { return request<T>("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) }); }
export async function logout(): Promise<void> { await request("/api/auth/logout", { method: "POST" }); localStorage.removeItem("nexus_session_token"); }
