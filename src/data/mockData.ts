import type {
	NewsArticle,
	NewsFeedItem,
	MarketIndex,
	MarketMover,
	PortfolioHolding,
	Prediction,
	PricePoint,
	Stock,
	StockDetailData,
	SectorPerformance,
	TechnicalIndicator,
} from "../types/stock";

export const mockStocks: Stock[] = [
	{
		symbol: "SUZLON",
		name: "Suzlon Energy",
		market: "NSE",
		sector: "Renewable Energy",
		price: 52.4,
		change: 1.18,
		changePercent: 2.31,
		currency: "INR",
		marketCap: 714000,
		volume: 84200000,
	},
	{
		symbol: "RELIANCE",
		name: "Reliance Industries",
		market: "NSE",
		sector: "Oil and Gas",
		price: 1458.25,
		change: 12.4,
		changePercent: 0.86,
		currency: "INR",
		marketCap: 19700000,
		volume: 12400000,
	},
	{
		symbol: "TATAMOTORS",
		name: "Tata Motors",
		market: "NSE",
		sector: "Automobile",
		price: 982.6,
		change: -8.15,
		changePercent: -0.82,
		currency: "INR",
		marketCap: 3620000,
		volume: 18600000,
	},
	{
		symbol: "INFY",
		name: "Infosys",
		market: "NSE",
		sector: "Information Technology",
		price: 1482.2,
		change: -32.4,
		changePercent: -2.14,
		currency: "INR",
		marketCap: 6150000,
		volume: 9200000,
	},
	{
		symbol: "TCS",
		name: "Tata Consultancy Services",
		market: "NSE",
		sector: "Information Technology",
		price: 3184.5,
		change: -13.1,
		changePercent: -0.41,
		currency: "INR",
		marketCap: 11500000,
		volume: 3100000,
	},
	{
		symbol: "TATASTEEL",
		name: "Tata Steel",
		market: "NSE",
		sector: "Metals",
		price: 168.25,
		change: 5.97,
		changePercent: 3.68,
		currency: "INR",
		marketCap: 2100000,
		volume: 22100000,
	},
	{
		symbol: "HDFCBANK",
		name: "HDFC Bank",
		market: "NSE",
		sector: "Banking",
		price: 1742.6,
		change: 6.25,
		changePercent: 0.36,
		currency: "INR",
		marketCap: 13200000,
		volume: 5400000,
	},
];

export const mockPriceHistory: Record<string, PricePoint[]> = {
	SUZLON: [
		{ timestamp: "09:15", price: 50.8, volume: 1200000 },
		{ timestamp: "10:30", price: 51.35, volume: 1600000 },
		{ timestamp: "11:45", price: 50.95, volume: 1100000 },
		{ timestamp: "13:00", price: 51.8, volume: 1900000 },
		{ timestamp: "14:15", price: 52.1, volume: 2200000 },
		{ timestamp: "15:30", price: 52.4, volume: 2600000 },
	],
};

export const mockIndicators: TechnicalIndicator[] = [
	{ label: "RSI", value: "58.2", status: "Neutral", signal: "Neutral" },
	{ label: "MACD", value: "+1.24", status: "Positive", signal: "Positive" },
	{ label: "Trend", value: "Bullish", status: "Positive", signal: "Bullish" },
	{ label: "Volume", value: "1.24x", status: "Above average", signal: "Positive" },
];

export const mockNews: NewsArticle[] = [
	{
		id: "renewable-interest",
		title: "Renewable energy sector attracts renewed investor attention",
		source: "Economic Times",
		publishedAt: "32 min ago",
		symbol: "SUZLON",
		sentiment: "Positive",
	},
	{
		id: "wind-capacity",
		title: "Wind energy companies remain in focus as capacity additions accelerate",
		source: "Moneycontrol",
		publishedAt: "1 hr ago",
		symbol: "SUZLON",
		sentiment: "Positive",
	},
	{
		id: "institutional-interest",
		title: "Indian renewable energy market sees increasing institutional interest",
		source: "Business Standard",
		publishedAt: "2 hrs ago",
		symbol: "SUZLON",
		sentiment: "Neutral",
	},
];

