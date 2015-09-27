(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(movieFactory, $log, $scope) {
    var vm = this;
    vm.photos = [];
    var _getPhotos = function(query){
      movieFactory.getMovies(query).then(function(resp){
        vm.photos = resp;
        $scope.$apply();
      });
    }
    _getPhotos();
    vm.fetchPhotos = function(query){
      if(query.length > 2 || query.length == 0) {
        _getPhotos(query);
      }
    }
  }
})();
