from rest_framework import viewsets  # Importa as classes de ViewSets do DRF.
from core.models import CategoryEvent, Events, Subscribe  # Importa os modelos usados pelas views.
from .serializers import CategorySerializer, EventSerializer, SubscribeSerializer  # Importa os serializers correspondentes.

class CategoryViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para CategoryEvent.
    queryset = CategoryEvent.objects.all()  # Define o conjunto de dados que será utilizado.
    serializer_class = CategorySerializer  # Define o serializer que converte os dados.

class EventViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para Events.
    queryset = Events.objects.all()  # Define o conjunto de dados da tabela Events.
    serializer_class = EventSerializer  # Define o serializer responsável pelos eventos.

class SubscribeViewSet(viewsets.ModelViewSet):  # Cria um ViewSet completo para Subscribe.
    queryset = Subscribe.objects.all()  # Define os registros que o ViewSet vai manipular.
    serializer_class = SubscribeSerializer  # Define o serializer que trata inscrições.
