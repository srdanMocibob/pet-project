from django.db import models

class TodoList(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Todo(models.Model):
    todo_list = models.ForeignKey(TodoList, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default='false')

    def __str__(self):
        return self.title
