from rest_framework import viewsets, status  # Importa as classes de ViewSets do DRF.
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from core.models import CategoryEvent, Events, Subscribe  # Importa os modelos usados pelas views.
from .serializers import CategorySerializer, EventSerializer, SubscribeSerializer  # Importa os serializers correspondentes.
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING


class IsAdminOrReadOnly(BasePermission):
    """Permissão customizada: autenticação para leitura e admin para escrita."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return hasattr(request.user, 'profile') and request.user.profile.is_admin


class IsAuthenticatedUser(BasePermission):
    """Permissão customizada para usuários autenticados."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

if TYPE_CHECKING:
    from django.http import HttpRequest


# PADRÃO STRATEGY (Comportamental)                       
# INÍCIO                                                                                                                #
# Problema: Múltiplas estratégias de permissão acopladas aos ViewSets          
# Solução: Encapsular em classes Strategy reutilizáveis                          
# Benefício: Permissões separadas da lógica de negócio, fácil de estender      


class PermissionStrategy(ABC):
    """
    Interface abstrata para diferentes estratégias de permissão.
    
    Problema resolvido:
    - Antes: Estratégias AdminOnly e OwnerOrAdmin estavam acopladas aos ViewSets
    - Depois: Estratégias são classes separadas, reutilizáveis e intercambiáveis
    
    Benefícios:
    - Separa lógica de permissão da lógica de negócio
    - Fácil adicionar novas estratégias (ex: ModeratorStrategy)
    - Cada estratégia pode ser testada isoladamente
    - Permite mudar estratégia em tempo de execução
    """
    
    @abstractmethod
    def can_create(self, request: 'HttpRequest') -> bool:
        """Determina se o usuário pode criar novo registro"""
        pass
    
    @abstractmethod
    def can_update(self, request: 'HttpRequest', instance=None) -> bool:
        """Determina se o usuário pode atualizar um registro"""
        pass
    
    @abstractmethod
    def can_delete(self, request: 'HttpRequest', instance=None) -> bool:
        """Determina se o usuário pode deletar um registro"""
        pass
    
    @abstractmethod
    def can_list(self, request: 'HttpRequest') -> bool:
        """Determina se o usuário pode listar registros"""
        pass
    
    @abstractmethod
    def filter_queryset(self, request: 'HttpRequest', queryset):
        """Filtra queryset baseado na estratégia de permissão"""
        pass


class AdminOnlyStrategy(PermissionStrategy):
    """
    Estratégia: Apenas administradores têm todas as permissões.
    
    Usado em: CategoryViewSet, EventViewSet
    Regras:
    - Usuários autenticados podem listar e visualizar
    - Apenas admins podem criar, atualizar ou deletar
    """
    
    def _is_admin(self, request):
        """Helper para verificar se o usuário é admin"""
        return hasattr(request.user, 'profile') and request.user.profile.is_admin
    
    def can_create(self, request):
        """Apenas admin pode criar"""
        return self._is_admin(request)
    
    def can_update(self, request, instance=None):
        """Apenas admin pode atualizar"""
        return self._is_admin(request)
    
    def can_delete(self, request, instance=None):
        """Apenas admin pode deletar"""
        return self._is_admin(request)
    
    def can_list(self, request):
        """Usuários autenticados podem listar"""
        return request.user and request.user.is_authenticated
    
    def filter_queryset(self, request, queryset):
        """Retorna todos os registros (admin vê tudo, users autenticados veem tudo)"""
        return queryset


class OwnerOrAdminStrategy(PermissionStrategy):
    """
    Estratégia: Admin vê e faz tudo. Usuário comum vê e faz apenas seus próprios dados.
    
    Usado em: SubscribeViewSet
    Regras:
    - Qualquer usuário autenticado pode criar
    - Admin pode editar/deletar qualquer inscrição
    - Usuário comum pode editar/deletar apenas suas inscrições
    - Admin vê todas as inscrições
    - Usuário comum vê apenas suas inscrições
    """
    
    def _is_admin(self, request):
        """Helper para verificar se o usuário é admin"""
        return hasattr(request.user, 'profile') and request.user.profile.is_admin
    
    def can_create(self, request):
        """Qualquer usuário autenticado pode criar"""
        return request.user and request.user.is_authenticated
    
    def can_update(self, request, instance=None):
        """Admin pode atualizar tudo. Usuário comum apenas suas inscrições"""
        if self._is_admin(request):
            return True
        # Usuário comum só pode atualizar se for o dono
        return instance and hasattr(instance, 'client') and instance.client == request.user
    
    def can_delete(self, request, instance=None):
        """Admin pode deletar tudo. Usuário comum apenas suas inscrições"""
        if self._is_admin(request):
            return True
        # Usuário comum só pode deletar se for o dono
        return instance and hasattr(instance, 'client') and instance.client == request.user
    
    def can_list(self, request):
        """Qualquer usuário autenticado pode listar"""
        return request.user and request.user.is_authenticated
    
    def filter_queryset(self, request, queryset):
        """Admin vê tudo. Usuário comum vê apenas suas inscrições"""
        if self._is_admin(request):
            return queryset
        # Filtra apenas inscrições do usuário comum
        return queryset.filter(client=request.user)

