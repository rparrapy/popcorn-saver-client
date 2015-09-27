(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

  }

})();
