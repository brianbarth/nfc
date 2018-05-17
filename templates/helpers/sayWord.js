const Handlebars = require('handlebars');

Handlebars.registerHelper('sayWord', function(text, callback, options) {

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
      
  u.onend = function () {
      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);

});

  