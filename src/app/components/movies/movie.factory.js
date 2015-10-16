(function() {
  'use strict';

  angular
      .module('popcornSaver')
      .factory('movieFactory', movieFactory);

  /** @ngInject */
  function movieFactory($q, elasticsearch, _, TMDB_CONFIG, $http, $localForage, $log) {
    var tmdb = {
      url: TMDB_CONFIG['api_url'],
      method: 'GET',
      params: {
        'api_key': TMDB_CONFIG['api_key']
      }
    };

    var query_template = {
      bool: {
        must: []
      }
    }

    var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'debug'
    });

    var PS_URL = 'http://localhost:5000';

    var _get_Poster = function(m) {
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
    }

    return {
      getMovies: function(qstring){
        var query = _.clone(query_template);
        query.bool.must = [];
        _.forOwn(qstring, function(v, k) {
          if(v) query.bool.must.push({
            query_string: {
                  query: qstring[k],
                  fields: [k]
              }
          });
        });
        //
        // if(qstring){
        //   query = {
        //     query_string: {
        //         query: qstring.title,
        //         fields: ['title']
        //     }
        //   };
        // }else{
        //   query = { 'match_all': {} };
        // }

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
            $localForage.getItem('ratings').then(function(data){
              if(data) m.rating = data[m.movieId];
            });
          });

          var results = _.map(movies, _get_Poster);
          return $q.all(results);
        });
      },
      resetRatings: function() {
        $localForage.removeItem('ratings');
      },
      getRatings: function() {
        return $localForage.getItem('ratings');
      },
      addMovieRating: function(movieId, rating) {
        $localForage.keys().then(function(keys) {
          if(_.contains(keys, 'ratings')){
            $localForage.getItem('ratings').then(function(data){
              data[movieId] = rating;
              $localForage.setItem('ratings', data);
            });
          } else {
            var ratings = {};
            ratings[movieId] = rating;
            $localForage.setItem('ratings', ratings);
          }
        });
      },
      getRecommendations: function(ratings) {
        return $http({
          url: PS_URL + '/recommendations',
          method: 'GET',
          params: {
            'ratings': _.mapValues(ratings, function(m) { return m/2; })
          }
        })
      }
    }
  }

})();
