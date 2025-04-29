from adrf.views import APIView  # type: ignore
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models import Trigger, Audience
from api.serializers import AudienceSerializer, TriggerSerializer
from django.conf import settings

from openai import OpenAI

from api.tasks import generate_image


class GenerateImageTriggerView(APIView):
    permission_classes = [IsAuthenticated]
    client = OpenAI()
    client.api_key = settings.OPENAI_API_KEY

    def post(self, request):
        print("start")

        brand_id = request.data.get("brand_id")

        if not brand_id:
            return Response(
                {"error": "Missing required parameters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        audiences = Audience.objects.filter(brand_id=brand_id).order_by("id")
        scheduled = 0
        print("audiences: ", audiences)
        for audience in audiences:
            print("audience: ", audience)
            triggers_qs = Trigger.objects.filter(audience=audience)
            serialized = TriggerSerializer(triggers_qs, many=True).data
            print("triggers", serialized)
            try:
                if len(serialized) < 3:
                    raise Exception(
                        f"Audience {audience} has {len(serialized)} triggers"
                    )
            except Exception as e:
                print(e)

            for trigger in serialized:
                print("trigger: ", trigger)
                t_id = trigger["id"]
                has_img = bool(trigger["trigger_img"])
                if not has_img:
                    print("trigger has img: ", has_img)
                    file_name = f"B{brand_id}A{audience.id}T{t_id}img.jpg"
                    generate_image.delay(
                        audience.image_prompt, file_name, "trigger", t_id
                    )

                    scheduled += 1
                    print(
                        f"   • Agendada task para trigger {t_id} (total agendadas: {scheduled})"
                    )

        return Response(
            {"message": "Image generation started in background"},
            status=status.HTTP_200_OK,
        )


class GenerateImageAudienceView(APIView):
    permission_classes = [IsAuthenticated]
    client = OpenAI()
    client.api_key = settings.OPENAI_API_KEY

    def post(self, request):
        print("start")

        brand_id = request.data.get("brand_id")

        if not brand_id:
            return Response(
                {"error": "Missing required parameters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        audiences = Audience.objects.filter(brand_id=brand_id).order_by("id")
        scheduled = 0

        for audience in audiences:
            aud_id = audience.id
            has_img = bool(audience.audience_img)
            if not has_img:

                file_name = f"B{brand_id}A{aud_id}img.jpg"
                generate_image.delay(
                    audience.image_prompt, file_name, "audience", aud_id
                )
                scheduled += 1
                print(
                    f"   • Agendada task para audience {audience.id} (total agendadas: {scheduled})"
                )

        return Response(
            {"message": "Image generation started in background"},
            status=status.HTTP_200_OK,
        )
