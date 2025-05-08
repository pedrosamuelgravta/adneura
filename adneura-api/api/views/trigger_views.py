from rest_framework.viewsets import ModelViewSet
from api.models import Trigger
from api.serializers import TriggerSerializer
from rest_framework.permissions import IsAuthenticated


class TriggerViewSet(ModelViewSet):
    queryset = Trigger.objects.all()
    serializer_class = TriggerSerializer
    permission_classes = [IsAuthenticated]
