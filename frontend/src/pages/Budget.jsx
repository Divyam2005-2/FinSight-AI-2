import { useFinancial } from "../context/FinancialContext";

function Budget() {
  const {
    budget,
    setBudget,
    expenses,
  } = useFinancial();

  const remaining = budget - expenses;

  const percentage =
    budget > 0
      ? (expenses / budget) * 100
      : 0;

  const safePercentage = Math.min(
    percentage,
    100
  );

  const getStatus = () => {
    if (percentage >= 100) {
      return {
        title: "Budget exceeded",
        text: "Your expenses have gone beyond your monthly budget.",
        className: "budget-danger",
      };
    }

    if (percentage >= 80) {
      return {
        title: "Approaching your limit",
        text: "You are using most of your monthly budget.",
        className: "budget-warning",
      };
    }

    return {
      title: "Budget on track",
      text: "Your spending is currently within your budget.",
      className: "budget-good",
    };
  };

  const status = getStatus();

  return (
    <main className="page">

      <div className="page-header">
        <div>
          <h1>Budget</h1>
          <p>
            Set and monitor your monthly spending limit.
          </p>
        </div>
      </div>

      <section className="form-card">

        <h2>Monthly Budget</h2>

        <div className="form-group">

          <label>
            Spending Limit
          </label>

          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) =>
              setBudget(
                Math.max(
                  0,
                  Number(e.target.value)
                )
              )
            }
          />

        </div>

      </section>

      <section className="budget-card">

        <div className="budget-header">

          <div>
            <h2>Budget Usage</h2>

            <p>
              ₹
              {expenses.toLocaleString(
                "en-IN"
              )}{" "}
              spent of ₹
              {budget.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <strong>
            {Math.round(
              percentage
            )}
            %
          </strong>

        </div>

        <div className="progress-container">

          <div
            className="progress-bar"
            style={{
              width: `${safePercentage}%`,
            }}
          />

        </div>

        <div
          className={`budget-status ${status.className}`}
        >
          <strong>
            {status.title}
          </strong>

          <span>
            {status.text}
          </span>
        </div>

        <div className="budget-summary">

          <div>
            <span>Total Budget</span>

            <strong>
              ₹
              {budget.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>Spent</span>

            <strong>
              ₹
              {expenses.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>
              {remaining >= 0
                ? "Remaining"
                : "Over Budget"}
            </span>

            <strong>
              ₹
              {Math.abs(
                remaining
              ).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Budget;