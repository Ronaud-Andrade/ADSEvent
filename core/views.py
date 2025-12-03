from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import CategoryEvent, Events, Subscribe
from .forms import CategoryForm, EventForm, SubscribeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import gettext_lazy as _ #marque strings para o I18N
from .mixins import NotSuperUserMixin
import logging



# Create your views here.



# class InscritionsViewer(LoginRequiredMixin, CreateView):
#     model = Inscritions
#     fields = []

#     def form_valid(self, form):

#         #Aqui ele está preenchendo manualmente os campos antes de salvar no banco

#         form.instance.client = self.request.user 
#         form.instance.code = self.kwargs['pk']

#         return super().form_valid(form) #pra salvar no banco e continuar o fluxo normal
    
#     def get_success_url(self): #Depois que a inscrição é criada com sucesso, o Django redireciona pra essa URL.
#         return reverse_lazy('eventos:list') #busca o caminho da rota nomeada
    
# class IndexView(TemplateView):
#     template_name = 'index.html'
    
logger = logging.getLogger('core')

# -------- CATEGORY CRUD --------

class CategoryListView(LoginRequiredMixin, ListView):
    model = CategoryEvent
    template_name = 'eventos/category_list.html'
    context_object_name = 'categories'
    # Exibe todas as categorias cadastradas


class CategoryCreateView(LoginRequiredMixin, CreateView):
    model = CategoryEvent
    form_class = CategoryForm
    template_name = 'eventos/category_form.html'
    success_url = reverse_lazy('category_list')
    # Cria uma nova categoria

    def form_valid(self, form):
        response = super().form_valid(form)
        logger.info(
            f'Nova categoria criada\n'
            f'Nome: {self.object.name}\n'
            f'Criada por: {self.request.user.username}\n'
            f'Data de criação: {self.object.created_at}'
        )
        return response



class CategoryUpdateView(LoginRequiredMixin, UpdateView):
    model = CategoryEvent
    form_class = CategoryForm
    template_name = 'eventos/category_form.html'
    success_url = reverse_lazy('category_list')
    # Edita uma categoria existente

    def form_valid(self, form):
        response = super().form_valid(form)
        logger.info(
            f'Categoria atualizada: {self.object.name}\n'
            f'Editada por: {self.request.user.username}\n'
            f'Data da atualização: {self.object.updated_at}'
        )
        return response


class CategoryDeleteView(LoginRequiredMixin, DeleteView):
    model = CategoryEvent
    template_name = 'eventos/category_confirm_delete.html'
    success_url = reverse_lazy('category_list')
    # Exclui uma categoria

    def delete(self, request, *args, **kwargs):
        category = self.get_object()
        logger.warning(
            f'Categoria sendo excluída: {category.name}, por {request.user.username}')
        return super().delete(request, *args, **kwargs)


# -------- EVENT CRUD --------

class EventListView(LoginRequiredMixin, ListView):
    model = Events
    template_name = 'eventos/event_list.html'
    context_object_name = 'events'
    extra_context = {'page_title': _('Lista de Eventos')}
    paginate_by = 4

    def get_queryset(self):
        query = self.request.GET.get('q', '')
        if query:
            return Events.objects.filter(title__icontains = query)

        return Events.objects.all()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['seach_query'] = self.request.GET.get('q', '')
        return context 


class EventCreateView(LoginRequiredMixin, CreateView):
    model = Events
    form_class = EventForm
    template_name = 'eventos/event_form.html'
    success_url = reverse_lazy('event_list')

    def form_valid(self, form):
        logger.debug(f'Usuário {self.request.user.username} submeteu o formulário de evento: {form.cleaned_data}')
        response = super().form_valid(form)
        logger.info(
    f'Novo evento criado: {self.object.title}\n'
    f'Criado por: {self.request.user.username}\n'
    f'Data do evento: {self.object.date_time}\n'
    f'Local: {self.object.local}\n'
    f'Vagas disponíveis: {self.object.vagas}\n'
    f'Categorias: {", ".join(cat.name for cat in self.object.category.all())}'
)
        return response

class EventDetailView(LoginRequiredMixin, DetailView):
    model = Events
    template_name = 'eventos/event_detail.html'
    context_object_name = 'event'

    def get(self, request, *args, **kwargs):
        logger.info(f'Usuário {request.user.username} acessou detalhes do evento {self.get_object().title}')
        return super().get(request, *args, **kwargs)

