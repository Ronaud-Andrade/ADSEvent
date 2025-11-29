from rest_framework.routers import DefaultRouter  # Importa o roteador padrão do DRF.
from .viewsets import CategoryViewSet, EventViewSet, SubscribeViewSet  # Importa os ViewSets da aplicação.

router = DefaultRouter()  # Cria uma instância do roteador.

router.register(r'categories', CategoryViewSet)  # Registra as rotas para categorias.
router.register(r'events', EventViewSet)        # Registra as rotas para eventos.
router.register(r'subscribes', SubscribeViewSet)  # Registra as rotas para inscrições.

urlpatterns = router.urls  # Define as URLs geradas automaticamente pelo router.
