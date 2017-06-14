(function() {
  'use strict';
  angular.module('words').factory('categoryManager', ['$log', 'wordEndpoint', 'userService', 'config', function($log, wordEndpoint, userService, config) {
    var categoryUrl = config.apiUrl + '/category';

    var userId, categories;

    function find(name) {
      return _.find(categories, function(current) {
        return current.name === name;
      });
    }

    return {
      init: function(callback) {
        userId = userService.get();
        categories = wordEndpoint.load(categoryUrl + '/' + userId);

        callback(categories);
      },
      get: function() {
        return categories;
      },
      add: function(category, img, callback) {
        wordEndpoint.uploadImg(categoryUrl + '/' + userId + '/' + category, img)
        .$promise.then(function(res) {
          if(res.success) {
            categories.push(res.category);
          } else {
            $log.error('Error occured %s', res.err);
          }
          callback(res);
        }).catch(function(res) {
          $log.error('Error occured %s', res.data.err);
          callback(res);
        });
      },
      delete: function(category) {
        var index = categories.indexOf(category);
        if(index !== -1) {

          wordEndpoint.delete(categoryUrl + '/' + userId + '/' + category.name)
          .$promise.then(function(res) {
            if(res.success) {
              categories.splice(index, 1);
            } else {
              $log.error('Error on server side %s', res.err);
            }
          });
        }
      }
    };
  }]);
}());