#################################################################################
#                      ✅ PADRÃO STRATEGY - FIM                                 #
#################################################################################


#################################################################################
#                     ✅ PADRÃO FACTORY (Criacional)                            #
#                                  INÍCIO                                       #
#                                                                               #
# Problema: CategoryViewSet, EventViewSet duplicam lógica de permissão         #
# Solução: Factory cria ViewSets configurados automaticamente                   #
# Benefício: Elimina duplicação, centraliza lógica, fácil manutenção            #
#                                                                               #
#################################################################################


class PermissionCheckMixin:
    """
    Mixin que centraliza a lógica de verificação de permissões.
    Solução para o problema: duplicação do método _is_admin() em múltiplos ViewSets.
    """
    
    def _is_admin(self, request):
        """Verifica se o usuário autenticado é admin"""
        if hasattr(request.user, 'profile'):
            return request.user.profile.is_admin
        return False
    
    def _check_admin_permission(self, request):
        """Helper para verificar e retornar booleano se tem permissão de admin"""
        return self._is_admin(request)


class AdminRestrictedViewSet(PermissionCheckMixin, viewsets.ModelViewSet):
    """
    ViewSet base que restringe create, update, destroy apenas a usuários admin.
    Este é o padrão comum em CategoryViewSet e EventViewSet.
    """
    
    def create(self, request, *args, **kwargs):
        """Apenas admins podem criar"""
        if not self._check_admin_permission(request):
            return self._forbidden_response("criar")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Apenas admins podem editar"""
        if not self._check_admin_permission(request):
            return self._forbidden_response("editar")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Apenas admins podem deletar"""
        if not self._check_admin_permission(request):
            return self._forbidden_response("deletar")
        return super().destroy(request, *args, **kwargs)
    
    def _forbidden_response(self, action):
        """Cria resposta padronizada de acesso negado"""
        return Response(
            {"detail": f"Você não tem permissão para {action}. Apenas administradores podem."},
            status=status.HTTP_403_FORBIDDEN
        )


class ViewSetFactory:
    """
    Factory para criar ViewSets com lógica de permissão pré-configurada.
    
    Problema resolvido:
    - Antes: CategoryViewSet, EventViewSet duplicavam código idêntico
    - Depois: Factory cria ViewSets padronizados sem duplicação
    
    Benefícios:
    - Elimina duplicação de código
    - Centraliza lógica de permissão
    - Facilita manutenção: mudança em um lugar afeta todos os ViewSets
    - Permite criar novos ViewSets sem repetir lógica
    """
    
    @staticmethod
    def create_admin_only_viewset(model_class, serializer_class, queryset=None):
        """
        Factory method que cria um ViewSet com restrição AdminOnly.
        
        Args:
            model_class: Classe do modelo Django (ex: CategoryEvent)
            serializer_class: Classe do serializer (ex: CategorySerializer)
            queryset: QuerySet personalizado (opcional)
        
        Returns:
            Classe ViewSet configurada e pronta para uso
        """
        
        class AdminOnlyViewSet(AdminRestrictedViewSet):
            serializer_class = serializer_class
            permission_classes = [IsAdminOrReadOnly]
            
            # Se queryset não foi fornecido, usa o padrão
            if queryset is None:
                queryset = model_class.objects.all().order_by("id")
            else:
                queryset = queryset
        
        # Define um nome único para a classe (útil para debugging)
        AdminOnlyViewSet.__name__ = f'{model_class.__name__}ViewSet'
        return AdminOnlyViewSet

#################################################################################
#                       ✅ PADRÃO FACTORY - FIM                                 #
#################################################################################


#################################################################################
#                                                                               #
#  VIEWSETS CRIADOS PELA FACTORY (Padrão Factory - Uso Prático)                #
#                                                                               #
#  Estes ViewSets foram criados usando a Factory para eliminar duplicação      #
#  de código. Antes, CategoryViewSet e EventViewSet tinham ~80 linhas de       #
#  código duplicado. Agora são criados dinamicamente pela Factory.             #
#                                                                               #
#################################################################################

