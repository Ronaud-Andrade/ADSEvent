from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import CategoryEvent, Events, Subscribe
from .forms import CategoryForm, EventForm, SubscribeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import gettext_lazy as _ #marque strings para o I18N
from .mixins import NotSuperUserMixin
import logging
from functools import wraps

# Create your views here.

logger = logging.getLogger('core')


#################################################################################
#                     ✅ PADRÃO DECORATOR (Estrutural)                          #
#                                  INÍCIO                                       #
#                                                                               #
# Problema: 10+ views tinham logging repetitivo/duplicado                      #
# Solução: LoggingDecorator adiciona logging transparentemente                  #
# Benefício: Logging centralizado, código das views limpo, reutilizável        #
#                                                                               #
#################################################################################


class LoggingDecorator:
    """Decorator base que adiciona logging automático a métodos de view"""
    
    def __init__(self, action_name, log_level='info'):
        """
        Args:
            action_name: Nome da ação (ex: 'criada', 'atualizada', 'deletada')
            log_level: Nível de logging ('debug', 'info', 'warning')
        """
        self.action_name = action_name
        self.log_level = log_level
    
    def __call__(self, method):
        """Torna a classe callable para usar como decorator"""
        @wraps(method)
        def wrapper(view_instance, *args, **kwargs):
            # Log ANTES da ação
            self._log_before(view_instance)
            
            # Executa o método original
            response = method(view_instance, *args, **kwargs)
            
            # Log DEPOIS da ação
            self._log_after(view_instance)
            
            return response
        
        return wrapper
    
    def _get_logger(self):
        """Retorna o logger com o nível apropriado"""
        if self.log_level == 'debug':
            return logger.debug
        elif self.log_level == 'warning':
            return logger.warning
        else:
            return logger.info
    
    def _log_before(self, view_instance):
        """Template method - Log antes da ação (pode ser sobrescrito)"""
        pass
    
    def _log_after(self, view_instance):
        """Template method - Log depois da ação (deve ser sobrescrito)"""
        pass


class CategoryLoggingDecorator(LoggingDecorator):
    """Decorator especializado para logging de Categorias"""
    
    def _log_after(self, view_instance):
        if hasattr(view_instance, 'object'):
            log_func = self._get_logger()
            log_func(
                f'Categoria {self.action_name}: {view_instance.object.name} '
                f'por {view_instance.request.user.username} '
                f'em {view_instance.object.updated_at}'
            )


class EventLoggingDecorator(LoggingDecorator):
    """Decorator especializado para logging de Eventos"""
    
    def _log_before(self, view_instance):
        # Log adicional para criação de eventos
        if hasattr(view_instance, 'form') and hasattr(view_instance.form, 'cleaned_data'):
            logger.debug(
                f'Usuário {view_instance.request.user.username} '
                f'submeteu formulário de evento'
            )
    
    def _log_after(self, view_instance):
        if hasattr(view_instance, 'object'):
            log_func = self._get_logger()
            categories = ', '.join(
                [cat.name for cat in view_instance.object.category.all()]
            ) if hasattr(view_instance.object, 'category') else 'Nenhuma'
            
            log_func(
                f'Evento {self.action_name}: {view_instance.object.title} '
                f'({view_instance.object.date_time.strftime("%d/%m/%Y")}) '
                f'Local: {view_instance.object.local} '
                f'Categorias: {categories} '
                f'por {view_instance.request.user.username}'
            )


class SubscribeLoggingDecorator(LoggingDecorator):
    """Decorator especializado para logging de Inscrições"""
    
    def _log_after(self, view_instance):
        if hasattr(view_instance, 'object'):
            log_func = self._get_logger()
            log_func(
                f'Inscrição {self.action_name}: '
                f'Usuário {view_instance.object.client.username} '
                f'no evento {view_instance.object.events.title} '
                f'({view_instance.object.events.date_time.strftime("%d/%m/%Y")}) '
                f'em {view_instance.object.updated_at}'
            )


class SignUpLoggingDecorator(LoggingDecorator):
    """Decorator especializado para logging de Cadastro de Usuários"""
    
    def _log_after(self, view_instance):
        if hasattr(view_instance, 'object'):
            log_func = self._get_logger()
            log_func(f'Novo usuário cadastrado: {view_instance.object.username}')


#################################################################################
#                      ✅ PADRÃO DECORATOR - FIM                                #
#################################################################################


#################################################################################
#                                                                               #
#        VIEWS COM DECORATOR APLICADO (Padrão Decorator - Uso Prático)         #
#                                                                               #
#  As views abaixo usam LoggingDecorator para logging transparente.             #
#  Cada método create/update/delete está decorado com CategoryLoggingDecorator, #
#  EventLoggingDecorator, SubscribeLoggingDecorator ou SignUpLoggingDecorator.  #
#                                                                               #
#  BENEFÍCIO: Logging centralizado, código limpo, sem duplicação.              #
#                                                                               #
#################################################################################


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

    @CategoryLoggingDecorator('criada')  # ✅ DECORATOR: Logging aplicado aqui
    def form_valid(self, form):
        return super().form_valid(form)



class CategoryUpdateView(LoginRequiredMixin, UpdateView):
    model = CategoryEvent
    form_class = CategoryForm
    template_name = 'eventos/category_form.html'
    success_url = reverse_lazy('category_list')
    # Edita uma categoria existente

    @CategoryLoggingDecorator('atualizada')  # ✅ DECORATOR: Logging aplicado aqui
    def form_valid(self, form):
        return super().form_valid(form)


class CategoryDeleteView(LoginRequiredMixin, DeleteView):
    model = CategoryEvent
    template_name = 'eventos/category_confirm_delete.html'
    success_url = reverse_lazy('category_list')
    # Exclui uma categoria

    @CategoryLoggingDecorator('deletada', log_level='warning')  # ✅ DECORATOR: Logging aplicado aqui
    def delete(self, request, *args, **kwargs):
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

    @EventLoggingDecorator('criado')  # ✅ DECORATOR: Logging aplicado aqui
    def form_valid(self, form):
        return super().form_valid(form)


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

    @EventLoggingDecorator('atualizado')  # ✅ DECORATOR: Logging aplicado aqui
    def form_valid(self, form):
        return super().form_valid(form)


class EventDeleteView(LoginRequiredMixin, DeleteView):
    model = Events
    template_name = 'eventos/event_confirm_delete.html'
    success_url = reverse_lazy('event_list')

    @EventLoggingDecorator('deletado', log_level='warning')  # ✅ DECORATOR: Logging aplicado aqui
    def delete(self, request, *args, **kwargs):
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
    
    @SubscribeLoggingDecorator('criada')  # ✅ DECORATOR: Logging aplicado aqui
    def form_valid(self, form):
        return super().form_valid(form)



class SubscribeUpdateView(LoginRequiredMixin, UpdateView):
    model = Subscribe
    form_class = SubscribeForm
    template_name = 'eventos/subscribe_form.html'
    success_url = reverse_lazy('subscribe_list')

    @SubscribeLoggingDecorator('atualizada')  # ✅ DECORATOR: Logging aplicado aqui
    def form_valid(self, form):
        return super().form_valid(form)


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

    @SignUpLoggingDecorator('cadastrado')  # ✅ DECORATOR: Logging aplicado aqui
    def form_valid(self, form):
        return super().form_valid(form)

    def form_invalid(self, form):
        username = self.request.POST.get('username', 'não informado')
        logger.warning(f"Tentativa de cadastro falhou — usuário: {username}, erros: {form.errors.as_text()}")
        return super().form_invalid(form)
