from rest_framework.routers import DefaultRouter
from ..views.audience_views import AudienceViewSet

router = DefaultRouter()
router.register("", AudienceViewSet, basename="audience")
urlpatterns = router.urls
