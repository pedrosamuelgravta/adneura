from drf_yasg.utils import swagger_auto_schema

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from api.serializers.user_serializer import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
)
from drf_yasg import openapi


class RegisterUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class LoginUserView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @swagger_auto_schema(
        request_body=LoginSerializer,
        operation_description="Endpoint for user login. Accepts email and password, and returns tokens upon successful authentication.",
        responses={
            200: "Access Token",
            400: "Bad Request - Invalid or missing credentials",
            401: "Unauthorized - Invalid credentials",
            404: "Not Found - User not found",
        },
    )
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        user = authenticate(username=user.username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            return Response(
                {
                    "user": {
                        "id": user_serializer.data["id"],
                        "email": user_serializer.data["email"],
                    },
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED
            )
