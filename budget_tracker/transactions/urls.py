from django.urls import path
from . import views

urlpatterns = [
    path('summary/', views.financial_summary, name='financial_summary'),
    path('budget-comparison/', views.budget_comparison, name='budget_comparison'),
]