# CategoryViewSet - CRIADO PELA FACTORY
# ANTES: 40 linhas de código com lógica duplicada
# DEPOIS: Uma única linha criada pela Factory
CategoryViewSet = ViewSetFactory.create_admin_only_viewset(
    CategoryEvent,
    CategorySerializer,
    queryset=CategoryEvent.objects.all().order_by("id")
)

# EventViewSet - CRIADO PELA FACTORY
# ANTES: 40 linhas de código com lógica duplicada
# DEPOIS: Uma única linha criada pela Factory
EventViewSet = ViewSetFactory.create_admin_only_viewset(
    Events,
    EventSerializer,
    queryset=Events.objects.all().order_by("-created_at")
)

#################################################################################
#                                                                               #
#  FIM DOS VIEWSETS CRIADOS PELA FACTORY                                       #
#                                                                               #
#################################################################################


# ==================== PADRÃO STRATEGY EM VIEWSETS ====================

class StrategyBasedViewSet(viewsets.ModelViewSet):
    """
    ViewSet base que usa Strategy para determinar permissões.
    
    Problema resolvido:
    - Antes: SubscribeViewSet implementava sua própria lógica de OwnerOrAdmin
    - Depois: Usa OwnerOrAdminStrategy que é reutilizável
    
    Benefícios:
    - Separa lógica de permissão da lógica de ViewSet
    - Fácil testar estratégias isoladamente
    - Fácil adicionar novas estratégias sem modificar ViewSet
    - Estratégia pode ser mudada em tempo de execução se necessário
    """
    
    permission_strategy = None  # Deve ser atribuído nas subclasses
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Se nenhuma estratégia foi definida, usa AdminOnlyStrategy como padrão
        if self.permission_strategy is None:
            self.permission_strategy = AdminOnlyStrategy()
    
    def create(self, request, *args, **kwargs):
        """Delega decisão de criar para a estratégia"""
        if not self.permission_strategy.can_create(request):
            return Response(
                {"detail": "Você não tem permissão para criar."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """Delega decisão de atualizar para a estratégia"""
        instance = self.get_object()
        if not self.permission_strategy.can_update(request, instance):
            return Response(
                {"detail": "Você não tem permissão para atualizar."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        """Delega decisão de atualização parcial para a estratégia"""
        instance = self.get_object()
        if not self.permission_strategy.can_update(request, instance):
            return Response(
                {"detail": "Você não tem permissão para atualizar."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Delega decisão de deletar para a estratégia"""
        instance = self.get_object()
        if not self.permission_strategy.can_delete(request, instance):
            return Response(
                {"detail": "Você não tem permissão para deletar."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        """Delega decisão de listar para a estratégia"""
        if not self.permission_strategy.can_list(request):
            return Response(
                {"detail": "Você não tem permissão para listar."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        """Delega filtragem de queryset para a estratégia"""
        return self.permission_strategy.filter_queryset(
            self.request,
            self.queryset
        )


#################################################################################
#                 ✅ PADRÃO STRATEGY - IMPLEMENTAÇÃO EM VIEWSETS                #
#                                  INÍCIO                                       #
#                                                                               #
# StrategyBasedViewSet usa Strategy para determinar permissões dinamicamente   #
# Cada subclass define qual estratégia usar (AdminOnly, OwnerOrAdmin, etc)     #
#                                                                               #
#################################################################################


class SubscribeViewSet(StrategyBasedViewSet):
    """
    ViewSet para inscrições usando padrão Strategy.
    
    ANTES (código acoplado):
    - Lógica de OwnerOrAdmin estava embutida no ViewSet
    - Difícil de testar
    
    DEPOIS (com Strategy):
    - Usa OwnerOrAdminStrategy
    - ViewSet focado na lógica de negócio
    - Strategy pode ser testada isoladamente
    - Fácil trocar para AdminOnlyStrategy se necessário
    """
    
    queryset = Subscribe.objects.all()
    serializer_class = SubscribeSerializer
    permission_classes = [IsAuthenticatedUser]
    
    # Usa a estratégia OwnerOrAdmin: admin vê/faz tudo, user comum vê/faz só suas inscrições
    permission_strategy = OwnerOrAdminStrategy()
    
    def create(self, request, *args, **kwargs):
        """
        Usuários comuns podem criar inscrição apenas para si mesmos.
        Admins podem criar para qualquer usuário.
        """
        if not self.permission_strategy._is_admin(request):
            # Usuário comum: força client como ele mesmo
            request.data['client'] = request.user.id
        
        # Delega verificação de permissão para a estratégia
        return super().create(request, *args, **kwargs)

#################################################################################
#                    ✅ PADRÃO STRATEGY - IMPLEMENTAÇÃO - FIM                   #
#################################################################################
