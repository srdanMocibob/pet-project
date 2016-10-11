from django.contrib import admin

from .models import TodoList
from .models import Todo

admin.site.register(TodoList)
admin.site.register(Todo)
