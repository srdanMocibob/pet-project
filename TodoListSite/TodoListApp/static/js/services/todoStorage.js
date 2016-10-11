/*global angular */

/**
 * Services that persists and retrieves todos from a backend API
 */

angular.module('todomvc')
    .config(['$resourceProvider', function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .config(["$httpProvider", function($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .factory('todoStorage', function ($http, $injector) {
        'use strict';
        return $http.get('/app/api')
            .then(function () {
                return $injector.get('api');
            });
    })

    .factory('api', function ($resource, $q) {
        'use strict';

        var store = {
            data: {
                todos: [],
                todoLists: [],
            },

            todosAPI: $resource('api/todo/', null,
                {
                    get:  {method:'GET', isArray:true},
                    update: {method: 'PUT'}
                }
            ),

            todoListsAPI: $resource('api/todo-list/', null,
                {
                    'get':  {method:'GET', isArray:true},
                    update: {method: 'PUT'}
                }
            ),

            todoListAPI: $resource('api/todo-list/:id', null,
                {
                    update: {method: 'PUT'}
                }
            ),

            todoAPI: $resource('api/todo/:id/', null,
                {
                    update: {method: 'PUT'}
                }
            ),

            clearCompleted: function () {
                var incompleteTodos = store.data.todos.filter(function (todo) {
                    return !todo.completed;
                });

                var completeTodos = store.data.todos.filter(function (todo) {
                    return todo.completed;
                });

                angular.copy(incompleteTodos, store.data.todos);

                completeTodos.forEach(function(todo) {
                    store.todoAPI.delete({id: todo.id}, function () {
                    }, function error() {
                        store.data.todos.push(todo);
                    });
                });
            },

            delete: function (todo) {
                var originalTodos = store.data.todos.slice(0);

                store.data.todos.splice(store.data.todos.indexOf(todo), 1);
                return store.todoAPI.delete({id: todo.id},
                    function () {
                    }, function error() {
                        angular.copy(originalTodos, store.data.todos);
                    });
            },

            deleteTodoList: function (todoList) {
                var originalTodoLists = store.data.todoLists.slice(0);
                var originalTodos = store.data.todos.slice(0);

                store.data.todoLists.splice(store.data.todoLists.indexOf(todoList), 1);
                store.data.todos = store.data.todos.filter(function(item) { return item.todoListId != todoList.id});

                return store.todoListAPI.delete({id: todoList.id},
                    function () {
                    }, function error() {
                        angular.copy(originalTodoLists, store.data.todoLists);
                        angular.copy(originalTodos, store.data.todos);
                    });
            },

            getTodos: function () {
                return store.todosAPI.query(function (resp) {
                    angular.copy(resp, store.data.todos);
                });
            },

            getTodoLists: function () {
                return store.todoListsAPI.get(function (resp) {
                    angular.copy(resp, store.data.todoLists);
                });
            },

            getTodoList: function (listId) {
                var deferred = $q.defer();

                var todoList = store.data.todoLists.find(function (item) { return item.id == listId; });

                store.editTodoList = {
                    id: listId
                };

                deferred.resolve(store.editTodoList);

                return deferred.promise;
            },

            insert: function (todo) {
                var originalTodos = store.data.todos.slice(0);

                return store.todosAPI.save(todo,
                    function success(resp) {
                        todo.id = resp.id;
                        store.data.todos.push(todo);
                    }, function error() {
                        angular.copy(originalTodos, store.data.todos);
                    })
                    .$promise;
            },

            insertTodoList: function (todoList) {
                var originalTodoLists = store.data.todoLists.slice(0);

                return store.todoListsAPI.save(todoList,
                    function success(resp) {
                        todoList.id = resp.id;
                        store.data.todoLists.push(todoList);
                    }, function error() {
                        angular.copy(originalTodoLists, store.data.todos);
                    })
                    .$promise;
            },

            put: function (todo) {
                return store.todoAPI.update({id: todo.id}, todo)
                    .$promise;
            }
        };

        return store;
    })
