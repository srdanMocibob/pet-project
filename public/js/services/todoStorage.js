/*global angular */

/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('todomvc')
    .factory('todoStorage', function ($http, $injector) {
        'use strict';

        // Detect if an API backend is present. If so, return the API module, else
        // hand off the localStorage adapter
        return $http.get('/api')
            .then(function () {
                return $injector.get('api');
            }, function () {
                return $injector.get('localStorage');
            });
    })

    .factory('api', function ($resource) {
        'use strict';

        var store = {
            todos: [],

            api: $resource('/api/todos/:id', null,
                {
                    update: {method: 'PUT'}
                }
            ),

            clearCompleted: function () {
                var originalTodos = store.todos.slice(0);

                var incompleteTodos = store.todos.filter(function (todo) {
                    return !todo.completed;
                });

                angular.copy(incompleteTodos, store.todos);

                return store.api.delete(function () {
                }, function error() {
                    angular.copy(originalTodos, store.todos);
                });
            },

            delete: function (todo) {
                var originalTodos = store.todos.slice(0);

                store.todos.splice(store.todos.indexOf(todo), 1);
                return store.api.delete({id: todo.id},
                    function () {
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                    });
            },

            get: function () {
                return store.api.query(function (resp) {
                    angular.copy(resp, store.todos);
                });
            },

            insert: function (todo) {
                var originalTodos = store.todos.slice(0);

                return store.api.save(todo,
                    function success(resp) {
                        todo.id = resp.id;
                        store.todos.push(todo);
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                    })
                    .$promise;
            },

            put: function (todo) {
                return store.api.update({id: todo.id}, todo)
                    .$promise;
            }
        };

        return store;
    })

    .factory('localStorage', function ($q) {
        'use strict';

        var STORAGE_ID = 'todos-angularjs';

        var store = {
            data: {
                todos: [],
                todoLists: [],
            },

            _getFromLocalStorage: function () {
                var data = JSON.parse(localStorage.getItem(STORAGE_ID) || { todos: [], todoLists: [] });

                // prevent app from crashing if you have some old data in local storage
                if (!data.todos || !data.todoLists) {
                    return { todos: [], todoLists: [] }
                } else {
                    return data;
                }
            },

            _saveToLocalStorage: function (todos) {
                localStorage.setItem(STORAGE_ID, JSON.stringify(store.data));
            },

            clearCompleted: function () {
                var deferred = $q.defer();

                var incompleteTodos = store.data.todos.filter(function (todo) {
                    return !todo.completed || todo.todoListId != store.editTodoList.id;
                });

                angular.copy(incompleteTodos, store.data.todos);

                store._saveToLocalStorage(store.data);
                deferred.resolve(store.data);

                return deferred.promise;
            },

            delete: function (todo) {
                var deferred = $q.defer();

                store.data.todos.splice(store.data.todos.indexOf(todo), 1);

                store._saveToLocalStorage(store.data);
                deferred.resolve(store.data);

                return deferred.promise;
            },

            deleteTodoList: function (todoList) {
                var deferred = $q.defer();

                store.data.todoLists.splice(store.data.todoLists.indexOf(todoList), 1);
                store.data.todos = store.data.todos.filter(function(item) { return item.todoListId != todoList.id});

                store._saveToLocalStorage();
                deferred.resolve(store.data);

                return deferred.promise;
            },

            get: function () {
                var deferred = $q.defer();

                angular.copy(store._getFromLocalStorage(), store.data);
                deferred.resolve(store.data);

                return deferred.promise;
            },

            getTodoList: function (listId) {
                var deferred = $q.defer();

                angular.copy(store._getFromLocalStorage(), store.data);

                var todoList = store.data.todoLists.find(function (item) { return item.id == listId; });

                store.editTodoList = {
                    todos: store.data.todos.filter(function (item) { return item.todoListId == listId;}),
                    id: listId,
                    name: todoList.name
                };

                deferred.resolve(store.editTodoList);

                return deferred.promise;
            },

            insert: function (todo) {
                var deferred = $q.defer();

                store.data.todos.push(todo);

                store._saveToLocalStorage(store.data);
                deferred.resolve(store.data);

                return deferred.promise;
            },

            insertTodoList: function (todoList) {
                var deferred = $q.defer();

                store.data.todoLists.push(todoList);

                store._saveToLocalStorage(store.data);
                deferred.resolve(store.data);

                return deferred.promise;
            },

            put: function (todo, index) {
                var deferred = $q.defer();

                store.data.todos[index] = todo;

                store._saveToLocalStorage(store.data);
                deferred.resolve(store.data);

                return deferred.promise;
            }
        };

        return store;
    });
