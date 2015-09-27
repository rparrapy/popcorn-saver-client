(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
