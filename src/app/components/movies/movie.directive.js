(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .directive('movieGrid', movieGrid);

  /** @ngInject */
  function movieGrid() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/movies/movies.html',
      scope: {
          query: '=',
          photos: '=',
          fetch: '&'
      },
      link: function link(scope, element, attrs) {
      }
    };

    return directive;
  }

})();
