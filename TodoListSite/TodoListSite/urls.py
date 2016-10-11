from django.conf.urls import url, include
from rest_framework import routers
from TodoListApp import views

router = routers.DefaultRouter()
router.register(r'api/todo/', views.TodoViewSet)
router.register(r'api/todo-list/', views.TodoListViewSet)

todo_list_list = views.TodoListViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

todo_list_detail = views.TodoListViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

todo_list = views.TodoViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

todo_detail = views.TodoViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'app', views.todo_list),
    # url(r'api/todo', views.TodoViewSet.as_view({'get': 'list'})),
    # url(r'api/todo/', views.TodoViewSet.as_view({'get': 'list'})),
    # url(r'api/todo-list', views.TodoListViewSet.as_view({'get': 'list'})),
    url(r'^api/todo/$', todo_list, name='todo-list'),
    url(r'^api/todo/(?P<pk>[0-9]+)/$', todo_detail, name='todo-detail'),
    url(r'^api/todo-list/$', todo_list_list, name='todolist-list'),
    url(r'^api/todo-list/(?P<pk>[0-9]+)/$', todo_list_detail, name='todolist-detail'),
]
