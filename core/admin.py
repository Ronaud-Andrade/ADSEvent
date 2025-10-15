from django.contrib import admin
from .models import User, Events, Inscritions, CategoryEvent
# Register your models here.

admin.site.register(User)
admin.site.register(Events)
admin.site.register(Inscritions)
admin.site.register(CategoryEvent)