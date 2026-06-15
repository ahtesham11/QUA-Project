from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services import get_ai_response


@api_view(["POST"])
def assistant_view(request):
    """
    POST /api/assistant/
    Body: { "question": "..." }
    Returns: AI or simulated product guidance response.
    """
    question = request.data.get("question", "").strip()

    if not question:
        return Response(
            {"error": "Question is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(question) > 2000:
        return Response(
            {"error": "Question is too long (max 2000 characters)."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    result = get_ai_response(question)
    return Response(result, status=status.HTTP_200_OK)
