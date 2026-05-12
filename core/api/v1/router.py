from rest_framework.routers import DefaultRouter  # Importa o roteador padrão do DRF.
from .viewsets import CategoryViewSet, EventViewSet, SubscribeViewSet  # Importa os ViewSets da aplicação.
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()  # Cria uma instância do roteador.

router.register(r'categories', CategoryViewSet)  # Registra as rotas para categorias.
router.register(r'events', EventViewSet)        # Registra as rotas para eventos.
router.register(r'subscribes', SubscribeViewSet)  # Registra as rotas para inscrições.

urlpatterns = router.urls + [
    path('auth/login/', views.login_view, name='api_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', views.logout_view, name='api_logout'),
    path('auth/user/', views.user_view, name='api_user'),
]
