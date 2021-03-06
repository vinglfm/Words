(function() {
  'use strict';
  angular.module('words').factory('quizManager', ['userService', 'wordManager', 'config', function(userService, wordManager, config) {
    var quiz, quizUrl;

    var factory = {
      init: function(category, lang, callback) {
        var quizUrl = config.apiUrl + '/quiz/';
        var allowDuplicates = userService.allowDuplicates();
        wordManager.init(quizUrl + category + '/' + lang + '/' + allowDuplicates, function() {
          factory.onLoad();
          callback();
        });
      },
      next: function() {
        return wordManager.nextWord();
      },
      onLoad: function() {
        quiz = wordManager.getWord();
      },
      isLoaded: function() {
        return angular.isDefined(quiz);
      },
      word: function() {
        return quiz.word;
      },
      options: function() {
        return quiz.options;
      },
      answer: function(index) {
        if(index !== -1 && quiz.options[index] === quiz.answer) {
          return index;
        }
        return quiz.options.indexOf(quiz.answer);
      },
      clear: function() {
        wordManager.clear();
        quiz = undefined;
      }
    };

    return factory;
  }]);
}());
