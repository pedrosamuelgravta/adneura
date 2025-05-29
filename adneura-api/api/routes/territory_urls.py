from django.urls import path
from api.views.territory_views import TerritoriesView

urlpatterns = [
    path("", TerritoriesView.as_view(), name="territories"),
]
