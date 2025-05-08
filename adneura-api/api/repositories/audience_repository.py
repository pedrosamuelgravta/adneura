from ..models.audience import Audience


class AudienceRepository:

    @staticmethod
    def find_by_brand(brand_id):
        return Audience.objects.filter(brand_id=brand_id).order_by("id")

    @staticmethod
    def find_by_id(audience_id):
        return Audience.objects.filter(id=audience_id).first()

    @staticmethod
    def create_audience(audience_data):
        return Audience.objects.create(**audience_data)

    @staticmethod
    def update_audience(audience_id, audience_data):
        return Audience.objects.filter(id=audience_id).update(**audience_data)
