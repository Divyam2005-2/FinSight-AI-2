-- FinSight AI standalone sample data for schema.sql
-- Password values are placeholders. Use Django's seed_data command for the app.

PRAGMA foreign_keys = ON;

INSERT INTO users (user_id, username, email, password_hash, display_name, monthly_income)
VALUES (1, 'demo', 'demo@finsight.local', 'django-managed-password', 'Demo User', 75000.00);

INSERT INTO categories (category_id, name) VALUES
    (1, 'Salary'), (2, 'Food'), (3, 'Shopping'), (4, 'Transport'),
    (5, 'Bills'), (6, 'Entertainment'), (7, 'Healthcare'),
    (8, 'Education'), (9, 'Investment'), (10, 'Other');

INSERT INTO accounts (account_id, user_id, account_name, account_type, balance) VALUES
    (1, 1, 'Primary Bank Account', 'bank', 128450.00),
    (2, 1, 'Wallet Cash', 'cash', 2350.00);

INSERT INTO transactions (user_id, account_id, category_id, title, amount, transaction_type, transaction_date, notes) VALUES
    (1, 1, 1, 'Monthly Salary', 75000.00, 'income', '2026-09-01', 'September salary'),
    (1, 1, 2, 'Groceries', 4200.00, 'expense', '2026-09-05', 'Monthly groceries'),
    (1, 1, 4, 'Metro & Cabs', 2800.00, 'expense', '2026-09-08', 'Commute'),
    (1, 1, 5, 'Rent', 18000.00, 'expense', '2026-09-03', 'Monthly rent'),
    (1, 1, 9, 'Mutual Fund SIP', 5000.00, 'expense', '2026-09-24', 'Monthly investment');

INSERT INTO budgets (user_id, category_id, budget_amount, month, year) VALUES
    (1, 2, 8500.00, 9, 2026), (1, 3, 6000.00, 9, 2026),
    (1, 4, 4500.00, 9, 2026), (1, 5, 25000.00, 9, 2026),
    (1, 6, 3000.00, 9, 2026);

INSERT INTO savings_goals (user_id, goal_name, target_amount, current_amount, target_date)
VALUES (1, 'Emergency Fund', 300000.00, 128450.00, '2027-06-30');

INSERT INTO debts (user_id, debt_name, total_amount, remaining_amount, interest_rate, monthly_payment, due_date)
VALUES (1, 'Education Loan', 250000.00, 85000.00, 8.50, 7500.00, '2027-12-01');

INSERT INTO investments (user_id, investment_type, investment_name, invested_amount, current_value, investment_date)
VALUES (1, 'Mutual Fund', 'Nifty 50 Index Fund', 60000.00, 68400.00, '2025-04-01');

INSERT INTO financial_scores (user_id, overall_score, spending_score, savings_score, debt_score, investment_score)
VALUES (1, 78.00, 74.00, 82.00, 70.00, 78.00);

INSERT INTO ai_recommendations (user_id, recommendation_type, recommendation_text, priority) VALUES
    (1, 'savings', 'Keep building your emergency fund until it covers at least three months of essential expenses.', 'high'),
    (1, 'investment', 'Continue your monthly index-fund contribution after covering your loan payment and monthly budget.', 'medium');
