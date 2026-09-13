import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FinancialContext = createContext();

const defaultTransactions = [
  {
    id: 1,
    title: "Salary",
    category: "Income",
    amount: 50000,
    type: "income",
    date: "2026-09-01",
  },
  {
    id: 2,
    title: "Groceries",
    category: "Food",
    amount: 1200,
    type: "expense",
    date: "2026-09-03",
  },
  {
    id: 3,
    title: "Transport",
    category: "Travel",
    amount: 2000,
    type: "expense",
    date: "2026-09-05",
  },
  {
    id: 4,
    title: "Online Shopping",
    category: "Shopping",
    amount: 3500,
    type: "expense",
    date: "2026-09-07",
  },
];

export function FinancialProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("finsight_transactions");

    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("finsight_budget");

    return saved ? Number(saved) : 30000;
  });

  const [debt, setDebt] = useState(() => {
    const saved = localStorage.getItem("finsight_debt");

    return saved ? Number(saved) : 5000;
  });

  useEffect(() => {
    localStorage.setItem(
      "finsight_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("finsight_budget", budget);
  }, [budget]);

  useEffect(() => {
    localStorage.setItem("finsight_debt", debt);
  }, [debt]);

  const income = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  }, [transactions]);

  const expenses = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  }, [transactions]);

  const savings = income - expenses;

  const savingsRate =
    income > 0 ? (savings / income) * 100 : 0;

  const expenseRate =
    income > 0 ? (expenses / income) * 100 : 0;

  const debtRate =
    income > 0 ? (debt / income) * 100 : 0;

  const financialScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        50 +
          savingsRate * 0.8 -
          expenseRate * 0.25 -
          debtRate * 0.5
      )
    )
  );

  const scoreLabel =
    financialScore >= 80
      ? "Excellent"
      : financialScore >= 65
      ? "Good"
      : financialScore >= 50
      ? "Fair"
      : "Needs Attention";

  return (
    <FinancialContext.Provider
      value={{
        transactions,
        setTransactions,

        budget,
        setBudget,

        debt,
        setDebt,

        income,
        expenses,
        savings,

        savingsRate,
        expenseRate,
        debtRate,

        financialScore,
        scoreLabel,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  return useContext(FinancialContext);
}