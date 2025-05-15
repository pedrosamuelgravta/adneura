import os
import requests
import time
from celery import shared_task
from django.conf import settings
from openai import OpenAI
from api.models import Trigger, Audience
import base64
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


@shared_task
def generate_image(text, file_name, table_name, id):
    client = OpenAI()
    client.api_key = settings.OPENAI_API_KEY
    logger.info(f"Entrou na task: {file_name}")
    retries = 5
    image_bytes = None
    response_img = None
    for _ in range(retries):
        try:
            logger.info(f"Iniciando geração da img→ {file_name}")
            start_time = time.time()
            response = client.images.generate(
                model="gpt-image-1",
                prompt=text,
                size="1536x1024",
                n=1,
            )
            end_time = time.time()

            duration = end_time - start_time
            logger.info(f"Geração levou {duration:.2f}s para img {file_name}")
            image_bytes = base64.b64decode(response.data[0].b64_json)
            response_img = response.data[0]
            logger.info(image_bytes)
            break

        except Exception as e:
            error_message = str(e)
            headers = getattr(e, "headers", {})
            logger.info(headers)
            if "rate_limit_exceeded" in error_message or "429" in error_message:

                reset_time = headers.get("x-ratelimit-reset-requests", "60")

                time.sleep(int(reset_time))
            else:
                logger.info(f"Erro inesperado: {error_message}")
                raise e

    if not image_bytes:
        logger.info(
            f"Falha ao gerar a imagem para o {file_name} após várias tentativas. Response da API: {response_img}"
        )
        return

    output_folder = "./images/"
    output_file = f"{file_name}"
    os.makedirs(output_folder, exist_ok=True)
    file_path = os.path.join(output_folder, output_file)
    logger.info(file_path)
    print(file_path)
    try:
        with open(file_path, "wb") as file:
            print(f"Salvando imagem em {file_path}")
            file.write(image_bytes)
        if table_name == "audience":
            Audience.objects.filter(id=id).update(audience_img=file_name)
        else:
            Trigger.objects.filter(id=id).update(trigger_img=file_name)

    except Exception as e:
        logger.info(f"Erro ao salvar a imagem {file_name}: {e}")
