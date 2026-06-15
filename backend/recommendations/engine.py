"""
Recommendation Engine — pure business logic, NO Django/UI dependencies.

Priority order (highest wins):
  1. Incorporated company + revenue      → Business Corporate
  2. Incorporated company + no revenue   → Nil Corporate Return
  3. Expert to file for me               → Expert Full Service
  4. Expert help while filing            → Expert Assist
  5. Freelance / self-employed signals   → Self-Employed
  6. Investment / rental / capital gains → Premier
  7. Medical / donations / employment    → Deluxe
  8. Salary/student only                 → Free
"""

from typing import TypedDict, List, Optional


class WizardAnswers(TypedDict):
    filing_type: str          # 'personal' | 'self-employed' | 'incorporated'
    income_sources: List[str] # list of selected income slugs
    deductions: List[str]     # list of selected deduction slugs
    help_preference: str      # 'self' | 'expert-help' | 'expert-file'
    has_revenue: Optional[bool]  # only when filing_type == 'incorporated'


class UpgradeOption(TypedDict):
    product_id: str
    product_name: str
    price: float
    reason: str


class RecommendationResult(TypedDict):
    recommended_product_id: str
    recommended_product_name: str
    price: float
    confidence: str           # 'low' | 'medium' | 'high'
    reasons: List[str]
    matched_inputs: List[str]
    optional_upgrade: Optional[UpgradeOption]
    warnings: List[str]
    disclaimer: str


DISCLAIMER = (
    "This recommendation provides general product guidance only and is not tax, "
    "legal, or financial advice. Please consult a qualified tax professional for "
    "personalised advice."
)

PRODUCT_PRICES = {
    "free": 0,
    "deluxe": 30,
    "premier": 50,
    "self-employed": 70,
    "expert-assist": 120,
    "expert-full-service": 250,
    "business-corporate": 400,
    "nil-corporate-return": 175,
}

PRODUCT_NAMES = {
    "free": "Free",
    "deluxe": "Deluxe",
    "premier": "Premier",
    "self-employed": "Self-Employed",
    "expert-assist": "Expert Assist",
    "expert-full-service": "Expert Full Service",
    "business-corporate": "Business Corporate",
    "nil-corporate-return": "Nil Corporate Return",
}


