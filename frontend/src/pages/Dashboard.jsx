
import { useMemo } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { useNavigate } from "react-router-dom";

import FinancialCard from "../components/FinancialCard";
import { useFinancial } from "../context/FinancialContext";

function Dashboard() {
  const navigate = useNavigate();

  const {
    transactions,
    income,
    expenses,
    savings,
    debt,
    budget,
    savingsRate,
    financialScore,
    scoreLabel,
  } = useFinancial();

  /* ================================
     SPENDING BY CATEGORY
  ================================= */

  const categoryData = useMemo(() => {
    const categories = {};

    transactions
      .filter(
        (transaction) => transaction.type === "expense"
      )
      .forEach((transaction) => {
        const category =
          transaction.category || "General";

        categories[category] =
          (categories[category] || 0) +
          Number(transaction.amount);
      });

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  /* ================================
     CASH FLOW TREND
  ================================= */

  const cashFlowData = useMemo(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    let runningIncome = 0;
    let runningExpenses = 0;

    const dateGroups = {};

    sortedTransactions.forEach((transaction) => {
      const date = transaction.date;

      if (!dateGroups[date]) {
        dateGroups[date] = {
          income: 0,
          expenses: 0,
        };
      }

      if (transaction.type === "income") {
        dateGroups[date].income += Number(
          transaction.amount
        );
      } else {
        dateGroups[date].expenses += Number(
          transaction.amount
        );
      }
    });

    return Object.entries(dateGroups).map(
      ([date, values]) => {
        runningIncome += values.income;
        runningExpenses += values.expenses;

        return {
          date,
          income: runningIncome,
          expenses: runningExpenses,
          savings:
            runningIncome - runningExpenses,
        };
      }
    );
  }, [transactions]);

  /* ================================
     BUDGET
  ================================= */

  const budgetPercentage =
    budget > 0
      ? Math.round((expenses / budget) * 100)
      : 0;

  const safeBudgetPercentage = Math.min(
    budgetPercentage,
    100
  );

  /* ================================
     FINANCIAL ALERTS
  ================================= */

  const alerts = [];

  if (budgetPercentage >= 100) {
    alerts.push({
      type: "danger",
      title: "Budget exceeded",
      text:
        "Your expenses have crossed your monthly budget.",
    });
  } else if (budgetPercentage >= 80) {
    alerts.push({
      type: "warning",
      title: "Budget warning",
      text:
        "You are getting close to your monthly spending limit.",
    });
  }

  if (savingsRate < 10 && income > 0) {
    alerts.push({
      type: "warning",
      title: "Low savings rate",
      text:
        "Consider increasing the amount you save each month.",
    });
  }

  if (debt > savings && debt > 0) {
    alerts.push({
      type: "info",
      title: "Debt is higher than savings",
      text:
        "Focus on improving your financial buffer and managing debt.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      title: "Finances look healthy",
      text:
        "No major financial alerts based on your current data.",
    });
  }

  /* ================================
     AI INSIGHT
  ================================= */

  const getInsight = () => {
    if (expenses > income && income > 0) {
      return "Your expenses are currently higher than your income. Review your largest spending categories first.";
    }

    if (budgetPercentage >= 80) {
      return "You are approaching your budget limit. Consider reducing non-essential spending for the rest of the month.";
    }

    if (savingsRate >= 30) {
      return "Your savings rate is strong. Maintaining this level can help build a solid financial foundation.";
    }

    if (savingsRate >= 15) {
      return "Your savings are moving in a positive direction. Try to gradually increase your monthly savings.";
    }

    return "Start by tracking your spending consistently and building a regular savings habit.";
  };

  const recentTransactions = transactions.slice(0, 5);

  /* ================================
     PIE CHART COLORS
  ================================= */

  const pieColors = [
    "#4285F4",
    "#34A853",
    "#FBBC04",
    "#EA4335",
    "#8B5CF6",
    "#EC4899",
    "#00ACC1",
    "#FF7043",
    "#7CB342",
  ];

  return (
    <main className="page dashboard-page">

      {/* ================================
          HEADER
      ================================= */}

      <section className="dashboard-header">
        <div>
          <p className="eyebrow">
            YOUR FINANCIAL SPACE
          </p>

          <h1>Good to see you.</h1>

          <p className="dashboard-subtitle">
            Here's a clear view of where your money stands today.
          </p>
        </div>

        <div className="score-pill">
          <span>Financial Score</span>

          <strong>{financialScore}</strong>

          <small>/100</small>
        </div>
      </section>


      {/* ================================
          AI PROMPT
      ================================= */}

      <section className="ai-prompt-card">

        <div className="ai-prompt-icon">
          ✦
        </div>

        <div className="ai-prompt-content">

          <span>FinSight AI</span>

          <h2>
            What would you like to understand about your finances?
          </h2>

          <div
            className="prompt-input"
            onClick={() => navigate("/advisor")}
          >
            <span>
              Ask about spending, savings, budgeting...
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/advisor");
              }}
            >
              →
            </button>
          </div>

        </div>

      </section>


      {/* ================================
          FINANCIAL OVERVIEW
      ================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>Financial overview</h2>

            <p>
              Your current financial position.
            </p>
          </div>

        </div>

        <div className="financial-grid">

          <FinancialCard
            title="Income"
            value={`₹${income.toLocaleString("en-IN")}`}
          />

          <FinancialCard
            title="Expenses"
            value={`₹${expenses.toLocaleString("en-IN")}`}
          />

          <FinancialCard
            title="Savings"
            value={`₹${savings.toLocaleString("en-IN")}`}
          />

          <FinancialCard
            title="Debt"
            value={`₹${debt.toLocaleString("en-IN")}`}
          />

        </div>

      </section>


      {/* ================================
          MONEY FLOW
      ================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>Money flow</h2>

            <p>
              Track your income, expenses and savings over time.
            </p>
          </div>

        </div>

        <div className="analytics-card money-flow-card">

          {cashFlowData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <LineChart
                data={cashFlowData}
                margin={{
                  top: 15,
                  right: 25,
                  left: 10,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Tooltip
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08)",
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={35}
                  iconType="circle"
                />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#34A853"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#34A853",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#EA4335"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#EA4335",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#4285F4"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#4285F4",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <div className="empty-state">
              Add transactions to see your cash flow.
            </div>

          )}

        </div>

      </section>


      {/* ================================
          FINANCIAL HEALTH
      ================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>Financial health</h2>

            <p>
              Based on your current financial data.
            </p>
          </div>

          <span className="small-stat">
            {scoreLabel}
          </span>

        </div>

        <div className="health-card">

          <div className="health-score">
            {financialScore}
          </div>

          <div className="health-info">

            <h3>
              {scoreLabel} financial health
            </h3>

            <p>
              {financialScore >= 80
                ? "Your financial position is looking strong."
                : financialScore >= 65
                ? "You're on a good path. Keep improving your savings."
                : financialScore >= 50
                ? "There is room to improve your financial health."
                : "Your finances need attention. Start by reviewing expenses."}
            </p>

            <div className="health-metrics">

              <div>
                <span>Savings rate</span>

                <strong>
                  {Math.round(savingsRate)}%
                </strong>
              </div>

              <div>
                <span>Debt</span>

                <strong>
                  ₹{debt.toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Budget used</span>

                <strong>
                  {budgetPercentage}%
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          BUDGET
      ================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>Monthly budget</h2>

            <p>
              Track how much of your budget you've used.
            </p>
          </div>

          <span className="small-stat">
            {budgetPercentage}%
          </span>

        </div>

        <div className="dashboard-budget-card">

          <div className="dashboard-budget-top">

            <div>
              <span>Spent</span>

              <strong>
                ₹{expenses.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Budget</span>

              <strong>
                ₹{budget.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          <div className="dashboard-budget-track">

            <div
              className="dashboard-budget-fill"
              style={{
                width: `${safeBudgetPercentage}%`,
              }}
            />

          </div>

          <p>
            {budgetPercentage >= 100
              ? "You have exceeded your current budget."
              : `₹${Math.max(
                  budget - expenses,
                  0
                ).toLocaleString("en-IN")} remaining this month.`}
          </p>

        </div>

      </section>


      {/* ================================
          SPENDING OVERVIEW
      ================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>Spending overview</h2>

            <p>
              Where your money is going.
            </p>
          </div>

          <span className="small-stat">
            {Math.round(savingsRate)}% savings rate
          </span>

        </div>

        <div className="analytics-layout">

          <div className="analytics-card chart-card">

            {categoryData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={330}
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={120}
                    paddingAngle={3}
                  >

                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            pieColors[
                              index %
                                pieColors.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString("en-IN")}`
                    }
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="empty-state">
                No spending data yet.
              </div>

            )}

          </div>


          <div className="category-card">

            <h3>
              Spending categories
            </h3>

            <div className="category-list">

              {categoryData.map(
                (category) => {

                  const percentage =
                    expenses > 0
                      ? (category.value / expenses) *
                        100
                      : 0;

                  return (
                    <div
                      className="category-item"
                      key={category.name}
                    >

                      <div className="category-info">

                        <span>
                          {category.name}
                        </span>

                        <strong>
                          ₹
                          {category.value.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      <div className="category-progress">

                        <div
                          className="category-progress-bar"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <small>
                        {Math.round(
                          percentage
                        )}
                        % of expenses
                      </small>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          ALERTS + AI INSIGHT
      ================================= */}

      <section className="dashboard-section">

        <div className="dashboard-insight-grid">

          <div className="dashboard-alert-card">

            <div className="insight-heading">

              <span>⚡</span>

              <div>
                <h2>Financial alerts</h2>

                <p>
                  Things worth paying attention to.
                </p>
              </div>

            </div>

            <div className="alert-list">

              {alerts.map(
                (alert, index) => (
                  <div
                    className={`dashboard-alert ${alert.type}`}
                    key={index}
                  >

                    <strong>
                      {alert.title}
                    </strong>

                    <span>
                      {alert.text}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>


          <div className="dashboard-ai-card">

            <div className="insight-heading">

              <span>✦</span>

              <div>
                <h2>FinSight insight</h2>

                <p>
                  Personalized analysis of your current data.
                </p>
              </div>

            </div>

            <div className="ai-insight-content">

              <p>
                {getInsight()}
              </p>

              <button
                onClick={() =>
                  navigate("/advisor")
                }
              >
                Ask AI Advisor →
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          RECENT ACTIVITY
      ================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>Recent activity</h2>

            <p>
              Your latest financial activity.
            </p>
          </div>

          <button
            className="dashboard-link-button"
            onClick={() =>
              navigate("/transactions")
            }
          >
            View all →
          </button>

        </div>

        <div className="activity-list">

          {recentTransactions.length === 0 ? (

            <div className="empty-state">
              No transactions yet.
            </div>

          ) : (

            recentTransactions.map(
              (transaction) => (

                <div
                  className="activity"
                  key={transaction.id}
                >

                  <div className="activity-left">

                    <div className="activity-icon">
                      {transaction.type === "income"
                        ? "+"
                        : "−"}
                    </div>

                    <div>

                      <strong>
                        {transaction.title}
                      </strong>

                      <span>
                        {transaction.category}

                        {transaction.date
                          ? ` • ${transaction.date}`
                          : ""}
                      </span>

                    </div>

                  </div>

                  <strong
                    className={
                      transaction.type === "income"
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    {transaction.type === "income"
                      ? "+"
                      : "−"}{" "}
                    ₹
                    {Number(
                      transaction.amount
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

              )
            )

          )}

        </div>

      </section>

    </main>
  );
}

export default Dashboard;

