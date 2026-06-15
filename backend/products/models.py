from django.db import models


class Product(models.Model):
    """
    Represents a TaxWise AI software product.
    All feature flags are stored as boolean fields.
    """

    CURRENCY_CHOICES = [("CAD", "Canadian Dollar")]

    # ── Core fields ──────────────────────────────────────────────────────────
    product_id = models.CharField(max_length=50, unique=True)  # e.g. 'free', 'deluxe'
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="CAD")
    description = models.TextField()
    best_for = models.JSONField(default=list)  # list of strings

    # ── Feature support flags ─────────────────────────────────────────────────
    salary_income = models.BooleanField(default=False)
    student_income = models.BooleanField(default=False)
    medical_expenses = models.BooleanField(default=False)
    donations = models.BooleanField(default=False)
    employment_expenses = models.BooleanField(default=False)
    family_deductions = models.BooleanField(default=False)
    investment_income = models.BooleanField(default=False)
    capital_gains = models.BooleanField(default=False)
    foreign_income = models.BooleanField(default=False)
    rental_income = models.BooleanField(default=False)
    freelance_income = models.BooleanField(default=False)
    gig_work_income = models.BooleanField(default=False)
    business_expenses = models.BooleanField(default=False)
    home_office_expenses = models.BooleanField(default=False)
    vehicle_expenses = models.BooleanField(default=False)
    expert_help = models.BooleanField(default=False)
    full_service = models.BooleanField(default=False)
    corporate_filing = models.BooleanField(default=False)
    nil_corporate_return = models.BooleanField(default=False)

    # ── Metadata ─────────────────────────────────────────────────────────────
    sort_order = models.PositiveIntegerField(default=0)  # display ordering

    class Meta:
        ordering = ["sort_order", "price"]

    def __str__(self):
        return f"{self.name} (CAD ${self.price})"

    def get_supported_features(self):
        """Returns list of feature names this product supports."""
        features = {
            "salary_income": "Salary Income",
            "student_income": "Student Income",
            "medical_expenses": "Medical Expenses",
            "donations": "Donations",
            "employment_expenses": "Employment Expenses",
            "family_deductions": "Family Deductions",
            "investment_income": "Investment Income",
            "capital_gains": "Capital Gains",
            "foreign_income": "Foreign Income",
            "rental_income": "Rental Income",
            "freelance_income": "Freelance Income",
            "gig_work_income": "Gig-Work Income",
            "business_expenses": "Business Expenses",
            "home_office_expenses": "Home Office Expenses",
            "vehicle_expenses": "Vehicle Expenses",
            "expert_help": "Expert Help",
            "full_service": "Full Service Filing",
            "corporate_filing": "Corporate Filing",
            "nil_corporate_return": "Nil Corporate Return",
        }
        return [label for key, label in features.items() if getattr(self, key)]

    def get_unsupported_features(self):
        """Returns list of feature names this product does NOT support."""
        features = {
            "salary_income": "Salary Income",
            "student_income": "Student Income",
            "medical_expenses": "Medical Expenses",
            "donations": "Donations",
            "employment_expenses": "Employment Expenses",
            "family_deductions": "Family Deductions",
            "investment_income": "Investment Income",
            "capital_gains": "Capital Gains",
            "foreign_income": "Foreign Income",
            "rental_income": "Rental Income",
            "freelance_income": "Freelance Income",
            "gig_work_income": "Gig-Work Income",
            "business_expenses": "Business Expenses",
            "home_office_expenses": "Home Office Expenses",
            "vehicle_expenses": "Vehicle Expenses",
            "expert_help": "Expert Help",
            "full_service": "Full Service Filing",
            "corporate_filing": "Corporate Filing",
            "nil_corporate_return": "Nil Corporate Return",
        }
        return [label for key, label in features.items() if not getattr(self, key)]
