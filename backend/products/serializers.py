from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    supported_features = serializers.SerializerMethodField()
    unsupported_features = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "product_id",
            "name",
            "price",
            "currency",
            "description",
            "best_for",
            # Feature flags
            "salary_income",
            "student_income",
            "medical_expenses",
            "donations",
            "employment_expenses",
            "family_deductions",
            "investment_income",
            "capital_gains",
            "foreign_income",
            "rental_income",
            "freelance_income",
            "gig_work_income",
            "business_expenses",
            "home_office_expenses",
            "vehicle_expenses",
            "expert_help",
            "full_service",
            "corporate_filing",
            "nil_corporate_return",
            "sort_order",
            # Computed
            "supported_features",
            "unsupported_features",
        ]

    def get_supported_features(self, obj):
        return obj.get_supported_features()

    def get_unsupported_features(self, obj):
        return obj.get_unsupported_features()
