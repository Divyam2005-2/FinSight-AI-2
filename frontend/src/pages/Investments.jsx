import { useFinancial } from "../context/FinancialContext";

function Investments() {
  const {
    savings,
    debt,
    financialScore,
    savingsRate,
  } = useFinancial();

  const investmentOptions = [
    {
      name: "Emergency Fund",
      risk: "Low Risk",
      category: "Savings",
      description:
        "Build an emergency reserve before taking higher-risk investment decisions.",
    },
    {
      name: "Fixed Deposits",
      risk: "Low Risk",
      category: "Fixed Income",
      description:
        "A relatively stable option for people looking for predictable returns.",
    },
    {
      name: "Index Funds",
      risk: "Medium Risk",
      category: "Market",
      description:
        "A diversified market-based option generally considered for long-term goals.",
    },
    {
      name: "Mutual Funds",
      risk: "Medium Risk",
      category: "Market",
      description:
        "Professionally managed investment funds with different risk levels and objectives.",
    },
  ];

  const getRecommendation = () => {
    if (debt > savings && debt > 0) {
      return {
        title: "Focus on financial stability first",
        text: "Your recorded debt is higher than your current savings. Consider building an emergency reserve and managing debt before taking significant investment risk.",
      };
    }

    if (savingsRate < 10) {
      return {
        title: "Build your savings first",
        text: "Your current savings rate is relatively low. Strengthening your monthly savings can give you a stronger foundation before investing.",
      };
    }

    if (financialScore >= 75) {
      return {
        title: "You may be ready to explore",
        text: "Your current financial indicators are relatively strong. You can explore different investment categories while considering your goals and risk tolerance.",
      };
    }

    return {
      title: "Strengthen your financial foundation",
      text: "Continue improving your savings and managing expenses before taking larger investment decisions.",
    };
  };

  const recommendation =
    getRecommendation();

  return (
    <main className="page">

      <div className="page-header">

        <div>
          <h1>
            Investment Planning
          </h1>

          <p>
            Explore investment categories
            based on your financial profile.
          </p>
        </div>

      </div>

      <section className="investment-notice">

        <h3>
          FinSight Recommendation
        </h3>

        <strong>
          {recommendation.title}
        </strong>

        <p>
          {recommendation.text}
        </p>

      </section>

      <section className="investment-section">

        <div className="section-heading">

          <div>
            <h2>
              Investment Categories
            </h2>

            <p>
              Educational information based
              on different risk levels.
            </p>
          </div>

        </div>

        <div className="investment-grid">

          {investmentOptions.map(
            (option) => (

              <div
                className="investment-card"
                key={option.name}
              >

                <div className="investment-top">

                  <span className="investment-category">
                    {option.category}
                  </span>

                  <span
                    className={`risk-label ${
                      option.risk ===
                      "Low Risk"
                        ? "low-risk"
                        : "medium-risk"
                    }`}
                  >
                    {option.risk}
                  </span>

                </div>

                <h2>
                  {option.name}
                </h2>

                <p>
                  {option.description}
                </p>

                <button
                  onClick={() =>
                    alert(
                      `${option.name}: This section will later connect to FinSight's investment recommendation engine.`
                    )
                  }
                >
                  Explore
                </button>

              </div>

            )
          )}

        </div>

      </section>

    </main>
  );
}

export default Investments;