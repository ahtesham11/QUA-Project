from django.contrib import admin
from django.urls import path, include
from assistant.admin_auth import admin_login, admin_logout, admin_verify

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/products/", include("products.urls")),
    path("api/recommend/", include("recommendations.urls")),
    path("api/assistant/", include("assistant.urls")),
    path("api/admin/login/", admin_login, name="admin_login"),
    path("api/admin/logout/", admin_logout, name="admin_logout"),
    path("api/admin/verify/", admin_verify, name="admin_verify"),
]
