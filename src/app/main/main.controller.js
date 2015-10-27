(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(movieFactory, $log, $scope, _) {
    var vm = this;
    vm.photos = [];
    vm.suggestions = [];
    vm.query = {};

    var _getPhotos = function(query){
      movieFactory.getMovies(query).then(function(resp){
        vm.photos = resp;
        vm.suggestions = (resp.length === 0) ? vm.suggestions = movieFactory.getSuggestions() : [];
        $scope.$apply();
      });
    }
    _getPhotos();
    vm.fetchPhotos = function(query){
      var validQuery = _.findKey(query, function(k) {
        return k.length > 2 || k.length == 0
      });
      if(validQuery) {
        _getPhotos(query);
      }
    }

    vm.showSearchBar = true;
    vm.clearRatings = function() {
      _.each(vm.photos, function(p) {
        delete p.rating;
      });
      movieFactory.resetRatings();
    }

    vm.applySuggestion = function(text, option) {
      var re = new RegExp(text,"g");
      vm.query.title = vm.query.title.replace(re, option);
      _getPhotos(vm.query);
    }
  }
})();
