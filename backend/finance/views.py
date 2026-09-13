from decimal import Decimal

from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect, render

from .ai_engine import answer_finance_question, generate_financial_insights
from .forms import RegisterForm, TransactionForm
from .models import Transaction


def home(request):
    return render(request, 'home.html')


def register(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    form = RegisterForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save()
        login(request, user)
        messages.success(request, 'Welcome to FinSight AI! Your account has been created.')
        return redirect('dashboard')
    return render(request, 'register.html', {'form': form})


def _totals(queryset):
    income = queryset.filter(transaction_type=Transaction.INCOME).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    expenses = queryset.filter(transaction_type=Transaction.EXPENSE).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    return income, expenses


@login_required
def dashboard(request):
    items = Transaction.objects.filter(user=request.user)
    income, expenses = _totals(items)
    categories = items.filter(transaction_type=Transaction.EXPENSE).values('category').annotate(total=Sum('amount')).order_by('-total')
    largest = max((row['total'] for row in categories), default=Decimal('1'))
    category_data = [{'category': row['category'], 'total': row['total'], 'width': int((row['total'] / largest) * 100)} for row in categories]
    return render(request, 'dashboard.html', {
        'total_income': income, 'total_expenses': expenses, 'balance': income - expenses,
        'transaction_count': items.count(), 'recent_transactions': items[:5],
        'category_data': category_data, 'insights': generate_financial_insights(request.user),
    })


@login_required
def transactions(request):
    items = Transaction.objects.filter(user=request.user)
    selected_type = request.GET.get('type', '')
    selected_category = request.GET.get('category', '')
    if selected_type in dict(Transaction.TYPE_CHOICES):
        items = items.filter(transaction_type=selected_type)
    if selected_category in dict(Transaction.CATEGORY_CHOICES):
        items = items.filter(category=selected_category)
    return render(request, 'transactions.html', {'transactions': items, 'selected_type': selected_type, 'selected_category': selected_category, 'categories': Transaction.CATEGORY_CHOICES})


@login_required
def add_transaction(request):
    form = TransactionForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        transaction = form.save(commit=False)
        transaction.user = request.user
        transaction.save()
        messages.success(request, 'Transaction added successfully.')
        return redirect('transactions')
    return render(request, 'transaction_form.html', {'form': form, 'title': 'Add Transaction'})


@login_required
def edit_transaction(request, pk):
    transaction = get_object_or_404(Transaction, pk=pk, user=request.user)
    form = TransactionForm(request.POST or None, instance=transaction)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Transaction updated successfully.')
        return redirect('transactions')
    return render(request, 'transaction_form.html', {'form': form, 'title': 'Edit Transaction'})


@login_required
def delete_transaction(request, pk):
    transaction = get_object_or_404(Transaction, pk=pk, user=request.user)
    if request.method == 'POST':
        transaction.delete()
        messages.success(request, 'Transaction deleted successfully.')
        return redirect('transactions')
    return render(request, 'confirm_delete.html', {'transaction': transaction})


@login_required
def ai_assistant(request):
    question = request.POST.get('question', '').strip()
    answer = answer_finance_question(request.user, question) if request.method == 'POST' and question else None
    if request.method == 'POST' and not question:
        messages.error(request, 'Please enter a question first.')
    return render(request, 'ai_assistant.html', {'question': question, 'answer': answer})
