from django.core.management.base import BaseCommand
from products.models import Product


PRODUCTS_DATA = [
    {
        "product_id": "free",
        "name": "Free",
        "price": 0,
        "currency": "CAD",
        "description": "Perfect for simple personal tax situations with basic income.",
        "best_for": ["Simple personal returns", "Salary employees", "Students"],
        "salary_income": True,
        "student_income": True,
        "sort_order": 1,
    },
    {
        "product_id": "deluxe",
        "name": "Deluxe",
        "price": 30,
        "currency": "CAD",
        "description": "For users with common deductions and expenses like medical bills and donations.",
        "best_for": ["Medical expense claimants", "Donors", "Employees with deductions"],
        "salary_income": True,
        "student_income": True,
        "medical_expenses": True,
        "donations": True,
        "employment_expenses": True,
        "family_deductions": True,
        "sort_order": 2,
    },
    {
        "product_id": "premier",
        "name": "Premier",
        "price": 50,
        "currency": "CAD",
        "description": "Ideal for investors, landlords, and those with foreign or capital gains income.",
        "best_for": ["Investors", "Landlords", "Capital gains earners", "Foreign income"],
        "salary_income": True,
        "student_income": True,
        "medical_expenses": True,
        "donations": True,
        "employment_expenses": True,
        "family_deductions": True,
        "investment_income": True,
        "capital_gains": True,
        "foreign_income": True,
        "rental_income": True,
        "sort_order": 3,
    },
    {
        "product_id": "self-employed",
        "name": "Self-Employed",
        "price": 70,
        "currency": "CAD",
        "description": "Built for freelancers, contractors, gig workers, and sole proprietors.",
        "best_for": ["Freelancers", "Contractors", "Gig workers", "Sole proprietors"],
        "salary_income": True,
        "student_income": True,
        "medical_expenses": True,
        "donations": True,
        "investment_income": True,
        "rental_income": True,
        "freelance_income": True,
        "gig_work_income": True,
        "business_expenses": True,
        "home_office_expenses": True,
        "vehicle_expenses": True,
        "sort_order": 4,
    },
    {
        "product_id": "expert-assist",
        "name": "Expert Assist",
        "price": 120,
        "currency": "CAD",
        "description": "File yourself with on-demand help from a real tax expert via chat or video.",
        "best_for": ["Self-filers needing expert guidance", "Complex personal returns"],
        "salary_income": True,
        "student_income": True,
        "medical_expenses": True,
        "donations": True,
        "employment_expenses": True,
        "family_deductions": True,
        "investment_income": True,
        "capital_gains": True,
        "foreign_income": True,
        "rental_income": True,
        "freelance_income": True,
        "gig_work_income": True,
        "business_expenses": True,
        "home_office_expenses": True,
        "vehicle_expenses": True,
        "expert_help": True,
        "sort_order": 5,
    },
    {
        "product_id": "expert-full-service",
        "name": "Expert Full Service",
        "price": 250,
        "currency": "CAD",
        "description": "A tax expert prepares and files your return from start to finish.",
        "best_for": ["Those who want a hands-off experience", "Busy professionals"],
        "salary_income": True,
        "student_income": True,
        "medical_expenses": True,
        "donations": True,
        "employment_expenses": True,
        "family_deductions": True,
        "investment_income": True,
        "capital_gains": True,
        "foreign_income": True,
        "rental_income": True,
        "freelance_income": True,
        "gig_work_income": True,
        "business_expenses": True,
        "home_office_expenses": True,
        "vehicle_expenses": True,
        "expert_help": True,
        "full_service": True,
        "sort_order": 6,
    },
    {
        "product_id": "business-corporate",
        "name": "Business Corporate",
        "price": 400,
        "currency": "CAD",
        "description": "Complete corporate tax return solution for incorporated companies with revenue.",
        "best_for": ["Incorporated companies", "Businesses with revenue"],
        "business_expenses": True,
        "corporate_filing": True,
        "sort_order": 7,
    },
    {
        "product_id": "nil-corporate-return",
        "name": "Nil Corporate Return",
        "price": 175,
        "currency": "CAD",
        "description": "For incorporated companies with no revenue that still need to file a nil return.",
        "best_for": ["Dormant incorporated companies", "Zero-revenue corporations"],
        "corporate_filing": True,
        "nil_corporate_return": True,
        "sort_order": 8,
    },
]


class Command(BaseCommand):
    help = "Seeds the database with the 8 TaxWise AI products"

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for data in PRODUCTS_DATA:
            product_id = data.pop("product_id")
            obj, created = Product.objects.update_or_create(
                product_id=product_id,
                defaults={**data, "product_id": product_id},
            )
            # restore product_id for next loop safety
            data["product_id"] = product_id

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"  Created: {obj.name}"))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f"  Updated: {obj.name}"))

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSeeding complete -- {created_count} created, {updated_count} updated."
            )
        )
