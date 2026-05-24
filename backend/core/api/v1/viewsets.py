from rest_framework import viewsets, status
from rest_framework.response import Response
from core.models import CategoryEvent, Events, Subscribe
from core.permissions import IsAuthenticatedUser
from .serializers import CategorySerializer, EventSerializer, SubscribeSerializer

class CategoryViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para CategoryEvent.
    queryset = CategoryEvent.objects.all()
    serializer_class = CategorySerializer  # Define o serializer que converte os dados.
    permission_classes = [IsAuthenticatedUser]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset.order_by('name')

class EventViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para Events.
    queryset = Events.objects.all()
    serializer_class = EventSerializer  # Define o serializer responsável pelos eventos.
    permission_classes = [IsAuthenticatedUser]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')

        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset.order_by('title')

class SubscribeViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para Subscribe.
    queryset = Subscribe.objects.all()  # Adicionado queryset padrão para o DRF
    serializer_class = SubscribeSerializer  # Define o serializer que trata inscrições.
    permission_classes = [IsAuthenticatedUser]

    def get_queryset(self):
        return Subscribe.objects.filter(client=self.request.user).order_by("-created_at")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.client != request.user:
            return Response(
                {"detail": "Você não tem permissão para editar esta inscrição."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.client != request.user:
            return Response(
                {"detail": "Você não tem permissão para deletar esta inscrição."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
