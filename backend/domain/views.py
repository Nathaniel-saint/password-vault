from .models import Domain
from .serializers import DomainSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwner
from rest_framework import viewsets, status
from rest_framework.response import Response
# Create your views here.

class DomainView(viewsets.ModelViewSet):
    queryset = Domain.objects.all()
    serializer_class = DomainSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = 'pk'

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    def get_queryset(self):
        user = self.request.user
        return Domain.objects.filter(user = user)

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        self.perform_destroy(instance)

        return Response(
            {'message': 'credential deleted successful', 
            'success': True
            },
            status=status.HTTP_200_OK)