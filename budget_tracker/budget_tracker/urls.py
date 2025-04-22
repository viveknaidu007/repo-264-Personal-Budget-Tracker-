from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from transactions.views import CategoryViewSet, TransactionViewSet, BudgetViewSet, financial_summary, budget_comparison, RegisterView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', obtain_auth_token),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/summary/', financial_summary),
    path('api/budget-comparison/', budget_comparison),
]