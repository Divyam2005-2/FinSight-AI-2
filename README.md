# FinSight AI

FinSight AI is a beginner-friendly personal finance web app built with Django. Users register, record income and expenses, view a dashboard, filter transactions, and ask a rule-based finance assistant about their own data.

## Features

- Django authentication: registration, login, and secure logout
- User-owned transaction CRUD with category and type filters
- Dashboard totals, balance, recent transactions, category bars, and financial insights
- Private rule-based AI-style assistant—no API key required
- SQLite database and responsive HTML/CSS templates

## Run locally

```powershell
cd backend
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open `http://127.0.0.1:8000/`. Create an administrator with `python manage.py createsuperuser` and visit `/admin/`.

## How it works

`finance.models.Transaction` stores every transaction with its Django user. Views always filter by `request.user`, so users cannot read, edit, or delete another user's records. The dashboard sums income and expenses, then calculates balance as income minus expenses. `finance/ai_engine.py` reads only the logged-in user's records and answers basic balance, spending, category, and income questions with rules. A future API integration can replace or extend these functions while keeping API keys in environment variables.
