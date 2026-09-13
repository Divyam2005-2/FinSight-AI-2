
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { FinancialProvider } from "./context/FinancialContext";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Advisor from "./pages/Advisor";
import Investments from "./pages/Investments";

import "./styles/App.css";
import "./styles/Form.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("finsight_theme") === "dark";
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem(
      "finsight_theme",
      darkMode ? "dark" : "light"
    );

    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );
  }, [darkMode]);

  return (
    <FinancialProvider>
      <BrowserRouter>

        {/* SIDEBAR */}
        <Sidebar sidebarOpen={sidebarOpen} />

        {/* MAIN CONTENT */}
        <div
          className={`main-content ${
            sidebarOpen
              ? "sidebar-visible"
              : "sidebar-hidden"
          }`}
        >

          {/* TOP LEFT NAVIGATION BUTTON */}
          <div className="navigation-control">
            <button
              className="top-control-button"
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              title={
                sidebarOpen
                  ? "Hide navigation"
                  : "Show navigation"
              }
            >
              {sidebarOpen ? "←" : "☰"}
            </button>
          </div>

          {/* TOP RIGHT THEME BUTTON */}
          <div className="theme-control">
            <button
              className="top-control-button"
              onClick={() =>
                setDarkMode(!darkMode)
              }
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {darkMode ? "☀" : "☾"}
            </button>
          </div>

          {/* PAGE ROUTES */}
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/budget"
              element={<Budget />}
            />

            <Route
              path="/advisor"
              element={<Advisor />}
            />

            <Route
              path="/investments"
              element={<Investments />}
            />
          </Routes>

        </div>

      </BrowserRouter>
    </FinancialProvider>
  );
}

export default App;

