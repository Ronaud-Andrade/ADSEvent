from django import forms
from .models import Events, Subscribe, CategoryEvent
from django.utils.timezone import now


class SubscribeForm(forms.ModelForm):
    """ Formulário simples para inscrição em eventos"""

    class Meta:
        model = Subscribe
        fields = ['events'] # Apenas o evento, pois o cliente vem do usuário logado

        widgets = {
            'events': forms.Select(attrs={
                'class': 'forms-control',
                'placeholder': 'sSelecione um evento'
            })
        }

        labels = {
            'events': 'Eventos',
        }

        error_messages = {
            'required': 'Por favor, selecione um evento.',
        }

        def __init__(self, *args, **kwargs):
            """
            Inicialização customizada do formulário
            Permite passar o usuário para validações
            """

            self.user = kwargs.pop('user', None)
            super().__init__(*args, **kwargs)

            # Filtrar apenas eventos futuros e ativos (não deletados)
            self.fields['events'].queryset = Events.objects.filter(
                is_deleted=False,
                date_time__gte=now()
            ).order_by('date_time')

            #Tornar o campo obrigatório explicimente
            self.fields['events'].required = True

        def clean_events(self):
            """
            Validação customizada do campo events
            """
            event = self.cleaned_data.get('events')

            if not event:
                raise forms.ValidationError('Você deve selecionar um evento.')
            
            if event.date_time < now():
                raise forms.ValidationError('Não é possível se inscrever em evento passados.')
            
            return event
        
        def clean(self):
            """
            Validação geral do formulário
            """

            cleaned_data = super().clean()
            event = cleaned_data.get('events')

            if event and self.user:
            # Verificar se o usuário já está inscrito
            if Subscribe.objects.is_client_subscribed(self.user, event):
                raise forms.ValidationError('Você já está inscrito neste evento.')
            
            # Verificar disponibilidade de vagas
            availability = Subscribe.objects.check_availability(event)
            if not availability['available']:
                raise forms.ValidationError(
                    f'Não há vagas disponíveis para este evento. '
                    f'({availability["subscribed"]}/{availability["total"]} vagas ocupadas)'
                )
        
            return cleaned_data
    
        def save(self, commit=True):
            """
            Salvar o formulário associando o cliente
            """
            instance = super().save(commit=False)
            
            if self.user:
                instance.client = self.user
            
            if commit:
                instance.save()
            
            return instance

