from django.contrib import admin
from .models import Events, Subscribe, CategoryEvent
# Register your models here.


admin.site.register(Events)
admin.site.register(Subscribe)
admin.site.register(CategoryEvent)