import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ sidebarOpen }) {
  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* BRAND */}

      <div className="sidebar-brand">
        <div className="brand-icon">✦</div>

        <span>FinSight AI</span>
      </div>

      {/* NAVIGATION */}

      <nav className="sidebar-nav">

        <NavLink to="/" end>
          <span>⌂</span>
          <label>Dashboard</label>
        </NavLink>

        <NavLink to="/transactions">
          <span>↕</span>
          <label>Transactions</label>
        </NavLink>

        <NavLink to="/budget">
          <span>◫</span>
          <label>Budget</label>
        </NavLink>

        <NavLink to="/investments">
          <span>◈</span>
          <label>Investments</label>
        </NavLink>

        <NavLink to="/advisor">
          <span>✦</span>
          <label>AI Advisor</label>
        </NavLink>

      </nav>

      {/* AI STATUS */}

      <div className="sidebar-bottom">

        <div className="ai-status">

          <div className="status-dot"></div>

          <div className="ai-status-text">
            <strong>FinSight AI</strong>

            <span>
              Financial assistant
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;