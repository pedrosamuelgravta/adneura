from ..models.demographics import Demographics


class DemographicRepository:

    @staticmethod
    def find_by_audience(audience_id):
        return Demographics.objects.filter(audience_id=audience_id).first()

    @staticmethod
    def create_demographic(demographic_data):
        return Demographics.objects.create(**demographic_data)
