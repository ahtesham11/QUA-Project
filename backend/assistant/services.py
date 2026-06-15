"""
AI Assistant — uses Groq API (LLaMA 3.3) as primary, falls back to simulated engine.

Priority:
  1. GROQ_API_KEY set → Groq (llama-3.3-70b-versatile)
  2. No key          → Keyword-based simulated assistant
"""

import os
import re
from django.conf import settings

# ─── Product context injected as system prompt ────────────────────────────────
PRODUCT_CONTEXT = """
You are a helpful product assistant for TaxWise AI, a fictional Canadian tax software company.
You help users choose the right tax product based on their situation.

Available products:
1. Free ($0 CAD) – Salary/student income only, simple returns.
2. Deluxe ($30 CAD) – Adds medical expenses, donations, employment/family deductions.
3. Premier ($50 CAD) – Adds investment income, capital gains, rental income, foreign income.
4. Self-Employed ($70 CAD) – For freelancers, gig workers, contractors; includes business/home-office/vehicle expenses.
5. Expert Assist ($120 CAD) – All personal situations + live expert chat/video while you file.
6. Expert Full Service ($250 CAD) – Expert prepares AND files your return for you.
7. Business Corporate ($400 CAD) – Incorporated companies with revenue.
8. Nil Corporate Return ($175 CAD) – Incorporated companies with no revenue.

Recommendation priority (highest wins):
1. Incorporated company → Business Corporate (with revenue) or Nil Corporate Return (no revenue)
2. "Want expert to file for me" → Expert Full Service
3. "Want expert help while filing" → Expert Assist
4. Freelance/gig/business signals → Self-Employed
5. Investment/rental/capital gains/foreign → Premier
6. Medical/donations/employment expenses → Deluxe
7. Salary/student only → Free

SAFETY RULES — you MUST follow these at all times:
- NEVER say: "You are guaranteed a refund", "You definitely qualify", "This is legal advice".
- ALWAYS say: "Based on the provided product rules...", "This product appears suitable..."
- ALWAYS end your response with: "This is general product guidance only and is not tax, legal, or financial advice."
- If asked for a refund guarantee or tax/legal advice, politely decline and redirect.
- Do NOT invent features not listed above.
- Do NOT recommend products not listed above.
- Keep responses concise and friendly.
"""

UNSAFE_PATTERNS = [
    r"guarantee.*refund",
    r"refund.*guarantee",
    r"definitely.*qualify",
    r"qualify.*definitely",
    r"tax authority.*accept",
    r"will.*get.*refund",
    r"100%.*sure",
]

SAFE_REDIRECT = (
    "I cannot guarantee refunds or tax outcomes. "
    "I can only provide general product guidance based on the product rules. "
    "Please consult a qualified tax professional for personalised advice. "
    "\n\nThis is general product guidance only and is not tax, legal, or financial advice."
)

DISCLAIMER = "\n\nThis is general product guidance only and is not tax, legal, or financial advice."


def is_unsafe(question: str) -> bool:
    q = question.lower()
    return any(re.search(p, q) for p in UNSAFE_PATTERNS)


def get_ai_response(question: str) -> dict:
    """
    Main entry point. Uses Groq if API key available, else simulates.
    Returns: { answer, recommended_product, confidence, reasons, disclaimer, source }
    """
    if is_unsafe(question):
        return {
            "answer": SAFE_REDIRECT,
            "recommended_product": None,
            "confidence": None,
            "reasons": [],
            "disclaimer": DISCLAIMER.strip(),
            "source": "safety-filter",
        }

    groq_key = getattr(settings, "GROQ_API_KEY", "")
    if groq_key:
        return _groq_response(question, groq_key)
    return _simulated_response(question)


def _groq_response(question: str, api_key: str) -> dict:
    """Call Groq API using the openai-compatible client."""
    try:
        from groq import Groq

        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": PRODUCT_CONTEXT},
                {"role": "user", "content": question},
            ],
            temperature=0.4,
            max_tokens=600,
        )
        answer = completion.choices[0].message.content.strip()

        # Ensure disclaimer is always present
        if "general product guidance" not in answer.lower():
            answer += DISCLAIMER

        return {
            "answer": answer,
            "recommended_product": _extract_product_name(answer),
            "confidence": "high",
            "reasons": [],
            "disclaimer": DISCLAIMER.strip(),
            "source": "groq",
        }
    except Exception as e:
        result = _simulated_response(question)
        result["source"] = f"simulated-fallback (Groq error: {str(e)[:120]})"
        return result


