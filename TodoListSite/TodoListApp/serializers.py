from .models import TodoList, Todo
from rest_framework import serializers

class TodoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'todo_list', 'title', 'completed')


class TodoListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TodoList
        fields = ('id', 'name',)
