from django import forms
from .models import CategoryEvent, Events, Subscribe

# Formulário para Categoria de Evento
class CategoryForm(forms.ModelForm):
    class Meta:
        model = CategoryEvent
        fields = ['name']  # campos visíveis no formulário

# Formulário para Evento
class EventForm(forms.ModelForm):
    class Meta:
        model = Events
        fields = ['date_time', 'title', 'vagas', 'descriptions', 'local', 'category']

# Formulário para Inscrição (Subscribe)
class SubscribeForm(forms.ModelForm):
    class Meta:
        model = Subscribe
        fields = ['client', 'events']
