(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          query: '=',
          clear: '&',
          fetch: '&'
      }
    };

    return directive;
  }

})();
