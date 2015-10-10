(function() {
  'use strict';

  deferredBootstrapper.bootstrap({
      element: document.body,
      module: 'popcornSaver',
      resolve: {
        TMDB_CONFIG: ['$http', '$q', function ($http, $q) {
          var url = 'http://api.themoviedb.org/3/';
          var key = 'dc2e898bfed2da2978e56e9d1123a147';
          return $http.get(url + 'configuration', {
              params: {
                'api_key': key
              }
          }).then(function(resp){
            var defered = $q.defer();
            resp.data['api_url'] = url;
            resp.data['api_key'] = key;
            defered.resolve(resp);
            return defered.promise;
          });
        }]
      }
    });


  angular
    .module('popcornSaver', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize',
      'ngMessages', 'ngAria', 'ngRoute', 'ui.bootstrap', 'toastr',
      'akoenig.deckgrid', 'LocalForageModule']);



})();
