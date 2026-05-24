"""
Permissões customizadas para o sistema de eventos.
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUser(BasePermission):
    """
    Permite acesso apenas se o usuário é admin.
    """
    message = "Você não tem permissão para realizar esta ação. Apenas administradores podem."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        # Verifica se o usuário tem um profile e se é admin
        if hasattr(request.user, 'profile'):
            return request.user.profile.is_admin
        return False


class IsAdminOrReadOnly(BasePermission):
    """
    Permite que qualquer usuário visualize (GET, HEAD, OPTIONS),
    mas apenas admins podem criar, editar ou deletar.
    """
    message = "Você não tem permissão para modificar este recurso. Apenas administradores podem."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        if not (request.user and request.user.is_authenticated):
            return False
        
        if request.user.is_superuser:
            return True
        
        # Verifica se o usuário tem um profile e se é admin
        if hasattr(request.user, 'profile'):
            return request.user.profile.is_admin
        return False


class IsAuthenticatedUser(BasePermission):
    """
    Permite acesso apenas para usuários autenticados.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
