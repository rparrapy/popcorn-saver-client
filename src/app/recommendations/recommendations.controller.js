(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .controller('RecommendationsController', RecommendationsController);

  /** @ngInject */
  function RecommendationsController(movieFactory, $log, $scope) {
    var vm = this;
    vm.minRatings = 10;
    vm.photos = [];
    vm.showSearchBar = false;
    var _getPhotos = function(type){
      movieFactory.getRecommendations(type).then(function(resp){
        vm.photos = resp;
      });
    }
    movieFactory.getRatings().then(function(ratings) {
      vm.numberOfRatings = _.keys(ratings).length;
      _getPhotos();
    });

    vm.recommend = function(recommender) {
      _getPhotos(recommender);
    }
  }
})();
