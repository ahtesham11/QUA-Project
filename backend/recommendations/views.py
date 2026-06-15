from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .engine import recommend, WizardAnswers


@api_view(["POST"])
def recommend_view(request):
    """
    POST /api/recommend/
    Body: { filing_type, income_sources, deductions, help_preference, has_revenue? }
    Returns: RecommendationResult
    """
    data = request.data

    # ── Validation ────────────────────────────────────────────────────────────
    errors = {}

    filing_type = data.get("filing_type", "").strip()
    if not filing_type:
        errors["filing_type"] = "Filing type is required."

    income_sources = data.get("income_sources", [])
    if not isinstance(income_sources, list) or len(income_sources) == 0:
        errors["income_sources"] = "At least one income source is required."

    deductions = data.get("deductions", [])
    if not isinstance(deductions, list):
        errors["deductions"] = "Deductions must be a list."

    help_preference = data.get("help_preference", "").strip()
    if not help_preference:
        errors["help_preference"] = "Help preference is required."

    has_revenue = data.get("has_revenue", None)
    if filing_type == "incorporated" and has_revenue is None:
        errors["has_revenue"] = "Company revenue answer is required for incorporated companies."

    if errors:
        return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

    # ── Run engine ────────────────────────────────────────────────────────────
    answers = WizardAnswers(
        filing_type=filing_type,
        income_sources=income_sources,
        deductions=deductions,
        help_preference=help_preference,
        has_revenue=has_revenue,
    )

    result = recommend(answers)
    return Response(result, status=status.HTTP_200_OK)
