(function() {
  'use strict';

  angular
    .module('popcornSaver')
    .directive('movieGrid', movieGrid);

  /** @ngInject */
  function movieGrid($uibModal, $log, movieFactory) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/movies/movies.html',
      scope: {
          query: '=',
          photos: '=',
          fetch: '&'
      },
      link: function link(scope, element, attrs) {
        scope.onPosterClick = function(card){
          var modalInstance;
          scope.selectedMovie = card;
          scope.previousRating = card.rating;

          scope.ok = function (rating) {
            modalInstance.close(rating);
          };

          scope.cancel = function () {
            modalInstance.dismiss('cancel');
          };

          scope.tweets = [];
          movieFactory.getTweets(scope.selectedMovie.movieId).then(function(tweets) {
            scope.tweets = tweets;
          });

          modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ratingModal.html',
            scope: scope
          });

          modalInstance.result.then(function (rating) {
            movieFactory.addMovieRating(scope.selectedMovie.movieId, rating);
          }, function () {
            scope.selectedMovie.rating = scope.previousRating;
            $log.info('Modal dismissed at: ' + new Date());
          });

        }
      }
    };

    return directive;
  }

})();
