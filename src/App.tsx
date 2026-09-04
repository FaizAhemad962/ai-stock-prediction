import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { WatchlistProvider } from "./components/WatchlistContext/WatchlistContext";
import { AppErrorBoundary } from "./components/ui/AppErrorBoundary";

import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Markets } from "./pages/Markets/Markets";
import { Watchlist } from "./pages/Watchlist/Watchlist";
import { Portfolio } from "./pages/Portfolio/Portfolio";
import { AIInsights } from "./pages/AIInsights/AIInsights";
import { News } from "./pages/News/News";
import { Settings } from "./pages/Settings/Settings";
import { StockDetails } from "./pages/StockDetails/StockDetails";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { ProductTour } from "./components/ProductTour/ProductTour";


function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <WatchlistProvider>
          <ProductTour />
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/news" element={<News />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stock/:symbol" element={<StockDetails />} />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Route>
          </Routes>
        </WatchlistProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
  