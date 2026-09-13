import { useState } from "react";
import { useFinancial } from "../context/FinancialContext";

function Advisor() {
  const {
    transactions,
    income,
    expenses,
    savings,
    debt,
    savingsRate,
    financialScore,
    scoreLabel,
  } = useFinancial();

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const getCategorySpending = () => {
    const categories = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .forEach((transaction) => {
        categories[transaction.category] =
          (categories[
            transaction.category
          ] || 0) +
          Number(transaction.amount);
      });

    return categories;
  };

  const getLargestCategory = () => {
    const categories =
      getCategorySpending();

    const entries =
      Object.entries(categories);

    if (entries.length === 0) {
      return null;
    }

    return entries.sort(
      (a, b) => b[1] - a[1]
    )[0];
  };

  const generateResponse = (
    userQuestion
  ) => {
    const text =
      userQuestion.toLowerCase();

    const categories =
      getCategorySpending();

    const largestCategory =
      getLargestCategory();

    if (
      text.includes("income") ||
      text.includes("earn") ||
      text.includes("salary")
    ) {
      return `Your recorded income is ₹${income.toLocaleString(
        "en-IN"
      )}.`;
    }

    if (
      text.includes("expense") ||
      text.includes("spend") ||
      text.includes("spent")
    ) {
      if (largestCategory) {
        return `You've recorded ₹${expenses.toLocaleString(
          "en-IN"
        )} in total expenses. Your largest spending category is ${largestCategory[0]} at ₹${largestCategory[1].toLocaleString(
          "en-IN"
        )}.`;
      }

      return `You've recorded ₹${expenses.toLocaleString(
        "en-IN"
      )} in total expenses.`;
    }

    if (
      text.includes("save") ||
      text.includes("saving")
    ) {
      return `You currently have ₹${savings.toLocaleString(
        "en-IN"
      )} in savings. Your savings rate is approximately ${Math.round(
        savingsRate
      )}%.`;
    }

    if (text.includes("debt")) {
      return `Your recorded debt is ₹${debt.toLocaleString(
        "en-IN"
      )}. Reducing debt while maintaining regular savings can strengthen your financial position.`;
    }

    if (
      text.includes("score") ||
      text.includes("financial health") ||
      text.includes("health")
    ) {
      return `Your current FinSight financial score is ${financialScore}/100, which is classified as ${scoreLabel}. The score considers your income, expenses, savings and debt.`;
    }

    if (
      text.includes("largest") ||
      text.includes("most") ||
      text.includes("where")
    ) {
      if (largestCategory) {
        return `Your largest expense category is ${largestCategory[0]}, where you've spent ₹${largestCategory[1].toLocaleString(
          "en-IN"
        )}.`;
      }

      return "You don't have enough expense data yet to identify your largest spending category.";
    }

    if (
      text.includes("improve") ||
      text.includes("better") ||
      text.includes("save more")
    ) {
      if (largestCategory) {
        return `Your current savings rate is ${Math.round(
          savingsRate
        )}%. A useful starting point would be reviewing your ${largestCategory[0]} spending, since it is currently your largest expense category.`;
      }

      return `Your current savings rate is ${Math.round(
        savingsRate
      )}%. Start by tracking your expenses consistently and setting a realistic monthly budget.`;
    }

    if (
      text.includes("budget")
    ) {
      return "You can manage your monthly spending limit from the Budget section. FinSight can then compare your actual expenses with that limit.";
    }

    if (
      text.includes("investment") ||
      text.includes("invest")
    ) {
      return "Before investing, focus on maintaining an emergency fund, controlling high-interest debt and understanding your risk tolerance. The Investments section contains educational categories to explore.";
    }

    return `Based on your current data, you have ₹${savings.toLocaleString(
      "en-IN"
    )} in savings and a financial score of ${financialScore}/100. As the backend and AI model are connected, FinSight will be able to provide deeper personalized analysis.`;
  };

  const askQuestion = (text) => {
    if (!text.trim()) return;

    const answer =
      generateResponse(text);

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: text.trim(),
      },
      {
        type: "ai",
        text: answer,
      },
    ]);

    setQuestion("");
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <main className="advisor-page">

      <div className="advisor-topbar">

        <div className="advisor-brand">

          <div className="advisor-brand-icon">
            ✦
          </div>

          <div>
            <strong>
              FinSight
            </strong>

            <span>
              AI Advisor
            </span>
          </div>

        </div>

        {messages.length > 0 && (
          <button
            className="new-chat-button"
            onClick={clearChat}
          >
            New chat
          </button>
        )}

      </div>

      <div className="advisor-content">

        {messages.length === 0 ? (

          <div className="advisor-welcome">

            <div className="welcome-icon">
              ✦
            </div>

            <h1>
              How can I help with
              <br />
              your finances?
            </h1>

            <p>
              Ask questions about your
              spending, savings, debt or
              financial health.
            </p>

            <div className="suggestion-grid">

              <button
                onClick={() =>
                  askQuestion(
                    "Where am I spending the most?"
                  )
                }
              >
                <strong>
                  Analyze my spending
                </strong>

                <span>
                  Where is most of my money going?
                </span>
              </button>

              <button
                onClick={() =>
                  askQuestion(
                    "How can I improve my savings?"
                  )
                }
              >
                <strong>
                  Improve my savings
                </strong>

                <span>
                  How can I save more money?
                </span>
              </button>

              <button
                onClick={() =>
                  askQuestion(
                    "What is my financial score?"
                  )
                }
              >
                <strong>
                  Check my financial health
                </strong>

                <span>
                  How am I doing financially?
                </span>
              </button>

              <button
                onClick={() =>
                  askQuestion(
                    "How much debt do I have?"
                  )
                }
              >
                <strong>
                  Understand my debt
                </strong>

                <span>
                  Give me an overview of my debt.
                </span>
              </button>

            </div>

          </div>

        ) : (

          <div className="conversation">

            {messages.map(
              (message, index) => (

                <div
                  className={`conversation-message ${
                    message.type === "user"
                      ? "conversation-user"
                      : "conversation-ai"
                  }`}
                  key={index}
                >

                  {message.type ===
                    "ai" && (
                    <div className="conversation-icon">
                      ✦
                    </div>
                  )}

                  <div className="conversation-text">
                    {message.text}
                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <div className="advisor-composer">

        <div className="composer-box">

          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion(question);
              }
            }}
            placeholder="Ask FinSight anything..."
          />

          <button
            onClick={() =>
              askQuestion(question)
            }
            disabled={!question.trim()}
          >
            ↑
          </button>

        </div>

        <p>
          FinSight provides financial
          information for educational purposes.
        </p>

      </div>

    </main>
  );
}

export default Advisor;