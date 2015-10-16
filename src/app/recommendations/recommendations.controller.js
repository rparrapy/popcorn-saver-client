(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .controller('RecommendationsController', RecommendationsController);

  /** @ngInject */
  function RecommendationsController(movieFactory, $log, $scope) {
    var vm = this;
    vm.minRatings = 5;
    vm.photos = [];
    var _getPhotos = function(ratings){
      movieFactory.getRecommendations(ratings).then(function(resp){
        //vm.photos = resp;
      });
    }
    movieFactory.getRatings().then(function(ratings) {
      vm.numberOfRatings = _.keys(ratings).length;
      _getPhotos(ratings);
    });
  }
})();
