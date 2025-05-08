from ..models.trigger import Trigger


class TriggerRepository:

    @staticmethod
    def find_by_audience(audience_id):
        return Trigger.objects.filter(audience_id=audience_id).order_by("id")

    @staticmethod
    def find_by_id(trigger_id):
        return Trigger.objects.filter(id=trigger_id).first()

    @staticmethod
    def create_trigger(trigger_data):
        return Trigger.objects.create(**trigger_data)

    @staticmethod
    def update_trigger(trigger_id, trigger_data):
        return Trigger.objects.filter(id=trigger_id).update(**trigger_data)
