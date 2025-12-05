from rest_framework import viewsets  #Importa as classes de ViewSets do DRF.
from core.models import CategoryEvent, Events, Subscribe  #Importa os modelos usados pelas views.
from .serializers import CategorySerializer, EventSerializer, SubscribeSerializer  #Importa os serializers correspondentes.
from rest_framework.permissions import IsAuthenticated #Importa os modelos do banco de dados.
from rest_framework_simplejwt.authentication import JWTAuthentication  #Importa os serializers.


class CategoryViewSet(viewsets.ModelViewSet):  #Cria um ViewSet completo para CategoryEvent.
    queryset = CategoryEvent.objects.all().order_by("id")  #Define o conjunto de dados que será utilizado.
    serializer_class = CategorySerializer  #Define o serializer que converte os dados.

    authentication_classes = [JWTAuthentication] #Exige token JWT para acessar a rota.
    permission_classes = [IsAuthenticated]  #Apenas usuários autenticados podem usar.

class EventViewSet(viewsets.ModelViewSet):  #Cria um ViewSet completo para Events.
    queryset = Events.objects.all().order_by("id") #Define o conjunto de dados da tabela Events.
    serializer_class = EventSerializer  #Define o serializer responsável pelos eventos.

    authentication_classes = [JWTAuthentication] #Exige token JWT para acessar a rota.
    permission_classes = [IsAuthenticated]  #Apenas usuários autenticados podem usar.

class SubscribeViewSet(viewsets.ModelViewSet):  #Cria um ViewSet completo para Subscribe.
    queryset = Subscribe.objects.all().order_by("id")  #Define os registros que o ViewSet vai manipular.
    serializer_class = SubscribeSerializer  #Define o serializer que trata inscrições.

    authentication_classes = [JWTAuthentication] #Exige token JWT para acessar a rota.
    permission_classes = [IsAuthenticated]  #Apenas usuários autenticados podem usar.
