(function() {
  'use strict';

  angular
      .module('popcornSaver')
      .factory('movieFactory', movieFactory);

  /** @ngInject */
  function movieFactory($q, elasticsearch, _, TMDB_CONFIG, $http, $localForage) {
    var tmdb = {
      url: TMDB_CONFIG['api_url'],
      method: 'GET',
      params: {
        'api_key': TMDB_CONFIG['api_key']
      }
    };

    var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
    });

    return {
      getMovies: function(qstring){

        var query = {};
        if(qstring){
          query = {
            query_string: {
                query: qstring,
                fields: ['title']
            }
          };
        }else{
          query = { 'match_all': {} };
        }

        return client.search({
          index: 'popcorn-saver',
          type: 'movie',
          size: 20,
          body: {
            query: query
          }
        }).then(function(resp){
          var movies = _.map(resp.hits.hits, function(h){ return h._source; });
          _.each(movies, function(m){
            $localForage.getItem(m.movieId).then(function(data){
              if(data) m.rating = data;
            });
          });

          var results = _.map(movies, function(m){
            var config = _.clone(tmdb);
            config.url += 'movie/'+ m.tmdbId+'/images';
            var defered = $q.defer();
            return $http(config).then(function(r){
              if(r.data.posters.length) {
                  m.poster = TMDB_CONFIG.images['base_url'] + TMDB_CONFIG.images['poster_sizes'][3] + r.data.posters[0]['file_path'];
              } else {
                  m.poster = 'assets/images/movie-poster.jpg';
              }
              defered.resolve(m);
              return defered.promise;
            }, function(r){
              m.poster = 'assets/images/movie-poster.jpg';
              defered.resolve(m);
              return defered.promise;
            });
          });
          return $q.all(results);
        });
      },
      resetRatings: function(){
        $localForage.clear();
      }
    }
  }

})();
