import { useMemo, useState } from "react";
import { useFinancial } from "../context/FinancialContext";

function Transactions() {
  const {
    transactions,
    setTransactions,
  } = useFinancial();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("General");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [editingId, setEditingId] = useState(null);

  const addTransaction = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter a valid title and amount.");
      return;
    }

    if (editingId !== null) {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                title: title.trim(),
                amount: Number(amount),
                type,
                category,
              }
            : transaction
        )
      );

      cancelEdit();
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title: title.trim(),
      category,
      amount: Number(amount),
      type,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions([
      newTransaction,
      ...transactions,
    ]);

    resetForm();
  };

  const deleteTransaction = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    setTransactions(
      transactions.filter(
        (transaction) => transaction.id !== id
      )
    );

    if (editingId === id) {
      cancelEdit();
    }
  };

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("General");
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        filterType === "all" ||
        transaction.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, filterType]);

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            Add and manage your income and expenses.
          </p>
        </div>
      </div>

      {/* ADD / EDIT TRANSACTION */}

      <section className="form-card">
        <div className="transaction-form-header">
          <div>
            <h2>
              {editingId !== null
                ? "Edit Transaction"
                : "Add Transaction"}
            </h2>

            <p>
              {editingId !== null
                ? "Update the details of this transaction."
                : "Record your income or expenses."}
            </p>
          </div>

          {editingId !== null && (
            <button
              type="button"
              className="cancel-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={addTransaction}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="e.g. Groceries"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option>General</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Entertainment</option>
                <option>Education</option>
                <option>Health</option>
                <option>Investment</option>
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>
              </select>
            </div>
          </div>

          <button type="submit">
            {editingId !== null
              ? "Update Transaction"
              : "Add Transaction"}
          </button>
        </form>
      </section>

      {/* TRANSACTION HISTORY */}

      <section className="table-card">
        <div className="transaction-history-header">
          <div>
            <h2>Transaction History</h2>

            <p>
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1
                ? "s"
                : ""}{" "}
              shown
            </p>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="transaction-controls">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value)
            }
          >
            <option value="all">
              All Transactions
            </option>

            <option value="income">
              Income Only
            </option>

            <option value="expense">
              Expenses Only
            </option>
          </select>
        </div>

        {/* LIST */}

        <div className="transaction-list">
          {filteredTransactions.length === 0 ? (
            <div className="transaction-empty">
              <h3>No transactions found</h3>

              <p>
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            filteredTransactions.map(
              (transaction) => (
                <div
                  className="transaction-item"
                  key={transaction.id}
                >
                  <div className="transaction-main">
                    <div
                      className={`transaction-icon ${
                        transaction.type === "income"
                          ? "transaction-income"
                          : "transaction-expense"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "−"}
                    </div>

                    <div>
                      <h3>
                        {transaction.title}
                      </h3>

                      <p>
                        {transaction.category}

                        {transaction.date
                          ? ` • ${transaction.date}`
                          : ""}
                      </p>
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

                  <div className="transaction-actions">
                    <button
                      className="edit-button"
                      onClick={() =>
                        startEdit(transaction)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTransaction(
                          transaction.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default Transactions;