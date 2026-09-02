import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout/MainLayout";

import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Markets } from "./pages/Markets/Markets";
import { Watchlist } from "./pages/Watchlist/Watchlist";
import { Portfolio } from "./pages/Portfolio/Portfolio";
import { AIInsights } from "./pages/AIInsights/AIInsights";
import { News } from "./pages/News/News";
import { Settings } from "./pages/Settings/Settings";
import { StockDetails } from "./pages/StockDetails/StockDetails";


function App() {
  return (
    <BrowserRouter>
      <Routes>
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
    </BrowserRouter>
  );
}

export default App;
  