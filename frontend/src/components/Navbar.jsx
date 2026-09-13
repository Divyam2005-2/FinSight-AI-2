import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav>
      <h2>FinSight AI</h2>

      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/budget">Budget</Link>
        <Link to="/advisor">AI Advisor</Link>
        <Link to="/investments">Investments</Link>
      </div>
    </nav>
  );
}

export default Navbar;