(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/recommendations', {
        templateUrl: 'app/recommendations/recommendations.html',
        controller: 'RecommendationsController',
        controllerAs: 'rec'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
