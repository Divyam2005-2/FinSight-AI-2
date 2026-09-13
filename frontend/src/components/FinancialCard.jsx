import "../styles/FinancialCard.css";

function FinancialCard({ title, value }) {
  return (
    <div className="financial-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default FinancialCard;