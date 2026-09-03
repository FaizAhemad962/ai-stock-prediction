export type Market = "NSE" | "BSE";

export type Signal = "Bullish" | "Positive" | "Neutral" | "Caution" | "Bearish";

export type Stock = {
	symbol: string;
	name: string;
	market: Market;
	sector: string;
	price: number;
	change: number;
	changePercent: number;
	currency: string;
	marketCap?: number;
	volume?: number;
};

export type PricePoint = {
	timestamp: string;
	price: number;
	volume?: number;
};

export type TechnicalIndicator = {
	label: string;
	value: string;
	status: string;
	signal: Signal;
};

export type MarketIndex = {
	name: string;
	value: string;
	change: string;
	percentage: string;
	positive: boolean;
};

export type MarketMover = {
	symbol: string;
	name: string;
	price: string;
	change: string;
};

export type SectorPerformance = {
	name: string;
	performance: string;
	positive: boolean;
};

export type StockStatistic = {
	label: string;
	value: string;
};

export type StockDetailNews = {
	source: string;
	time: string;
	title: string;
	sentiment: "Positive" | "Neutral" | "Negative";
};

export type StockDetailData = {
	stats: StockStatistic[];
	technicals: Array<{
		name: string;
		value: string;
		signal: string;
		type: "neutral" | "positive" | "negative";
	}>;
	news: StockDetailNews[];
};

export type NewsArticle = {
	id: string;
	title: string;
	source: string;
	publishedAt: string;
	symbol?: string;
	sentiment: "Positive" | "Neutral" | "Negative";
	url?: string;
};

export type NewsFeedItem = NewsArticle & {
	category: string;
	summary: string;
	impact: "High" | "Medium" | "Low";
	stocks: string[];
};

export type PortfolioHolding = {
	symbol: string;
	quantity: number;
	averagePrice: number;
	currentPrice: number;
};

export type Prediction = {
	symbol: string;
	outlook: Signal;
	confidence: number;
	summary: string;
	factors: string[];
};
