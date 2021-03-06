'use strict';

angular.module('awesome-app', [
    'ui.router',
    'ui.bootstrap',
    'ngSanitize',
    'ngTagsInput',
    'templates-app',
    'awesome-app.common',
    'awesome-app.home',
    'awesome-app.tabs',
    'awesome-app.teams'
]).
config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/search');
}]);
