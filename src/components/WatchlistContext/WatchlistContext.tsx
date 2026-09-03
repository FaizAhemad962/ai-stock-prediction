import { useState, type PropsWithChildren } from "react";
import { WatchlistContext } from "./context";

const initialSymbols = [
  "SUZLON",
  "RELIANCE",
  "TCS",
  "INFY",
  "TATASTEEL",
  "HDFCBANK",
];

export function WatchlistProvider({ children }: PropsWithChildren) {
  const [symbols, setSymbols] = useState(initialSymbols);

  const isWatched = (symbol: string) => symbols.includes(symbol.toUpperCase());

  const toggleWatchlist = (symbol: string) => {
    const normalizedSymbol = symbol.toUpperCase();

    setSymbols((current) =>
      current.includes(normalizedSymbol)
        ? current.filter((currentSymbol) => currentSymbol !== normalizedSymbol)
        : [...current, normalizedSymbol],
    );
  };

  return (
    <WatchlistContext.Provider value={{ symbols, isWatched, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}
