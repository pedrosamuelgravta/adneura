from ..models.strategic_goals import StrategicGoals


class StrategicGoalRepository:

    @staticmethod
    def find_by_brand(brand_id):
        return StrategicGoals.objects.filter(brand_id=brand_id).order_by("id")

    @staticmethod
    def find_by_id(strategic_goal_id):
        return StrategicGoals.objects.filter(id=strategic_goal_id).first()
