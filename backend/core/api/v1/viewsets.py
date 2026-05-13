from rest_framework import viewsets, status  # Importa as classes de ViewSets do DRF.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from core.models import CategoryEvent, Events, Subscribe  # Importa os modelos usados pelas views.
from core.permissions import IsAdminOrReadOnly, IsAuthenticatedUser  # Importa as permissões customizadas.
from .serializers import CategorySerializer, EventSerializer, SubscribeSerializer  # Importa os serializers correspondentes.

class CategoryViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para CategoryEvent.
    queryset = CategoryEvent.objects.all().order_by("id")  # Define o conjunto de dados que será utilizado.
    serializer_class = CategorySerializer  # Define o serializer que converte os dados.
    permission_classes = [IsAdminOrReadOnly]  # Apenas admins podem criar, editar, deletar

    def create(self, request, *args, **kwargs):
        """Apenas admins podem criar categorias"""
        if not self._is_admin(request):
            return Response(
                {"detail": "Você não tem permissão para criar categorias. Apenas administradores podem."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Apenas admins podem editar categorias"""
        if not self._is_admin(request):
            return Response(
                {"detail": "Você não tem permissão para editar categorias. Apenas administradores podem."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Apenas admins podem deletar categorias"""
        if not self._is_admin(request):
            return Response(
                {"detail": "Você não tem permissão para deletar categorias. Apenas administradores podem."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    def _is_admin(self, request):
        """Helper para verificar se o usuário é admin"""
        if hasattr(request.user, 'profile'):
            return request.user.profile.is_admin
        return False

class EventViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para Events.
    queryset = Events.objects.all().order_by("-created_at") # Define o conjunto de dados da tabela Events.
    serializer_class = EventSerializer  # Define o serializer responsável pelos eventos.
    permission_classes = [IsAdminOrReadOnly]  # Apenas admins podem criar, editar, deletar

    def create(self, request, *args, **kwargs):
        """Apenas admins podem criar eventos"""
        if not self._is_admin(request):
            return Response(
                {"detail": "Você não tem permissão para criar eventos. Apenas administradores podem."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Apenas admins podem editar eventos"""
        if not self._is_admin(request):
            return Response(
                {"detail": "Você não tem permissão para editar eventos. Apenas administradores podem."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Apenas admins podem deletar eventos"""
        if not self._is_admin(request):
            return Response(
                {"detail": "Você não tem permissão para deletar eventos. Apenas administradores podem."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    def _is_admin(self, request):
        """Helper para verificar se o usuário é admin"""
        if hasattr(request.user, 'profile'):
            return request.user.profile.is_admin
        return False

class SubscribeViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para Subscribe.
    queryset = Subscribe.objects.all()  # Adicionado queryset padrão para o DRF
    serializer_class = SubscribeSerializer  # Define o serializer que trata inscrições.
    permission_classes = [IsAuthenticatedUser]

    def get_queryset(self):
        return Subscribe.objects.filter(client=self.request.user).order_by("-created_at")
