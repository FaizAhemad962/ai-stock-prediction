import { createContext } from "react";

export type WatchlistContextValue = {
  symbols: string[];
  isLoading: boolean;
  isWatched: (symbol: string) => boolean;
  toggleWatchlist: (symbol: string) => void;
};

export const WatchlistContext = createContext<WatchlistContextValue | undefined>(
  undefined,
);
