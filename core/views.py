from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import CategoryEvent, Events, Subscribe
from .forms import CategoryForm, EventForm, SubscribeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm

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

class CategoryListView(ListView):
    model = CategoryEvent
    template_name = 'eventos/category_list.html'
    context_object_name = 'categories'
    # Exibe todas as categorias cadastradas


class CategoryCreateView(CreateView):
    model = CategoryEvent
    form_class = CategoryForm
    template_name = 'eventos/category_form.html'
    success_url = reverse_lazy('category_list')
    # Cria uma nova categoria


class CategoryUpdateView(UpdateView):
    model = CategoryEvent
    form_class = CategoryForm
    template_name = 'eventos/category_form.html'
    success_url = reverse_lazy('category_list')
    # Edita uma categoria existente


class CategoryDeleteView(DeleteView):
    model = CategoryEvent
    template_name = 'eventos/category_confirm_delete.html'
    success_url = reverse_lazy('category_list')
    # Exclui uma categoria


# -------- EVENT CRUD --------

class EventListView(ListView):
    model = Events
    template_name = 'eventos/event_list.html'
    context_object_name = 'events'


class EventCreateView(CreateView):
    model = Events
    form_class = EventForm
    template_name = 'eventos/event_form.html'
    success_url = reverse_lazy('event_list')

class EventDetailView(DetailView):
    model = Events
    template_name = 'eventos/event_detail.html'
    context_object_name = 'event'

class EventUpdateView(UpdateView):
    model = Events
    form_class = EventForm
    template_name = 'eventos/event_form.html'
    success_url = reverse_lazy('event_list')


class EventDeleteView(DeleteView):
    model = Events
    template_name = 'eventos/event_confirm_delete.html'
    success_url = reverse_lazy('event_list')


# -------- SUBSCRIBE CRUD --------

class SubscribeListView(ListView):
    model = Subscribe
    template_name = 'eventos/subscribe_list.html'
    context_object_name = 'subscriptions'


class SubscribeCreateView(CreateView):
    model = Subscribe
    form_class = SubscribeForm
    template_name = 'eventos/subscribe_form.html'
    success_url = reverse_lazy('subscribe_list')


class SubscribeUpdateView(UpdateView):
    model = Subscribe
    form_class = SubscribeForm
    template_name = 'eventos/subscribe_form.html'
    success_url = reverse_lazy('subscribe_list')


class SubscribeDeleteView(DeleteView):
    model = Subscribe
    template_name = 'eventos/subscribe_confirm_delete.html'
    success_url = reverse_lazy('subscribe_list')

class SignUpView(CreateView):
    """Página de cadastro de novos usuários"""
    form_class = UserCreationForm
    template_name = 'registration/signup.html'
    success_url = reverse_lazy('event_list')  # redireciona pra página principal após cadastro