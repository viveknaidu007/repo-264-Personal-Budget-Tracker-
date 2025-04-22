from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, UserSerializer
import datetime

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Seed default categories
            default_categories = ["Food", "Travel", "Entertainment"]
            for name in default_categories:
                Category.objects.create(user=user, name=name)
            return Response({"message": "User created successfully", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Category.objects.filter(user=user)
        print(f"Fetching categories for user {user.id}: {list(queryset.values('id', 'name', 'user'))}")  # Debug log
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        date = self.request.query_params.get('date')
        category = self.request.query_params.get('category')
        amount = self.request.query_params.get('amount')
        if date:
            queryset = queryset.filter(date=date)
        if category:
            queryset = queryset.filter(category__id=category)
        if amount:
            queryset = queryset.filter(amount__gte=amount)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
    total_income = transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum']
    total_expenses = transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum']
    # Convert Decimal128 to Decimal or float
    total_income = float(total_income.to_decimal() if total_income else 0) if total_income else 0
    total_expenses = float(total_expenses.to_decimal() if total_expenses else 0) if total_expenses else 0
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
    current_month_start = today.replace(day=1)
    current_month_end = (today.replace(day=28) + datetime.timedelta(days=4)).replace(day=1) - datetime.timedelta(days=1)

    budget = Budget.objects.filter(user=request.user, month=current_month_start).first()
    expenses = Transaction.objects.filter(
        user=request.user,
        type='expense',
        date__gte=current_month_start,
        date__lte=current_month_end
    ).aggregate(Sum('amount'))['amount__sum'] or 0

    return Response({
        'budget': float(budget.amount.to_decimal() if budget and hasattr(budget.amount, 'to_decimal') else 0),
        'actual_expenses': float(expenses.to_decimal() if hasattr(expenses, 'to_decimal') else expenses)
    })