export const mockNewsFeed: NewsFeedItem[] = [
	{
		id: "market-renewable-momentum",
		source: "Economic Times",
		publishedAt: "18 min ago",
		category: "Renewable Energy",
		title: "Renewable energy stocks gain momentum as sector outlook improves",
		summary: "Investors continue to track renewable energy companies as new capacity additions and policy developments support the sector.",
		sentiment: "Positive",
		impact: "High",
		stocks: ["SUZLON", "TATASTEEL"],
	},
	{
		id: "institutional-energy-interest",
		source: "Moneycontrol",
		publishedAt: "42 min ago",
		category: "Markets",
		title: "Institutional interest increases across selected Indian energy stocks",
		summary: "Market activity remains elevated as investors monitor institutional flows and improving sector fundamentals.",
		sentiment: "Positive",
		impact: "Medium",
		stocks: ["SUZLON", "RELIANCE"],
	},
	{
		id: "technology-demand",
		source: "Business Standard",
		publishedAt: "1 hr ago",
		category: "Technology",
		title: "IT stocks remain mixed as investors assess global technology demand",
		summary: "Large-cap technology stocks show mixed movement while markets wait for additional clarity around global demand.",
		sentiment: "Neutral",
		impact: "Medium",
		stocks: ["TCS", "INFY"],
	},
	{
		id: "private-bank-flows",
		source: "CNBC TV18",
		publishedAt: "2 hrs ago",
		category: "Banking",
		title: "Large private banks remain in focus following fresh market flows",
		summary: "Banking stocks continue to attract attention as traders evaluate valuations and upcoming financial results.",
		sentiment: "Positive",
		impact: "Medium",
		stocks: ["HDFCBANK", "RELIANCE"],
	},
	{
		id: "global-economic-data",
		source: "Reuters",
		publishedAt: "3 hrs ago",
		category: "Global Markets",
		title: "Global markets remain cautious ahead of key economic data",
		summary: "Investors are monitoring global economic indicators that could influence risk appetite across equity markets.",
		sentiment: "Neutral",
		impact: "High",
		stocks: ["TCS", "RELIANCE"],
	},
	{
		id: "commodity-sentiment",
		source: "Mint",
		publishedAt: "4 hrs ago",
		category: "Metals",
		title: "Metal stocks rally as commodity sentiment improves",
		summary: "Improving commodity prices are supporting selected metal companies and attracting renewed investor interest.",
		sentiment: "Positive",
		impact: "Medium",
		stocks: ["TATASTEEL"],
	},
	{
		id: "it-valuation-review",
		source: "Financial Express",
		publishedAt: "5 hrs ago",
		category: "Technology",
		title: "Investors reassess IT valuations following recent sector movement",
		summary: "Technology stocks remain sensitive to global demand expectations and currency movements.",
		sentiment: "Negative",
		impact: "Low",
		stocks: ["INFY", "TCS"],
	},
	{
		id: "afternoon-equities",
		source: "NDTV Profit",
		publishedAt: "6 hrs ago",
		category: "Markets",
		title: "Indian equities maintain positive momentum during afternoon trading",
		summary: "Broad market participation remains healthy while investors continue to monitor sector-specific developments.",
		sentiment: "Positive",
		impact: "Medium",
		stocks: ["SUZLON", "RELIANCE", "TATASTEEL"],
	},
];

export const mockPortfolio: PortfolioHolding[] = [
	{ symbol: "SUZLON", quantity: 250, averagePrice: 44.2, currentPrice: 52.4 },
	{ symbol: "RELIANCE", quantity: 12, averagePrice: 1398.5, currentPrice: 1458.25 },
	{ symbol: "INFY", quantity: 20, averagePrice: 1512.1, currentPrice: 1482.2 },
];

