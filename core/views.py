from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from .models import Events, Inscritions

# Create your views here.



class InscritionsViewer(LoginRequiredMixin, CreateView):
    model = Inscritions
    fields = []

    def form_valid(self, form):

        #Aqui ele está preenchendo manualmente os campos antes de salvar no banco

        form.instance.client = self.request.user 
        form.instance.code = self.kwargs['pk']

        return super().form_valid(form) #pra salvar no banco e continuar o fluxo normal
    
    def get_success_url(self): #Depois que a inscrição é criada com sucesso, o Django redireciona pra essa URL.
        return reverse_lazy('eventos:list') #busca o caminho da rota nomeada
    
class IndexView(TemplateView):
    template_name = 'index.html'
    

