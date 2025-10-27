from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import CategoryEvent, Events, Subscribe
from .forms import CategoryForm, EventForm, SubscribeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import gettext_lazy as _ #marque strings para o I18N
from .mixins import NotSuperUserMixin

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




class CategoryUpdateView(LoginRequiredMixin, UpdateView):
    model = CategoryEvent
    form_class = CategoryForm
    template_name = 'eventos/category_form.html'
    success_url = reverse_lazy('category_list')
    # Edita uma categoria existente


class CategoryDeleteView(LoginRequiredMixin, DeleteView):
    model = CategoryEvent
    template_name = 'eventos/category_confirm_delete.html'
    success_url = reverse_lazy('category_list')
    # Exclui uma categoria


# -------- EVENT CRUD --------

class EventListView(LoginRequiredMixin, ListView):
    model = Events
    template_name = 'eventos/event_list.html'
    context_object_name = 'events'
    extra_context = {'page_title': _('Lista de Eventos')}
    paginate_by = 1

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

class EventDetailView(LoginRequiredMixin, DetailView):
    model = Events
    template_name = 'eventos/event_detail.html'
    context_object_name = 'event'

class EventUpdateView(LoginRequiredMixin, UpdateView):
    model = Events
    form_class = EventForm
    template_name = 'eventos/event_form.html'
    success_url = reverse_lazy('event_list')


class EventDeleteView(LoginRequiredMixin, DeleteView):
    model = Events
    template_name = 'eventos/event_confirm_delete.html'
    success_url = reverse_lazy('event_list')


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



class SubscribeUpdateView(LoginRequiredMixin, UpdateView):
    model = Subscribe
    form_class = SubscribeForm
    template_name = 'eventos/subscribe_form.html'
    success_url = reverse_lazy('subscribe_list')


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