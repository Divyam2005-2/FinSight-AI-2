from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone

from .models import Transaction


def _summary(user, month_only=False):
    items = Transaction.objects.filter(user=user)
    if month_only:
        today = timezone.localdate()
        items = items.filter(date__year=today.year, date__month=today.month)
    income = items.filter(transaction_type=Transaction.INCOME).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    expenses = items.filter(transaction_type=Transaction.EXPENSE).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    categories = items.filter(transaction_type=Transaction.EXPENSE).values('category').annotate(total=Sum('amount')).order_by('-total')
    return income, expenses, categories


def generate_financial_insights(user):
    income, expenses, categories = _summary(user)
    if not income and not expenses:
        return ['Add a few transactions to receive personalised financial insights.']
    insights = []
    balance = income - expenses
    if expenses > income:
        insights.append('Warning: your expenses are currently higher than your income.')
    elif income:
        rate = (balance / income) * 100
        if rate >= 20:
            insights.append(f'Good job! Your savings rate is {rate:.0f}%, which is healthy.')
        elif rate < 10:
            insights.append(f'Your savings rate is {rate:.0f}%. Try reducing non-essential spending.')
    if categories:
        top = categories[0]
        insights.append(f'{top["category"]} is your highest spending category at ₹{top["total"]:,.2f}.')
    return insights[:3]


def answer_finance_question(user, question):
    text = question.lower().strip()
    income, expenses, categories = _summary(user, month_only=('month' in text))
    period = ' this month' if 'month' in text else ''
    if any(word in text for word in ('balance', 'left', 'saved')):
        return f'Your current balance is ₹{income - expenses:,.2f}.'
    if 'income' in text or 'earn' in text:
        return f'Your total income{period} is ₹{income:,.2f}.'
    if any(word in text for word in ('most', 'highest', 'where')):
        if categories:
            return f'Your highest expense category is {categories[0]["category"]} at ₹{categories[0]["total"]:,.2f}.'
        return 'You have not recorded any expenses yet.'
    for category, label in Transaction.CATEGORY_CHOICES:
        if category.lower() in text:
            total = next((item['total'] for item in categories if item['category'] == category), Decimal('0'))
            return f'You spent ₹{total:,.2f} on {label}{period}.'
    if any(word in text for word in ('spend', 'expense', 'expenses')):
        return f'You spent ₹{expenses:,.2f}{period}.'
    return 'Try asking about your spending, income, balance, or highest expense category.'
