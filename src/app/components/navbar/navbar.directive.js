(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar($location) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          query: '=',
          clear: '&',
          fetch: '&',
          recommend: '&',
          searchbar: '='
      },
      link: function link(scope, element, attrs) {
        //si esto no es alambre, el alambre donde esta?
        if (scope.searchbar === undefined) {
          scope.searchbar = true;
        }
        scope.isActive = function (path) {
          return (path === '/' && $location.path() === path) ||
            (path !== '/' && $location.path().substr(0, path.length) === path);
        }
      }
    };

    return directive;
  }

})();
