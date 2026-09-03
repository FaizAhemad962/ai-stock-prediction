import { useEffect, useState, type PropsWithChildren } from "react";
import { WatchlistContext } from "./context";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../../services/api";

export function WatchlistProvider({ children }: PropsWithChildren) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWatchlist()
      .then(setSymbols)
      .finally(() => setIsLoading(false));
  }, []);

  const isWatched = (symbol: string) => symbols.includes(symbol.toUpperCase());

  const toggleWatchlist = (symbol: string) => {
    const normalizedSymbol = symbol.toUpperCase();

    const request = symbols.includes(normalizedSymbol)
      ? removeFromWatchlist(normalizedSymbol)
      : addToWatchlist(normalizedSymbol);

    request.then(setSymbols);
  };

  return (
    <WatchlistContext.Provider value={{ symbols, isLoading, isWatched, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}
