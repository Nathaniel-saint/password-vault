from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import viewsets

# Create your views here.

class CreateUser(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
