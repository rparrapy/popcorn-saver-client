/* global moment:false, _:false, elasticsearch:false */
(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .constant('moment', moment)
    .constant('_', _)
    .constant('elasticsearch', elasticsearch);
})();
