from django.utils.timezone import now
from django.db import models
from django.conf import settings

# Create your models here.

class BaseModel(models.Model):
    
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    deleted_at = models.DateTimeField(auto_now=True, null=True)
    is_deleted = models.BooleanField(default=False, null=True)

    def Soft_Delete(self):
        self.is_deleted = True
        self.deleted_at = now()

    def Hard_Delete(self):
        super().delete()

    def Restored(self):
        self.is_deleted = False
        self.deleted_at = None
        
    class Meta:
        abstract = True

class CategoryEvent(BaseModel):
    name = models.CharField(max_length = 50)

    def __str__(self):
        return self.name


class Events(BaseModel):
    date_time = models.DateTimeField()
    title = models.CharField(max_length=50)
    vagas = models.IntegerField(default=30)
    descriptions = models.TextField()
    local = models.CharField()
    category = models.ManyToManyField(CategoryEvent)

    def __str__(self):
        return f"{self.title} - {self.date_time.strftime('%d/%m/%Y')}"

class SubsQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_deleted = False)
    
    def deleted(self):
        return self.filter(is_deleted = True)
    
    def by_events(self, event):
        if isinstance(event, Events):
            return self.filter(events = event)
        return self.filter(events_id = event)
    
    def by_client(self, client):
        if isinstance(client, models.Model):
            return self.filter(client = client)
        return self.filter(client_id = client)
    
    def order_by_event_date(self):
        return self.order_by("events__date_time")
    
class SubsManager(models.Manager):
    def get_queryset(self):
        return SubsQuerySet(self.model, using=self._db)
    
    def active(self):
        return self.get_queryset().active()
    
    def deleted(self):
        return self.get_queryset().deleted()
    
    def by_client(self, client):
        return self.get_queryset().by_client(client)
    
    def by_events(self, event):
        return self.get_queryset().by_events(event)
    
    def order_by_date_time(self):
        return self.get_queryset().order_by_event_date()


class Subscribe(BaseModel):
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    events = models.ForeignKey(Events, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    #is_deleted = models.BooleanField(default=False) # Adiccionar
    objects = SubsManager() # Adicionar

    def __str__(self):
        return f"{self.client.username} _ {self.events.title}"
    


