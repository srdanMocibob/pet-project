from .models import Todo, TodoList
from rest_framework import viewsets
from django.shortcuts import render
from TodoListApp.serializers import TodoSerializer, TodoListSerializer

def todo_list(request):
    return render(request, 'index.html', {})

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
