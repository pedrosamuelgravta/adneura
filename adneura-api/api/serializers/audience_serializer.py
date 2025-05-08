from rest_framework import serializers
from api.models import Audience
from api.serializers.trigger_serializer import TriggerSerializer
from api.serializers.demographics_serializer import DemographicsSerializer


class AudienceSerializer(serializers.ModelSerializer):
    triggers = TriggerSerializer(many=True)
    demographics = DemographicsSerializer()

    class Meta:
        model = Audience
        fields = "__all__"

    def update(self, instance, validated_data):

        triggers_data = validated_data.pop("triggers", [])
        demographics_data = validated_data.pop("demographics", None)
        print("triggers_data", triggers_data)
        print(instance)
        audience = super().update(instance, validated_data)

        if demographics_data:
            demographic = audience.demographics
            for attr, value in demographics_data.items():
                if hasattr(demographic, attr):
                    setattr(demographic, attr, value)
            demographic.save()

        if triggers_data is not None:
            existing = {t.id: t for t in audience.triggers.all()}
            sent_ids = []

            for trig in triggers_data:
                trig_id = trig.get("id", None)
                if trig_id and trig_id in existing:
                    # update
                    obj = existing[trig_id]
                    for attr, value in trig.items():
                        if attr == "id":
                            continue
                        setattr(obj, attr, value)
                    obj.save()
                    sent_ids.append(trig_id)

        return audience


class AudiencesFilteredSerializer(serializers.ModelSerializer):
    triggers = TriggerSerializer(many=True)
    demographics = DemographicsSerializer()

    class Meta:
        model = Audience
        fields = [
            "triggers",
            "demographics",
            "name",
            "description",
            "key_tags",
            "psycho_graphic",
            "attitudinal",
            "self_concept",
            "lifestyle",
            "media_habits",
            "general_keywords",
            "brand_keywords",
            "id",
        ]


class AnalyzeAudienceSerializer(serializers.Serializer):
    audience_id = serializers.IntegerField(required=True)


class AnalyzeBrandSerializer(serializers.Serializer):
    brand_id = serializers.IntegerField(required=True)