export const mockPredictions: Prediction[] = [
	{
		symbol: "SUZLON",
		outlook: "Bullish",
		confidence: 78,
		summary: "Momentum remains constructive while volume stays above its recent average.",
		factors: ["Positive momentum", "Improving volume", "Renewable energy sector strength"],
	},
];

export const mockMarketIndices: MarketIndex[] = [
	{ name: "NIFTY 50", value: "24,718.60", change: "+182.45", percentage: "+0.74%", positive: true },
	{ name: "SENSEX", value: "80,567.42", change: "+594.91", percentage: "+0.74%", positive: true },
	{ name: "NIFTY BANK", value: "54,231.80", change: "-124.30", percentage: "-0.23%", positive: false },
	{ name: "NIFTY IT", value: "41,892.25", change: "+386.70", percentage: "+0.93%", positive: true },
];

export const mockMarketGainers: MarketMover[] = [
	{ symbol: "SUZLON", name: "Suzlon Energy", price: "₹52.40", change: "+4.21%" },
	{ symbol: "TATASTEEL", name: "Tata Steel", price: "₹168.25", change: "+3.68%" },
	{ symbol: "ADANIPORTS", name: "Adani Ports", price: "₹1,412.60", change: "+3.24%" },
	{ symbol: "POWERGRID", name: "Power Grid", price: "₹326.15", change: "+2.91%" },
];

export const mockMarketLosers: MarketMover[] = [
	{ symbol: "INFY", name: "Infosys", price: "₹1,482.20", change: "-2.14%" },
	{ symbol: "HCLTECH", name: "HCL Technologies", price: "₹1,534.80", change: "-1.82%" },
	{ symbol: "ICICIBANK", name: "ICICI Bank", price: "₹1,276.45", change: "-1.41%" },
	{ symbol: "AXISBANK", name: "Axis Bank", price: "₹1,091.30", change: "-1.18%" },
];

export const mockSectors: SectorPerformance[] = [
	{ name: "Information Technology", performance: "+1.82%", positive: true },
	{ name: "Renewable Energy", performance: "+1.54%", positive: true },
	{ name: "Automobile", performance: "+0.92%", positive: true },
	{ name: "Banking", performance: "-0.23%", positive: false },
	{ name: "Pharmaceuticals", performance: "-0.61%", positive: false },
	{ name: "Metals", performance: "+0.48%", positive: true },
];

export const mockStockDetail: StockDetailData = {
	stats: [
		{ label: "Open", value: "₹51.20" },
		{ label: "Previous Close", value: "₹51.32" },
		{ label: "Day High", value: "₹53.10" },
		{ label: "Day Low", value: "₹50.74" },
		{ label: "52W High", value: "₹58.65" },
		{ label: "52W Low", value: "₹32.10" },
		{ label: "Market Cap", value: "₹71.4K Cr" },
		{ label: "Volume", value: "8.42 Cr" },
	],
	technicals: [
		{ name: "RSI", value: "58.2", signal: "Neutral", type: "neutral" },
		{ name: "MACD", value: "+1.24", signal: "Bullish", type: "positive" },
		{ name: "50 DMA", value: "₹47.82", signal: "Above", type: "positive" },
		{ name: "200 DMA", value: "₹41.56", signal: "Above", type: "positive" },
	],
	news: [
		{
			source: "Economic Times",
			time: "32 min ago",
			title: "Renewable energy sector attracts renewed investor attention",
			sentiment: "Positive",
		},
		{
			source: "Moneycontrol",
			time: "1 hr ago",
			title: "Wind energy companies remain in focus as capacity additions accelerate",
			sentiment: "Positive",
		},
		{
			source: "Business Standard",
			time: "2 hrs ago",
			title: "Indian renewable energy market sees increasing institutional interest",
			sentiment: "Neutral",
		},
	],
};

export function getMockStock(symbol: string): Stock | undefined {
	const query = symbol.trim().toLowerCase();

	return mockStocks.find(
		(stock) =>
			stock.symbol.toLowerCase() === query ||
			stock.name.toLowerCase() === query,
	);
}
