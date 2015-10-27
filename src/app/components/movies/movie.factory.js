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

    var suggest_template = {
      suggestions: {
        text: "",
        term: {
          size: 5, field: "title", sort: "score", min_word_length: 3
        }
      }
    }

    var suggestions = [];

    var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'debug'
    });

    var PS_URL = 'http://localhost:5000';
    var RECOMMENDER_URL = 'http://localhost:7000';

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
        var suggest = _.clone(suggest_template);
        query.bool.must = [];
        _.forOwn(qstring, function(v, k) {
          if(v) query.bool.must.push({
            query_string: {
                  query: qstring[k],
                  fields: [k]
              }
          });
        });

        if(qstring && qstring.title) {
          suggest.suggestions.text = qstring.title;
        }

        return client.search({
          index: 'popcorn-saver',
          type: 'movie',
          size: 20,
          body: {
            query: query,
            suggest: suggest
          }
        }).then(function(resp){
          suggestions = _.map(resp.suggest.suggestions, function(s) {
            return {
              text: s.text,
              options: _.map(s.options, function(o) { return o.text; })
            };
          });
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
      getSuggestions: function() {
        return suggestions;
      },
      resetRatings: function() {
        $localForage.removeItem('ratings');
        $http({
          url: PS_URL + '/ratings',
          method: 'DELETE'
        });
      },
      getRatings: function() {
        return $localForage.getItem('ratings');
      },
      addMovieRating: function(movieId, rating) {
        var payload = new FormData();
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

          payload.append('preference', rating/2);
          payload.append('user_id', 0);
          payload.append('item_id', movieId);
          payload. append('created_at', Date.now());
          $http({
            url: PS_URL + '/ratings',
            method: 'POST',
            headers: { 'Content-Type': undefined },
            data: payload,
            transformRequest: function(data) { return data; }
          });
        });
      },
      getRecommendations: function(type) {
        type = type || 'user';
        return $http({
          url: RECOMMENDER_URL + '/recommendations',
          method: 'GET',
          params: {
            'type': type,
            'user': 0
          }
        }).then(function(recommendations) {
          var movieIds = _.pluck(recommendations.data, 'itemID');
          var qstring = _(movieIds).join(" OR ");
          return client.search({
            index: 'popcorn-saver',
            type: 'movie',
            size: 20,
            body: {
              query: {
                query_string: {
                  query: qstring,
                  fields: ['movieId']
                }
              }
            }
          });
        }).then(function(resp) {
          var movies = _.map(resp.hits.hits, function(h){ return h._source; });
          var results = _.map(movies, _get_Poster);
          return $q.all(results);
        });
      },
      getTweets: function(movieId) {
        return client.search({
          index: 'popcorn-saver-tweets',
          type: 'movie',
          size: 20,
          body: {
            query: {
              term : {
                  movieId : movieId
                }
            }
          }
        }).then(function(resp) {
          var tweets = _(resp.hits.hits[0]._source.tweets)
                        .map(function(t) {
                          t.polarity = parseFloat(t.polarity);
                          return t;
                        })
                        .sortBy(function(t) {
                          return t.polarity;
                        }).value();
          var result = tweets.slice(0,3).concat(tweets.slice(tweets.length - 3, tweets.length));
          var defered = $q.defer();
          defered.resolve(_.uniq(result));
          return defered.promise;
        });
      }
    }
  }

})();
