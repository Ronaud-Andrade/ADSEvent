from rest_framework import serializers  # Importa o módulo de serializers do DRF.
from core.models import CategoryEvent, Events, Subscribe  # Importa os modelos que serão serializados.
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class CategorySerializer(serializers.ModelSerializer):  # Cria um serializer baseado no modelo CategoryEvent.
    class Meta:  # Define configurações internas do serializer.
        model = CategoryEvent  # Indica qual modelo o serializer representa.
        fields = '__all__'  # No caso de categoria, só vai ser pego um campo.

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class EventSerializer(serializers.ModelSerializer):  # Cria um serializer para o modelo Events.
    category = CategorySerializer(many=True, read_only=True)  # Inclui os dados completos das categorias
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=CategoryEvent.objects.all(),
        write_only=True,
        many=True,
        source='category'
    )
    class Meta:  # Configurações internas do serializer.
        model = Events  # Modelo vinculado ao serializer.
        fields = ['id', 'title', 'descriptions', 'date_time', 'vagas', 'local', 'category', 'category_ids', 'created_at', 'updated_at', 'deleted_at', 'is_deleted']

class SubscribeSerializer(serializers.ModelSerializer):  # Cria um serializer para o modelo Subscribe.
    events = EventSerializer(read_only=True)  # Inclui os dados completos do evento
    events_id = serializers.PrimaryKeyRelatedField(
        queryset=Events.objects.all(),
        write_only=True,
        source='events'
    )
    client = UserSerializer(read_only=True)  # Inclui os dados do cliente
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='client',
        required=False
    )

    class Meta:  # Configurações internas do serializer.
        model = Subscribe  # Define o modelo usado.
        fields = ['id', 'client', 'client_id', 'events', 'events_id', 'active', 'created_at', 'updated_at']  # Campos específicos
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']  # Campos que não podem ser definidos na criação

    def create(self, validated_data):
        # Se client não foi fornecido, define como o usuário autenticado
        if 'client' not in validated_data:
            validated_data['client'] = self.context['request'].user
        return super().create(validated_data)

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
