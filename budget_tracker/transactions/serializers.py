from rest_framework import serializers
from .models import Category, Transaction, Budget
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,  # Changed to False to make it optional
        allow_null=True  # Allow null values
    )

    class Meta:
        model = Transaction
        fields = ['id', 'category', 'category_id', 'amount', 'date', 'description', 'type']
        extra_kwargs = {
            'amount': {'required': True},
            'date': {'required': True},
            'type': {'required': True}
        }

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'month', 'amount']