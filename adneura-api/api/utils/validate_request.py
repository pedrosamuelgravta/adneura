from rest_framework.serializers import Serializer
from rest_framework.request import Request
from rest_framework.exceptions import APIException
from api.utils.exceptions import UnprocessedEntityException


def validate_request(
    serializer: type[Serializer],
    request: Request,
    exception_class: type[APIException] = UnprocessedEntityException,
) -> Serializer:
    serializer = serializer(data=request.data)
    if not serializer.is_valid():
        raise exception_class(serializer.errors)

    return serializer.validated_data