def recommend(answers: WizardAnswers) -> RecommendationResult:
    """
    Apply priority rules and return a structured recommendation.
    """
    filing_type = answers.get("filing_type", "personal")
    income_sources = set(answers.get("income_sources", []))
    deductions = set(answers.get("deductions", []))
    help_preference = answers.get("help_preference", "self")
    has_revenue = answers.get("has_revenue")

    reasons: List[str] = []
    matched_inputs: List[str] = []
    warnings: List[str] = []
    recommended_id: str = "free"
    confidence: str = "high"
    optional_upgrade: Optional[UpgradeOption] = None

    # ── Validate contradictions ──────────────────────────────────────────────
    if "no-deductions" in deductions and len(deductions) > 1:
        deductions.discard("no-deductions")
        warnings.append(
            "You selected 'No special deductions' along with specific deductions. "
            "The specific deductions were used for this recommendation."
        )

    # ── Rule 1 & 2: Incorporated company (HIGHEST PRIORITY) ──────────────────
    if filing_type == "incorporated":
        if has_revenue:
            recommended_id = "business-corporate"
            reasons.append("You selected Incorporated company with revenue.")
            reasons.append("Business Corporate handles full corporate tax filing and business expenses.")
            matched_inputs.append("filing_type:incorporated")
            matched_inputs.append("has_revenue:true")
        else:
            recommended_id = "nil-corporate-return"
            reasons.append("You selected Incorporated company with no revenue.")
            reasons.append("Nil Corporate Return is designed for dormant companies that still need to file.")
            matched_inputs.append("filing_type:incorporated")
            matched_inputs.append("has_revenue:false")
        return _build_result(recommended_id, reasons, matched_inputs, warnings, confidence, optional_upgrade)

    # ── Rule 3: Expert Full Service ───────────────────────────────────────────
    if help_preference == "expert-file":
        recommended_id = "expert-full-service"
        reasons.append("You want an expert to prepare and file your return for you.")
        reasons.append("Expert Full Service provides a dedicated tax expert who handles everything.")
        matched_inputs.append("help_preference:expert-file")
        return _build_result(recommended_id, reasons, matched_inputs, warnings, confidence, optional_upgrade)

    # ── Rule 4: Expert Assist ─────────────────────────────────────────────────
    if help_preference == "expert-help":
        recommended_id = "expert-assist"
        reasons.append("You want expert help while filing yourself.")
        reasons.append("Expert Assist provides live chat and video call access to tax experts.")
        matched_inputs.append("help_preference:expert-help")
        return _build_result(recommended_id, reasons, matched_inputs, warnings, confidence, optional_upgrade)

    # ── Rule 5: Self-Employed ─────────────────────────────────────────────────
    self_employed_triggers = {
        "freelance-income",
        "gig-work-income",
        "business-revenue",
        "business-expenses",
        "home-office-expenses",
        "vehicle-expenses",
    }
    matched_se = (income_sources | deductions) & self_employed_triggers
    if filing_type == "self-employed" or matched_se:
        recommended_id = "self-employed"
        if filing_type == "self-employed":
            reasons.append("You selected Freelancer/Self-employed as your filing type.")
            matched_inputs.append("filing_type:self-employed")
        for trigger in matched_se:
            reasons.append(f"You selected {_humanize(trigger)}.")
            matched_inputs.append(trigger)
        reasons.append("Self-Employed supports all freelance, gig, and business-related income and expenses.")
        return _build_result(recommended_id, reasons, matched_inputs, warnings, confidence, optional_upgrade)

    # ── Rule 6: Premier ───────────────────────────────────────────────────────
    premier_triggers = {"investment-income", "capital-gains", "rental-income", "foreign-income"}
    matched_premier = income_sources & premier_triggers
    if matched_premier:
        recommended_id = "premier"
        for trigger in matched_premier:
            reasons.append(f"You selected {_humanize(trigger)}.")
            matched_inputs.append(trigger)
        reasons.append("Premier supports investments, capital gains, rental, and foreign income.")
        return _build_result(recommended_id, reasons, matched_inputs, warnings, confidence, optional_upgrade)

    # ── Rule 7: Deluxe ────────────────────────────────────────────────────────
    deluxe_triggers = {"medical-expenses", "donations", "employment-expenses"}
    matched_deluxe = deductions & deluxe_triggers
    if matched_deluxe:
        recommended_id = "deluxe"
        for trigger in matched_deluxe:
            reasons.append(f"You selected {_humanize(trigger)}.")
            matched_inputs.append(trigger)
        reasons.append("Deluxe supports medical expenses, donations, and employment expenses.")
        # Suggest Premier as upgrade if applicable
        optional_upgrade = UpgradeOption(
            product_id="premier",
            product_name="Premier",
            price=PRODUCT_PRICES["premier"],
            reason="If you ever have investment or rental income, Premier includes all Deluxe features plus more.",
        )
        return _build_result(recommended_id, reasons, matched_inputs, warnings, confidence, optional_upgrade)

    # ── Rule 8: Free (default) ────────────────────────────────────────────────
    recommended_id = "free"
    reasons.append("Your tax situation appears simple — salary or student income with no special deductions.")
    reasons.append("Free is the perfect starting point at no cost.")
    matched_inputs.append("filing_type:personal")
    confidence = "medium" if not income_sources else "high"
    optional_upgrade = UpgradeOption(
        product_id="deluxe",
        product_name="Deluxe",
        price=PRODUCT_PRICES["deluxe"],
        reason="If you have medical expenses or donations to claim, Deluxe adds those deductions for CAD $30.",
    )
    return _build_result(recommended_id, reasons, matched_inputs, warnings, confidence, optional_upgrade)


def _build_result(
    product_id: str,
    reasons: List[str],
    matched_inputs: List[str],
    warnings: List[str],
    confidence: str,
    optional_upgrade: Optional[UpgradeOption],
) -> RecommendationResult:
    return RecommendationResult(
        recommended_product_id=product_id,
        recommended_product_name=PRODUCT_NAMES[product_id],
        price=PRODUCT_PRICES[product_id],
        confidence=confidence,
        reasons=reasons,
        matched_inputs=matched_inputs,
        optional_upgrade=optional_upgrade,
        warnings=warnings,
        disclaimer=DISCLAIMER,
    )


def _humanize(slug: str) -> str:
    """Convert kebab-case slug to human-readable label."""
    return slug.replace("-", " ").title()
