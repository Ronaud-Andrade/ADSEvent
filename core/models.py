from django.db import models
from django.conf import settings

# Create your models here.

class CategoryEvent(models.Model):
    name = models.CharField(max_length = 50)

    def __str__(self):
        return self.nome


class Events(models.Model):
    date_time = models.DateTimeField()
    title = models.CharField(max_length=50)
    vagas = models.IntegerField()
    descritions = models.TextField()
    local = models.CharField()
    category = models.ForeignKey(CategoryEvent, on_delete=models.CASCADE)

class User(models.Model):
    pass

class Inscritions(models.Model):
    code = models.CharField(primary_key=True, auto_created=True)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

