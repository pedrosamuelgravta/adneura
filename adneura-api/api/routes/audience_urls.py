from rest_framework.routers import DefaultRouter
from ..views.audience_views import AudienceViewSet
from ..views.trigger_views import TriggerViewSet

router = DefaultRouter()
router.register("", AudienceViewSet, basename="audience")
router.register(r"triggers", TriggerViewSet, basename="triggers")

urlpatterns = router.urls
