from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.models import Audience
from api.serializers import (
    AudienceSerializer,
    AnalyzeAudienceSerializer,
    AnalyzeBrandSerializer,
)
from api.repositories.audience_repository import AudienceRepository
from api.services.audience_service import AudienceService
from api.services.image_service import ImageService
from api.utils.validate_request import validate_request
from api.utils.exceptions import *

"""
GET    /audiences/                          → list by brand_id
POST   /audiences/                          → create (DRF default)
POST   /audiences/generate_batch/           → generate_batch
POST   /audiences/generate_batch_triggers/  → generate_batch_triggers
POST   /audiences/analyze/                  → analyze
POST   /audiences/generate_audience_image/  → generate_audience_image
POST   /audiences/generate_trigger_image/    → generate_trigger_image
GET    /audiences/{pk}/                     → retrieve
PUT    /audiences/{pk}/                     → update
PATCH  /audiences/{pk}/                     → partial_update
"""


class AudienceViewSet(ModelViewSet):

    queryset = Audience.objects.all()
    serializer_class = AudienceSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        brand_id = request.query_params.get("brand_id")
        if brand_id:
            response = AudienceRepository.find_by_brand(brand_id)
        else:
            return super().list(request, *args, **kwargs)

        serializer = self.get_serializer(response, many=True)
        return Response({"success": serializer.data}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def generate_batch(self, request):
        try:
            data = validate_request(AnalyzeBrandSerializer, request)
            brand_id = data["brand_id"]
            response = AudienceService.create_batch_audiences(brand_id).data
        except Exception as e:
            raise e

        return Response({"success": response}, status=status.HTTP_201_CREATED)

    @action(methods=["POST"], detail=False)
    def analyze(self, request: Request):
        try:
            data = validate_request(AnalyzeAudienceSerializer, request)
            audience_id = data["audience_id"]
            response = AudienceService.analyze_audience(audience_id).data
        except Exception as e:
            raise e

        return Response({"success": response}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def generate_batch_triggers(self, request: Request):
        try:
            print(request)
            data = validate_request(AnalyzeAudienceSerializer, request)
            audience_id = data["audience_id"]
            rerun = data.get("rerun", False)
            print(audience_id)
            response = AudienceService.create_batch_triggers(
                audience_id, rerun=rerun
            ).data
        except Exception as e:
            raise e

        return Response({"success": response}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def generate_audience_image(self, request):

        brand_id: str = request.data.get("brand_id")
        audience_id: str = request.data.get("audience_id", None)

        if brand_id is None:
            return Response(
                {"error": "Brand ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            response = ImageService.generate_audience_image(brand_id, audience_id).data
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response({"success": response}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def generate_trigger_image(self, request):

        brand_id: str = request.data.get("brand_id")
        trigger_id: str = request.data.get("trigger_id", None)

        if brand_id is None:
            return Response(
                {"error": "Brand ID are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            response = ImageService.generate_trigger_image(brand_id, trigger_id).data
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response({"success": response}, status=status.HTTP_200_OK)