class EventUpdateView(LoginRequiredMixin, UpdateView):
    model = Events
    form_class = EventForm
    template_name = 'eventos/event_form.html'
    success_url = reverse_lazy('event_list')

    def form_valid(self, form):
        response = super().form_valid(form)
        logger.info(
            f'Evento atualizado: {self.object.title}\n'
            f'Editado por: {self.request.user.username}\n'
            f'Data da atualização: {self.object.updated_at}'
        )
        return response


class EventDeleteView(LoginRequiredMixin, DeleteView):
    model = Events
    template_name = 'eventos/event_confirm_delete.html'
    success_url = reverse_lazy('event_list')

    def delete(self, request, *args, **kwargs):
        event = self.get_object()
        logger.warning(f'Evento sendo excluído: {event.title} por {request.user.username}')
        return super().delete(request, *args, **kwargs)


# -------- SUBSCRIBE CRUD --------

class SubscribeListView(LoginRequiredMixin, ListView):
    model = Subscribe
    template_name = 'eventos/subscribe_list.html'
    context_object_name = 'subscriptions'


class SubscribeCreateView(NotSuperUserMixin, LoginRequiredMixin, CreateView):
    model = Subscribe
    form_class = SubscribeForm
    template_name = 'eventos/subscribe_form.html'
    success_url = reverse_lazy('subscribe_list')
    def get_form(self, *args, **kwargs): #Não é superuser, tira o campo de cliente (Usando pelo NotSuperUserMixins)
        form = super().get_form(*args, **kwargs)
        user = self.request.user
        if not user.is_superuser:
            form.fields.pop('client', None)
        return form
    
    def form_valid(self, form):
        from django.contrib import messages

        response = super().form_valid(form)

        # NOTIFICAÇÃO (agora funciona!)
        event_title = self.object.events.title
        messages.success(
            self.request,
            f"Inscrição realizada com sucesso no evento: {event_title}!"
        )

        # LOG
        logger.info(
            f'Nova inscrição criada\n'
            f'Usuário: {self.request.user.username}\n'
            f'Evento: {self.object.events.title}\n'
            f'Data do evento: {self.object.events.date_time}\n'
            f'Local do evento: {self.object.events.local}\n'
            f'Data da inscrição: {self.object.created_at}'
        )

        return response
    
    # def form_valid(self, form):
    #     from django.contrib import messages
    #     response = super().form_valid(form)

    #     event_title = self.object.events.title

    #     messages.success(
    #         self.request,
    #         f"Inscrição realizada com sucesso no evento: {event_title}!"
    #     )

    #     return response        
        # response = super().form_valid(form)
        # event_title = self.object.events.title

        # messages.success(
        #     self.request,
        #     f"Inscrição realizada com sucesso no evento: {event_title}!"
        # )
        # return response
        # response = super().form_valid(form)
        # messages.success(self.request, f"Inscrição realizada com sucesso no evento: {self.object.events.title}!")
        # return response

    
#     def form_valid(self, form):
#         response = super().form_valid(form)
#         logger.info(
#     f'Nova inscrição criada\n'
#     f'Usuário: {self.request.user.username}\n'
#     f'Evento: {self.object.events.title}\n'
#     f'Data do evento: {self.object.events.date_time}\n'
#     f'Local do evento: {self.object.events.local}\n'
#     f'Data da inscrição: {self.object.created_at}'
# )
#         return response



class SubscribeUpdateView(LoginRequiredMixin, UpdateView):
    model = Subscribe
    form_class = SubscribeForm
    template_name = 'eventos/subscribe_form.html'
    success_url = reverse_lazy('subscribe_list')

    def form_valid(self, form):
        response = super().form_valid(form)
        logger.info(
            f'Inscrição atualizada: Usuário {self.object.client.username} '
            f'no evento {self.object.events.title}\n'
            f'Editada por: {self.request.user.username}\n'
            f'Data da atualização: {self.object.updated_at if hasattr(self.object, "updated_at") else "não disponível"}'
        )
        return response


class SubscribeDeleteView(LoginRequiredMixin, DeleteView):
    model = Subscribe
    template_name = 'eventos/subscribe_confirm_delete.html'
    success_url = reverse_lazy('subscribe_list')


##########################################################################


class SignUpView(CreateView):
    """Página de cadastro de novos usuários"""
    form_class = UserCreationForm
    template_name = 'registration/signup.html'
    success_url = reverse_lazy('event_list')  # redireciona pra página principal após cadastro

    def form_valid(self, form):
        response = super().form_valid(form)
        logger.info(f"Novo usuário cadastrado com sucesso: {self.object.username}")
        return response

    def form_invalid(self, form):
        username = self.request.POST.get('username', 'não informado')
        logger.warning(f"Tentativa de cadastro falhou — usuário: {username}, erros: {form.errors.as_text()}")
        return super().form_invalid(form)