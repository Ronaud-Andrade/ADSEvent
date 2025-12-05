from rest_framework import serializers  #Importa o módulo de serializers do DRF.
from core.models import CategoryEvent, Events, Subscribe  #Importa os modelos que serão serializados.

class CategorySerializer(serializers.ModelSerializer):  #Cria um serializer baseado no modelo CategoryEvent.
    class Meta:  #Define configurações internas do serializer.
        model = CategoryEvent  #Indica qual modelo o serializer representa.
        fields = '__all__'  #No caso de categoria, só vai ser pego um campo.

class EventSerializer(serializers.ModelSerializer):  #Cria um serializer para o modelo Events.
    class Meta:  #Configurações internas do serializer.
        model = Events  #Modelo vinculado ao serializer.
        fields = '__all__'  #Usa todos os campos do modelo.

class SubscribeSerializer(serializers.ModelSerializer):  #Cria um serializer para o modelo Subscribe.
    class Meta:  #Configurações internas do serializer.
        model = Subscribe  #Define o modelo usado.
        fields = '__all__'  #Inclui todos os campos automaticamente.