def _simulated_response(question: str) -> dict:
    """Keyword-based simulated assistant grounded in product data."""
    q = question.lower()

    if any(w in q for w in ["incorporated", "corporation", "corporate", "company"]):
        if any(w in q for w in ["no revenue", "no income", "zero revenue", "nil", "dormant"]):
            return _sim_result(
                "Nil Corporate Return", 175,
                "Based on the provided product rules, Nil Corporate Return appears suitable for "
                "incorporated companies with no revenue that still need to file.",
                ["incorporated company", "no revenue"],
            )
        return _sim_result(
            "Business Corporate", 400,
            "Based on the provided product rules, Business Corporate appears suitable for "
            "incorporated companies with revenue.",
            ["incorporated company"],
        )

    if any(w in q for w in ["file for me", "file my return", "do it for me", "full service"]):
        return _sim_result(
            "Expert Full Service", 250,
            "Based on the provided product rules, Expert Full Service appears suitable — "
            "a dedicated tax expert will prepare and file your return.",
            ["expert to file"],
        )

    if any(w in q for w in ["expert help", "expert chat", "expert assist", "help while filing", "video call"]):
        return _sim_result(
            "Expert Assist", 120,
            "Based on the provided product rules, Expert Assist appears suitable — "
            "you file yourself with live expert guidance via chat or video call.",
            ["expert help while filing"],
        )

    if any(w in q for w in ["freelance", "self-employ", "gig", "contractor", "home office", "home-office", "vehicle", "business expense"]):
        return _sim_result(
            "Self-Employed", 70,
            "Based on the provided product rules, Self-Employed appears suitable — "
            "it supports freelance income, gig work, and business-related expenses.",
            ["freelance/self-employed signals detected"],
        )

    if any(w in q for w in ["investment", "rental", "capital gain", "foreign income", "dividend", "reit"]):
        return _sim_result(
            "Premier", 50,
            "Based on the provided product rules, Premier appears suitable — "
            "it supports investment income, capital gains, rental income, and foreign income.",
            ["investment/rental/capital gains signals detected"],
        )

    if any(w in q for w in ["medical", "donation", "charitable", "employment expense"]):
        return _sim_result(
            "Deluxe", 30,
            "Based on the provided product rules, Deluxe appears suitable — "
            "it adds medical expenses, donations, and employment expense deductions.",
            ["medical/donation/employment expense signals detected"],
        )

    if "difference" in q or "compare" in q or "vs" in q:
        return {
            "answer": (
                "Based on the provided product rules, here are the key differences:\n\n"
                "• **Free ($0)** – Salary/student only\n"
                "• **Deluxe ($30)** – Adds medical, donations, employment expenses\n"
                "• **Premier ($50)** – Adds investments, rental, capital gains\n"
                "• **Self-Employed ($70)** – Adds freelance, gig, business expenses\n"
                "• **Expert Assist ($120)** – All personal situations + expert guidance\n"
                "• **Expert Full Service ($250)** – Expert files for you\n"
                "• **Business Corporate ($400)** – Incorporated companies\n"
                "• **Nil Corporate Return ($175)** – Incorporated with no revenue\n"
                + DISCLAIMER
            ),
            "recommended_product": None,
            "confidence": None,
            "reasons": [],
            "disclaimer": DISCLAIMER.strip(),
            "source": "simulated",
        }

    return _sim_result(
        "Free", 0,
        "Based on the provided product rules, Free appears suitable for simple personal tax situations "
        "with salary or student income and no special deductions. "
        "If your situation is more complex, please describe it and I can refine my suggestion.",
        ["simple personal situation assumed"],
    )


def _sim_result(product: str, price: float, answer: str, reasons: list) -> dict:
    return {
        "answer": answer + DISCLAIMER,
        "recommended_product": product,
        "confidence": "medium",
        "reasons": reasons,
        "disclaimer": DISCLAIMER.strip(),
        "source": "simulated",
    }


def _extract_product_name(text: str) -> str | None:
    products = [
        "Business Corporate", "Nil Corporate Return", "Expert Full Service",
        "Expert Assist", "Self-Employed", "Premier", "Deluxe", "Free",
    ]
    for p in products:
        if p.lower() in text.lower():
            return p
    return None
