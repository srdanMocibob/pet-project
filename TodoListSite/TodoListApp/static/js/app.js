/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
    .config(['$resourceProvider', function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .config(function ($routeProvider) {
        'use strict';

        var showTodoLists = {
            controller : 'TodoCtrl',
            templateUrl: 'todomvc-showTodoLists.html',
            resolve    : {
                store: function (todoStorage) {
                    // Get the correct module (API or localStorage).
                    return todoStorage.then(function (module) {
                        module.getTodos(); // Fetch the todo records in the background.
                        module.getTodoLists(); // Fetch the todo lists records in the background.
                        return module;
                    });
                }
            }
        };

        var editTodoList = {
            controller : 'TodoCtrl',
            templateUrl: 'todomvc-editTodoList.html',
            resolve    : {
                store: function (todoStorage, $route) {
                    // Get the correct module (API or localStorage).
                    return todoStorage.then(function (module) {
                        module.getTodos(); // Fetch the todo records in the background.
                        module.getTodoLists(); // Fetch the todo lists records in the background.

                        module.getTodoList($route.current.params.id);
                        return module;
                    });
                }
            }
        };

        $routeProvider
            .when('/', showTodoLists)
            .when('/editTodoList/:id', editTodoList)
            .when('/editTodoList/:id/:status', editTodoList)
            .otherwise({
                redirectTo: '/'
            });
    });
