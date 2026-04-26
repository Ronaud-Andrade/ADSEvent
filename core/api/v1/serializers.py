from rest_framework import serializers  # Importa o módulo de serializers do DRF.
from core.models import CategoryEvent, Events, Subscribe  # Importa os modelos que serão serializados.
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class CategorySerializer(serializers.ModelSerializer):  # Cria um serializer baseado no modelo CategoryEvent.
    class Meta:  # Define configurações internas do serializer.
        model = CategoryEvent  # Indica qual modelo o serializer representa.
        fields = '__all__'  # No caso de categoria, só vai ser pego um campo.

class EventSerializer(serializers.ModelSerializer):  # Cria um serializer para o modelo Events.
    class Meta:  # Configurações internas do serializer.
        model = Events  # Modelo vinculado ao serializer.
        fields = '__all__'  # Usa todos os campos do modelo.

class SubscribeSerializer(serializers.ModelSerializer):  # Cria um serializer para o modelo Subscribe.
    class Meta:  # Configurações internas do serializer.
        model = Subscribe  # Define o modelo usado.
        fields = '__all__'  # Inclui todos os campos automaticamente.

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include username and password.')
        return data
