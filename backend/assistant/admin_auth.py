from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


@api_view(["POST"])
def admin_login(request):
    """
    POST /api/admin/login/
    Body: { "username": "...", "password": "..." }
    Returns: { "success": true, "user": {...}, "message": "..." } or error
    """
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Authenticate user
    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Check if user is staff (admin)
    if not user.is_staff:
        return Response(
            {"error": "User does not have admin privileges."},
            status=status.HTTP_403_FORBIDDEN,
        )

    # Login successful
    return Response(
        {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            }
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def admin_logout(request):
    """
    POST /api/admin/logout/
    Returns: { "success": true, "message": "..." }
    """
    return Response(
        {"success": True, "message": "Logout successful"},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def admin_verify(request):
    """
    GET /api/admin/verify/
    Verifies if user is authenticated and has admin privileges.
    Returns: { "authenticated": true, "is_admin": true } or false
    """
    if request.user.is_authenticated:
        return Response(
            {
                "authenticated": True,
                "is_admin": request.user.is_staff,
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                }
            },
            status=status.HTTP_200_OK,
        )
    return Response(
        {"authenticated": False, "is_admin": False},
        status=status.HTTP_200_OK,
    )
