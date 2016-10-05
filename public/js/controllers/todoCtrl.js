/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
    .controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store, $location) {
        'use strict';

        var data = $scope.data = store.data;
        // we get the max id from all todoLists
        $scope.maxId = Math.max.apply(Math, $scope.data.todoLists.map(function(tl){return tl.id;})) | 0;

        $scope.newTodo = '';
        $scope.editedTodo = null;
        $scope.creatingNewTodoList = false;
        $scope.editTodoList = store.editTodoList;

        $scope.$watch('data', function () {
            if ($scope.editTodoList) {
                $scope.editTodoList.todos = data.todos.filter(function (item) { return item.todoListId == $scope.editTodoList.id; });
                $scope.remainingCount = $filter('filter')($scope.editTodoList.todos, {completed: false}).length;
                $scope.completedCount = $scope.editTodoList.todos.length - $scope.remainingCount;
                $scope.allChecked = !$scope.remainingCount;
            }
        }, true);

        // Monitor the current route for changes and adjust the filter accordingly.
        $scope.$on('$routeChangeSuccess', function () {
            var status = $scope.status = $routeParams.status || '';

            if (status === 'active') {
                $scope.statusFilter = {completed: false};
            }
            else if (status === 'completed') {
                $scope.statusFilter = {completed: true};
            }
            else {
                $scope.statusFilter = {};
            }
        });

        $scope.addTodo = function (todoListId) {
            var newTodo = {
                title    : $scope.newTodo.trim(),
                completed: false,
                todoListId: todoListId
            };

            if (!newTodo.title) {
                return;
            }

            $scope.saving = true;
            store.insert(newTodo)
                .then(function success() {
                    $scope.newTodo = '';
                })
                .finally(function () {
                    $scope.saving = false;
                });
        };

        $scope.addTodoList = function () {
            var newTodoList = {
                name: $scope.newTodoList.trim(),
                id: $scope.maxId+1
            }
            $scope.saving = true;
            store.insertTodoList(newTodoList)
                .then(function success() {
                    $scope.newTodoList = '';
                })
                .finally(function () {
                    $scope.saving = false;
                    $location.path('/editTodoList/' + newTodoList.id);
                });
        };

        $scope.editTodo = function (todo) {
            $scope.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            $scope.originalTodo = angular.extend({}, todo);
        };

        $scope.saveEdits = function (todo, event) {
            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.reverted) {
                // Todo edits were reverted-- don't save.
                $scope.reverted = null;
                return;
            }

            todo.title = todo.title.trim();

            if (todo.title === $scope.originalTodo.title) {
                $scope.editedTodo = null;
                return;
            }

            store[todo.title ? 'put' : 'delete'](todo)
                .then(function success() {
                }, function error() {
                    todo.title = $scope.originalTodo.title;
                })
                .finally(function () {
                    $scope.editedTodo = null;
                });
        };

        $scope.revertEdits = function (todo) {
            data.todos[data.todos.indexOf(todo)] = $scope.originalTodo;
            $scope.editedTodo = null;
            $scope.originalTodo = null;
            $scope.reverted = true;
        };

        $scope.removeTodo = function (todo) {
            store.delete(todo);
        };

        $scope.removeTodoList = function (todoList) {
            store.deleteTodoList(todoList);
        };

        $scope.createNewTodoList = function () {
            $scope.creatingNewTodoList = true;
        };

        $scope.cancelNewTodoList = function () {
            $scope.creatingNewTodoList = false;
            $scope.newTodoList = '';
        };

        $scope.backToTodoLists = function () {
            $location.path('/');
        };

        $scope.saveTodo = function (todo) {
            store.put(todo);
        };

        $scope.toggleCompleted = function (todo, completed) {
            if (angular.isDefined(completed)) {
                todo.completed = completed;
            }
            store.put(todo, data.todos.indexOf(todo))
                .then(function success() {
                }, function error() {
                    todo.completed = !todo.completed;
                });
        };

        $scope.clearCompletedTodos = function () {
            store.clearCompleted();
        };

        $scope.markAll = function (completed, todoListId) {
            $scope.editTodoList.todos.forEach(function (todo) {
                if (todo.completed !== completed) {
                    $scope.toggleCompleted(todo, completed);
                }
            });
        };
    });
