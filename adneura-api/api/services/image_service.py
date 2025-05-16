from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from openai import OpenAI

from api.repositories.audience_repository import AudienceRepository
from api.tasks import generate_image


class ImageService:
    client = OpenAI()
    client.api_key = settings.OPENAI_API_KEY

    @classmethod
    def generate_audience_image(cls, brand_id: str, audience_id: str) -> str:
        audiences = AudienceRepository.find_by_brand(brand_id)
        scheduled = 0

        if audience_id:
            audiences = audiences.filter(id=audience_id)

        for audience in audiences:
            aud_id = audience.id
            has_img = bool(audience.audience_img)
            if not has_img:

                file_name = f"B{brand_id}A{aud_id}img.jpeg"
                generate_image.delay(
                    audience.image_prompt, audience, file_name, "audience", aud_id
                )
                scheduled += 1
                print(
                    f"   • Agendada task para audience {audience.id} (total agendadas: {scheduled})"
                )

        return Response(
            {
                "message": f"Image generation started in background for {scheduled} audience(s)"
            },
            status=status.HTTP_200_OK,
        )

    @classmethod
    def generate_trigger_image(cls, brand_id: str, trigger_id: str = None) -> str:
        audiences = AudienceRepository.find_by_brand(brand_id)
        scheduled = 0

        for audience in audiences:
            triggers_qs = audience.triggers.all()
            try:
                if len(triggers_qs) < 3:
                    raise Exception(
                        f"Audience {audience} has {len(triggers_qs)} triggers"
                    )
            except Exception as e:
                print(e)

            if trigger_id:
                triggers_qs = triggers_qs.filter(id=trigger_id)

            for trigger in triggers_qs:
                t_id = trigger.id
                has_img = bool(trigger.trigger_img)
                if not has_img:
                    file_name = f"B{brand_id}A{audience.id}T{t_id}img.jpeg"
                    generate_image.delay(
                        trigger.image_prompt, audience, file_name, "trigger", t_id
                    )

                    scheduled += 1
                    print(
                        f"   • Agendada task para trigger {t_id} (total agendadas: {scheduled})"
                    )

        return Response(
            {
                "message": f"Image generation started in background for {scheduled} audience(s)"
            },
            status=status.HTTP_200_OK,
        )
