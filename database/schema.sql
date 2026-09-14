-- FinSight AI database schema (SQLite)
--
-- The running application uses Django migrations as its source of truth:
-- backend/finance/migrations/.  This file is a complete standalone reference
-- schema for the financial domain and can be run with SQLite foreign keys on.

PRAGMA foreign_keys = ON;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT '',
    monthly_income NUMERIC NOT NULL DEFAULT 0 CHECK (monthly_income >= 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE accounts (
    account_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'bank' CHECK (account_type IN ('bank', 'cash', 'wallet', 'credit_card')),
    balance NUMERIC NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, account_name),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    transaction_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    account_id INTEGER,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    transaction_date TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);
CREATE INDEX transactions_user_date_idx ON transactions (user_id, transaction_date);
CREATE INDEX transactions_user_type_idx ON transactions (user_id, transaction_type);

CREATE TABLE budgets (
    budget_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    budget_amount NUMERIC NOT NULL CHECK (budget_amount >= 0),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year BETWEEN 2000 AND 9999),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, category_id, month, year),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

CREATE TABLE savings_goals (
    goal_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    goal_name TEXT NOT NULL,
    target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
    target_date TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE debts (
    debt_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    debt_name TEXT NOT NULL,
    total_amount NUMERIC NOT NULL CHECK (total_amount > 0),
    remaining_amount NUMERIC NOT NULL CHECK (remaining_amount >= 0),
    interest_rate NUMERIC NOT NULL DEFAULT 0 CHECK (interest_rate >= 0),
    monthly_payment NUMERIC NOT NULL DEFAULT 0 CHECK (monthly_payment >= 0),
    due_date TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE investments (
    investment_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    investment_type TEXT NOT NULL,
    investment_name TEXT NOT NULL,
    invested_amount NUMERIC NOT NULL CHECK (invested_amount >= 0),
    current_value NUMERIC NOT NULL DEFAULT 0 CHECK (current_value >= 0),
    investment_date TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE financial_scores (
    score_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    overall_score NUMERIC CHECK (overall_score BETWEEN 0 AND 100),
    spending_score NUMERIC CHECK (spending_score BETWEEN 0 AND 100),
    savings_score NUMERIC CHECK (savings_score BETWEEN 0 AND 100),
    debt_score NUMERIC CHECK (debt_score BETWEEN 0 AND 100),
    investment_score NUMERIC CHECK (investment_score BETWEEN 0 AND 100),
    calculated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE ai_recommendations (
    recommendation_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    recommendation_type TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_dismissed INTEGER NOT NULL DEFAULT 0 CHECK (is_dismissed IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
