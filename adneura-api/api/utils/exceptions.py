from rest_framework.exceptions import APIException
from rest_framework import status


class NotFoundException(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "Resource not found."
    default_code = "not_found"

    def __init__(self, detail=default_detail, code=default_code):
        super().__init__(detail=detail, code=code)


class AudienceAlreadyAnalyzedException(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "Audience already analyzed."
    default_code = "audience_already_analyzed"

    def __init__(self, detail=default_detail, code=default_code):
        super().__init__(detail=detail, code=code)


class UnprocessedEntityException(APIException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = "Resource not processed."
    default_code = "resource_not_processed"

    def __init__(self, detail=default_detail, code=default_code):
        super().__init__(detail=detail, code=code)


class TriggerAlreadyCreatedException(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "Trigger already created."
    default_code = "trigger_already_created"

    def __init__(self, detail=default_detail, code=default_code):
        super().__init__(detail=detail, code=code)
