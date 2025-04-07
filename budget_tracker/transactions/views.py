from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
import datetime

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        date = self.request.query_params.get('date', None)
        category = self.request.query_params.get('category', None)
        amount = self.request.query_params.get('amount', None)

        if date:
            queryset = queryset.filter(date=date)
        if category:
            queryset = queryset.filter(category__id=category)
        if amount:
            queryset = queryset.filter(amount__gte=amount)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_summary(request):
    transactions = Transaction.objects.filter(user=request.user)
    total_income = transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    balance = total_income - total_expenses

    return Response({
        'total_income': total_income,
        'total_expenses': total_expenses,
        'balance': balance
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_comparison(request):
    today = datetime.date.today()
    current_month = today.replace(day=1)
    budget = Budget.objects.filter(user=request.user, month=current_month).first()
    expenses = Transaction.objects.filter(
        user=request.user, type='expense', date__year=today.year, date__month=today.month
    ).aggregate(Sum('amount'))['amount__sum'] or 0

    return Response({
        'budget': budget.amount if budget else 0,
        'actual_expenses': expenses
    })