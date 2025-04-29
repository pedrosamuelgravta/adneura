from django.urls import path, include

from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Adneura API",
        default_version="v1",
        description="",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="pedro@gravta.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

schema_view


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.routes"), name="api"),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("swagger.json", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]


if settings.DEBUG:  # Apenas quando DEBUG=True
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
