from django.db import transaction
from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from api.models import Audience, BrandInfo
from openai import OpenAI

from api.serializers.strategic_goals import StrategicGoalsSerializer

from api.repositories.brand_repository import BrandRepository
from api.repositories.audience_repository import AudienceRepository
from api.repositories.demographic_repository import DemographicRepository
from api.repositories.strategic_goal_repository import StrategicGoalRepository
from api.repositories.trigger_repository import TriggerRepository

from api.utils.exceptions import *

from api.tasks import generate_image


class AudienceService:
    client = OpenAI()
    client.api_key = settings.OPENAI_API_KEY

    @classmethod
    @transaction.atomic
    def create_batch_audiences(cls, brand_id):
        brand = BrandRepository.find_by_id(brand_id)
        brand_info = BrandInfo.objects.get(brand=brand)

        response = cls.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """
                        You are a seasoned strategic planner, inspired by industry legends like Jon Steel, Rosie Yakob, and Russell Davies.

                        You have extensive experience in analyzing brands and crafting positioning strategies with a sharp focus on consumer insights and and marker analysis.
                    """,
                },
                {
                    "role": "assistant",
                    "content": f"""
                        Considering {brand.name}'s,
                        {brand_info.about},
                        {brand_info.category},
                        {brand_info.key_characteristics} and
                        {brand_info.positioning}.
                    """,
                },
                {
                    "role": "user",
                    "content": f"""
                        Create 9 distinct audience segments for {brand.name} for the USA. For each audience, follow this exact structure:

                        Name: [Audience name]
                        Short Description: [2 sentences summarizing the audience's key traits, max 280 characters]
                        Image Prompt: [generate a prompt to be used in text to image software to create a thumbnail for each audience. Make sure it generates a low detailed image, Iconography and landscape oriented]

                        **Output Instructions**:
                        - Do not include introductions, explanations, or headers.
                        - Start directly with the first audience segment.
                        - Use plain text formatting (no bold, asterisks, or quotation marks).
                        - Avoid repeating any part of the user's input.
                        - Follow the structure strictly and consistently.
                    """,
                },
            ],
            max_tokens=2000,
            temperature=1,
            top_p=1,
        )

        content = response.choices[0].message.content

        content_list = content.split("Name:")
        audiences = []
        for i in range(1, len(content_list)):
            audience = content_list[i]
            if i < len(content_list) - 1:
                audience = audience[: audience.find("Name:")]
            audiences.append(audience.strip())

        for i, audience in enumerate(audiences):
            audience = audience.strip()
            sections = {
                "name": audience.split("Short Description:")[0].strip(),
                "short_description": audience.split("Short Description:")[1]
                .split("Image Prompt:")[0]
                .strip(),
                "image_prompt": audience.split("Image Prompt:")[1].strip(),
            }
            audience_obj = {
                "name": sections["name"],
                "description": sections["short_description"],
                "brand_id": brand_id,
                "image_prompt": sections["image_prompt"],
            }

            AudienceRepository.create_audience(audience_obj)

        return Response(
            {"content": "Audiences created successfully."}, status=status.HTTP_200_OK
        )

    @classmethod
    @transaction.atomic
    def create_batch_triggers(cls, audience_id, rerun=False):
        audience = AudienceRepository.find_by_id(audience_id)
        if not audience:
            raise NotFoundException(f"Audience with id {audience_id} not found.")

        brand = BrandRepository.find_by_id(audience.brand_id)
        brand_info = BrandInfo.objects.get(brand=brand)

        strategic_goals = StrategicGoalRepository.find_by_brand(
            brand_id=audience.brand_id
        )
        strategic_goals_serializer = StrategicGoalsSerializer(
            strategic_goals, many=True
        )

        if audience.triggers.count() >= 3:
            raise TriggerAlreadyCreatedException(
                f"Audience with id {audience_id} already has 3 triggers."
            )

        response = cls.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """
                        Imagine you are a seasoned strategic planner, inspired by industry legends like Jon Steel, Rosie Yakob, and Russell Davies. You have extensive experience in analyzing brands and crafting positioning strategies with a sharp focus on consumer insights and market analysis.

                        Your task is to create a text according to the instructions provided by the user. Always return only the edited content, without any introductions, preambles, or explanations. The output should strictly contain the updated text as per the instructions, and nothing else.
                        """,
                },
                {
                    "role": "assistant",
                    "content": f"""
                        Considering {brand.name},
                        {brand_info.about},
                        {brand_info.category},
                        {brand_info.key_characteristics},
                        {brand_info.positioning},
                        the audience {audience.name} described as {audience.description}.
                        Focus on the psychographics, attitudinal, self-concept and lifestyle.
                    """,
                },
                {
                    "role": "user",
                    "content": f"""
                        Create 3 very distinct and relevant message triggers for each {strategic_goals_serializer.data}. Pinpoint specific life events, emotions, or circumstances that move this audience towards the brand goals. These could range from seasonal needs to personal milestones.
                        For each trigger, describe the trigger and how it will motivate the specific audience.
                        Create an amazing title for it. But, if what moves that audience is the same as another audience, keep the same trigger name.
                        Create a scene description that best describes each trigger.
                        Also, bring the scene in prompt format to be used in a text to image GenAI.
                        For each trigger, follow this exact structure:

                        Title: [Trigger Title]
                        Description: [1 paragraph describing the trigger]
                        Image Prompt: [generate a prompt to be used in text to image GenAI to create a scene that best describes the trigger. Make sure it represents the trigger and its target audience. Generate a detailed image and landscape oriented, 16:9]

                        Output Instructions:
                        - Do not include introductions, explanations, or headers.
                        - Start directly with the first demographic detail.
                        - Use plain text formatting (no bold, asterisks, or quotation marks).
                        - Avoid repeating any part of the user's input.
                        - Follow the structure strictly and consistently.
                    """,
                },
            ],
            max_tokens=2000,
            temperature=1,
            top_p=1,
        )

        content = response.choices[0].message.content
        content_list = content.split("Title:")
        new_triggers = []
        for i in range(1, len(content_list)):
            trigger_text = content_list[i]
            if i < len(content_list) - 1:
                trigger_text = trigger_text[: trigger_text.find("Title:")]
            new_triggers.append(trigger_text.strip())

        parsed_triggers = []
        for trigger_text in new_triggers:
            sections = {
                "title": trigger_text.split("Description:")[0].strip(),
                "description": trigger_text.split("Description:")[1]
                .split("Image Prompt:")[0]
                .strip(),
                "image_prompt": trigger_text.split("Image Prompt:")[1].strip(),
            }
            parsed_triggers.append(sections)

        if rerun and audience.triggers.count() >= 3:
            # Se for rerun, atualize os triggers existentes
            existing_triggers = list(audience.triggers.order_by("id"))
            for i, sections in enumerate(parsed_triggers):
                if i < len(existing_triggers):
                    trigger_obj = existing_triggers[i]
                    trigger_obj.name = sections["title"]
                    trigger_obj.description = sections["description"]
                    trigger_obj.image_prompt = sections["image_prompt"]
                    trigger_obj.save()
                else:
                    TriggerRepository.create_trigger(
                        {
                            "name": sections["title"],
                            "description": sections["description"],
                            "audience": audience,
                            "image_prompt": sections["image_prompt"],
                        }
                    )
        else:
            # Caso não seja rerun e ainda não atinja o limite, crie os triggers
            for sections in parsed_triggers:
                TriggerRepository.create_trigger(
                    {
                        "name": sections["title"],
                        "description": sections["description"],
                        "audience": audience,
                        "image_prompt": sections["image_prompt"],
                    }
                )

            return Response(
                {"content": "Triggered successfully."},
                status=status.HTTP_200_OK,
            )

    @classmethod
    @transaction.atomic
    def analyze_audience(cls, audience_id: str) -> str:
        print(f"Analyzing audience {audience_id}...")
        audience = AudienceRepository.find_by_id(audience_id)
        if not audience:
            raise NotFoundException(f"Audience with id {audience_id} not found.")

        brand = BrandRepository.find_by_id(audience.brand_id)

        if all(
            [
                audience.psycho_graphic,
                audience.attitudinal,
                audience.self_concept,
                audience.lifestyle,
                audience.media_habits,
                audience.general_keywords,
                audience.brand_keywords,
            ]
        ):
            raise AudienceAlreadyAnalyzedException()

        response = cls.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """
                        You are a seasoned strategic planner, inspired by industry legends like Jon Steel, Rosie Yakob, and Russell Davies.

                        You have extensive experience in analyzing brands and crafting positioning strategies with a sharp focus on consumer insights and and marker analysis.

                        **Formatting Instructions**:
                        - Always include "Demographics:" as a header before the demographic details.
                        - Follow the exact structure provided in the user's input.
                        - Do not include any introductions, explanations, or additional headers beyond what is specified.
                        - Ensure consistency across all sections.
                        - Use plain text formatting (no bold, asterisks, or quotation marks).
                        - Avoid repeating any part of the user's input.
                    """,
                },
                {
                    "role": "assistant",
                    "content": f"""
                        Audience Name: {audience.name}
                        Short Description: {audience.description}
                    """,
                },
                {
                    "role": "user",
                    "content": f"""
                        Based on the audience information provided, generate a detailed analysis for the specified audience segment, following this exact structure:

                        Demographics:
                        - Gender: [ Gender of the audience ]
                        - Age Bracket: [18-24, 25-34, 35-44, 45-54, 55-64, 65+]
                        - HHI: [<75k, 75k-100k, 100k-150k, 150k-250k, >250k]
                        - Race: [e.g., White, Black, Hispanic, Asian, etc.]
                        - Education: [e.g., College Graduate, High School, etc.]
                        - Location: [e.g., Urban areas like NYC, LA, etc.]

                        Key Tags: [Provide 3 key tags that represent the audience]
                        Psychographics: [e.g., Value experiences over possessions, prioritize sustainability, etc.]
                        Attitudinal: [e.g., Open to innovation, driven by purpose, etc.]
                        Self-Concept: [e.g., Perceive themselves as trendsetters and eco-conscious individuals, etc.]
                        Lifestyle: [e.g., Prefer outdoor activities, enjoy premium and sustainable products, etc.]
                        Media Habits: [e.g., High engagement with TikTok and Instagram, prefer visual content, etc.]
                        General Audience Keywords: [Provide 10 keywords that represent the audience]
                        Brand Audience Keywords: [Provide 10 keywords that represent the audience with {brand.name}]

                        **Output Instructions**:
                        - Do not include introductions, explanations, or headers.
                        - Start directly with the first demographic detail.
                        - Use plain text formatting (no bold, asterisks, or quotation marks).
                        - Avoid repeating any part of the user's input.
                        - Follow the structure strictly and consistently.
                    """,
                },
            ],
            max_tokens=2000,
            temperature=1,
            top_p=1,
        )

        content = response.choices[0].message.content

        sections = {
            "demographics": content.split("Demographics:")[1]
            .split("Key Tags:")[0]
            .strip(),
            "key_tags": content.split("Key Tags:")[1]
            .split("Psychographics:")[0]
            .strip(),
            "psychographics": content.split("Psychographics:")[1]
            .split("Attitudinal:")[0]
            .strip(),
            "attitudinal": content.split("Attitudinal:")[1]
            .split("Self-Concept:")[0]
            .strip(),
            "self_concept": content.split("Self-Concept:")[1]
            .split("Lifestyle:")[0]
            .strip(),
            "lifestyle": content.split("Lifestyle:")[1]
            .split("Media Habits:")[0]
            .strip(),
            "media_habits": content.split("Media Habits:")[1]
            .split("General Audience Keywords:")[0]
            .strip(),
            "general_keywords": content.split("General Audience Keywords:")[1]
            .split("Brand Audience Keywords:")[0]
            .strip(),
            "brand_keywords": content.split("Brand Audience Keywords:")[1].strip(),
        }

        demographics_lines = sections["demographics"].split("\n")
        demographics = {}
        for line in demographics_lines:
            key_value = line.split(":")
            if len(key_value) == 2:
                key = key_value[0].lstrip("- ").strip().lower()
                value = key_value[1].strip()
                demographics[key] = value

        audience_obj = {
            "key_tags": sections["key_tags"],
            "psycho_graphic": sections["psychographics"],
            "attitudinal": sections["attitudinal"],
            "self_concept": sections["self_concept"],
            "lifestyle": sections["lifestyle"],
            "media_habits": sections["media_habits"],
            "general_keywords": sections["general_keywords"],
            "brand_keywords": sections["brand_keywords"],
        }

        demographics_obj = {
            "gender": demographics["gender"],
            "age_bracket": demographics["age bracket"],
            "hhi": demographics["hhi"],
            "race": demographics["race"],
            "education": demographics["education"],
            "location": demographics["location"],
            "audience": audience,
        }

        AudienceRepository.update_audience(audience_id, audience_obj)

        DemographicRepository.create_demographic(demographics_obj)

        return Response(
            {"content": "Audience updated successfully."}, status=status.HTTP_200_OK
        )
